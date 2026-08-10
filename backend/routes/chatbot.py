from __future__ import annotations

import json
import logging
from functools import lru_cache

from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect, status

from config import settings
from schema import HealthResponse, IngestResponse, WSErrorMessage, WSIncomingMessage
from service import ChatbotService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chat", tags=["Chatbot"])


# ── Dependency: shared service instance ──────────────────────────────

@lru_cache(maxsize=1)
def get_service() -> ChatbotService:
    return ChatbotService()


# ── Routes ────────────────────────────────────────────────────────────

@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Liveness check — returns app version and ChromaDB doc count.",
)
def health_check() -> HealthResponse:
    """
    Lightweight ping endpoint.
    Returns app version and how many chunks are indexed in ChromaDB.
    """    
    try:
        count = get_service().collection_count()
    except Exception:
        count = 0
    return HealthResponse(
        status="ok",
        version=settings.app_version,
        collection_count=count,
    )


@router.post(
    "/ingest",
    response_model=IngestResponse,
    status_code=status.HTTP_200_OK,
    summary="Load the portfolio PDF into ChromaDB (call once on first deploy).",
)
def ingest_pdf() -> IngestResponse:
    """
    Reads settings.pdf_path, splits into chunks, embeds with SentenceTransformer,
    and upserts into ChromaDB. Idempotent — safe to call multiple times.
    """
    try:
        result = get_service().ingest_pdf()
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"PDF not found at: {settings.pdf_path}",
        ) from exc
    except Exception as exc:
        logger.exception("Ingestion failed: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ingestion error: {str(exc)}",
        ) from exc

    if result.status == "error":
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=result.message,
        )
    return result


# ── WebSocket: streaming chat ─────────────────────────────────────────

@router.websocket("/ws")
async def websocket_chat(websocket: WebSocket) -> None:
    """
    Persistent WebSocket endpoint for token-streaming RAG chat.

    Connection lifecycle:
      1.  Client connects  →  ws://host/chat/ws
      2.  Server accepts   →  waits for messages
      3.  Client sends     →  {"type":"ask","question":"...","session_id":"..."}
      4.  Server streams   →  token … token … sources … done
      5.  Repeat from 3 for the next question (single persistent connection).

    Message schemas (all JSON):
      CLIENT → SERVER
        { "type": "ask", "question": "<str>", "session_id": "<str|null>" }

      SERVER → CLIENT
        { "type": "token",   "token": "<str>" }
        { "type": "sources", "sources": [{content, source, score}, ...] }
        { "type": "done",    "session_id": "<str>", "model": "<str>" }
        { "type": "error",   "detail": "<str>" }
    """
    await websocket.accept()
    logger.info("WebSocket connected: %s", websocket.client)
    svc = get_service()

    try:
        while True:
            raw = await websocket.receive_text()

            # Validate incoming message
            try:
                payload = WSIncomingMessage.model_validate_json(raw)
            except Exception as parse_err:
                await websocket.send_text(
                    WSErrorMessage(detail=f"Invalid message: {parse_err}").model_dump_json()
                )
                continue  # keep connection open — wait for next message

            # Guard: ChromaDB must have documents
            if svc.collection_count() == 0:
                await websocket.send_text(
                    WSErrorMessage(
                        detail="ChromaDB is empty — call POST /chat/ingest first."
                    ).model_dump_json()
                )
                continue

            logger.info(
                "WS ask | session=%s | q=%s",
                payload.session_id,
                payload.question[:80],
            )

            # Stream RAG response
            try:
                async for msg in svc.stream_chat(
                    question=payload.question,
                    session_id=payload.session_id,
                ):
                    await websocket.send_text(json.dumps(msg))
            except Exception as stream_err:
                logger.exception("Stream error: %s", stream_err)
                await websocket.send_text(
                    WSErrorMessage(detail=str(stream_err)).model_dump_json()
                )

    except WebSocketDisconnect:
        logger.info("WebSocket disconnected: %s", websocket.client)
    except Exception as exc:
        logger.exception("WebSocket error: %s", exc)
        try:
            await websocket.send_text(
                WSErrorMessage(detail=f"Server error: {str(exc)}").model_dump_json()
            )
        except Exception:
            pass
