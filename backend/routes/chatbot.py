from __future__ import annotations
import json, logging
from functools import lru_cache
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from service import ChatbotService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/chat", tags=["Chatbot"])

@lru_cache(maxsize=1)
def get_service() -> ChatbotService:
    return ChatbotService()

@router.get("/health")
def health():
    return {"status": "ok"}

@router.websocket("/ws")
async def websocket_chat(websocket: WebSocket):
    await websocket.accept()
    svc = get_service()
    try:
        while True:
            raw = await websocket.receive_text()
            try:
                payload = json.loads(raw)
                question = payload.get("question", "").strip()
                session_id = payload.get("session_id")
            except Exception:
                await websocket.send_text(json.dumps({"type": "error", "detail": "Invalid JSON"}))
                continue
            if not question:
                await websocket.send_text(json.dumps({"type": "error", "detail": "Empty question"}))
                continue
            try:
                async for msg in svc.stream_chat(question=question, session_id=session_id):
                    await websocket.send_text(json.dumps(msg))
            except Exception as e:
                logger.exception("Stream error: %s", e)
                await websocket.send_text(json.dumps({"type": "error", "detail": str(e)}))
    except WebSocketDisconnect:
        logger.info("WebSocket disconnected")
