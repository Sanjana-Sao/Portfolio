from __future__ import annotations

import logging
import sys
import os

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from fastapi.responses import FileResponse

from config import settings
from routes import chatbot_router

# ── Logging ───────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s — %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger(__name__)


# ── Lifespan (startup / shutdown) ────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Runs once on startup to warm up the embedder and ChromaDB connection
    so the first request is not slow.
    """
    logger.info("🚀 Starting %s v%s", settings.app_name, settings.app_version)
    logger.info("Warming up embedder: %s", settings.embedding_model)

    # Import here to trigger the @lru_cache singletons
    from database import get_chroma_collection, get_embedder
    get_embedder()           # loads SentenceTransformer model into memory
    get_chroma_collection()  # connects to / creates ChromaDB collection

    logger.info("✅ Ready — ChromaDB collection: '%s'", settings.collection_name)
    yield
    logger.info("🛑 Shutting down.")


# ── App factory ───────────────────────────────────────────────────────

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "RAG-powered portfolio chatbot. "
        "Answers questions about Sanjana Sao's experience using her resume PDF."
    ),
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────

app.include_router(chatbot_router)


# ── Custom OpenAPI: inject WebSocket route so it shows in /docs ───────

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )

    # Manually add the WebSocket endpoint that FastAPI omits
    schema["paths"]["/chat/ws"] = {
        "get": {
            "tags": ["Chatbot"],
            "summary": "WebSocket — streaming RAG chat (connect via ws://)",
            "description": (
                "**Upgrade this connection to WebSocket** to stream token-by-token answers.\n\n"
                "**Connect:** `ws://localhost:8000/chat/ws`\n\n"
                "**Send:**\n```json\n"
                '{"type":"ask","question":"What projects has Sanjana built?","session_id":null}\n'
                "```\n\n"
                "**Receive (in order):**\n"
                "```json\n"
                '{"type":"token","token":"Sanjana "}\n'
                '{"type":"token","token":"has built..."}\n'
                '{"type":"sources","sources":[{"content":"...","source":"resume — page 1","score":0.92}]}\n'
                '{"type":"done","session_id":"uuid","model":"llama3-8b-8192"}\n'
                "```\n\n"
                "**Error frame:** `{\"type\":\"error\",\"detail\":\"...\"}`"
            ),
            "operationId": "websocket_chat",
            "responses": {
                "101": {"description": "WebSocket upgrade — switching protocols"},
                "400": {"description": "ChromaDB empty — call POST /chat/ingest first"},
            },
        }
    }

    app.openapi_schema = schema
    return app.openapi_schema


app.openapi = custom_openapi

@app.get("/", tags=["Root"])
def root():
    return {
        "app": settings.app_name,
        "version": settings.app_version,
        "docs": "/docs",
        "health": "/chat/health",
        "ingest": "POST /chat/ingest",
        "websocket": "ws://host/chat/ws",
    }


@app.get("/resume", tags=["Resume"])
def download_resume():
    """Serve Sanjana's resume PDF as a download."""
    resume_path = os.path.join(os.path.dirname(__file__), "data", "resume.pdf")
    if not os.path.exists(resume_path):
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Resume not found")
    return FileResponse(
        path=resume_path,
        media_type="application/pdf",
        filename="Sanjana_Sao_Resume.pdf",
        headers={"Content-Disposition": "attachment; filename=Sanjana_Sao_Resume.pdf"},
    )


# ── Entry point ───────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
