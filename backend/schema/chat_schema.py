from __future__ import annotations

from pydantic import BaseModel, Field
from typing import List, Literal, Optional


# ═══════════════════════════════════════════════════════════════════════
# HTTP schemas (ingest + health — still REST)
# ═══════════════════════════════════════════════════════════════════════

class SourceChunk(BaseModel):
    """A single retrieved context chunk surfaced alongside the answer."""
    content: str = Field(description="Raw text of the retrieved chunk.")
    source: str = Field(description="Origin label (filename / page number).")
    score: Optional[float] = Field(default=None, description="Cosine similarity (0–1).")


class IngestResponse(BaseModel):
    """Returned after the PDF is loaded into ChromaDB."""
    status: str = Field(description="'ok' or 'error'.")
    chunks_indexed: int = Field(description="Number of text chunks stored.")
    collection: str = Field(description="ChromaDB collection name.")
    message: str = Field(description="Human-readable summary.")


class HealthResponse(BaseModel):
    """Lightweight liveness check response."""
    status: str = "ok"
    version: str
    collection_count: int = Field(description="Documents currently in ChromaDB.")


# ═══════════════════════════════════════════════════════════════════════
# WebSocket message schemas
# Each message is a JSON object with a "type" discriminator field.
#
# CLIENT → SERVER
#   { "type": "ask", "question": "...", "session_id": "..." }
#
# SERVER → CLIENT (in order)
#   { "type": "token",   "token": "..." }          ← streamed word-by-word
#   { "type": "sources", "sources": [...] }        ← after all tokens done
#   { "type": "done",    "session_id": "..." }     ← signals stream complete
#   { "type": "error",   "detail": "..." }         ← on any failure
# ═══════════════════════════════════════════════════════════════════════

# ── Inbound ──────────────────────────────────────────────────────────

class WSIncomingMessage(BaseModel):
    """Message sent FROM the client TO the server over the WebSocket."""
    type: Literal["ask"] = "ask"
    question: str = Field(
        ...,
        min_length=1,
        max_length=1000,
        description="User question directed at the portfolio assistant.",
    )
    session_id: Optional[str] = Field(
        default=None,
        description="Persist across multiple asks to track the session.",
    )


# ── Outbound ─────────────────────────────────────────────────────────

class WSTokenMessage(BaseModel):
    """One streamed token fragment sent server → client."""
    type: Literal["token"] = "token"
    token: str


class WSSourcesMessage(BaseModel):
    """Sent once after all tokens — the retrieval context used."""
    type: Literal["sources"] = "sources"
    sources: List[SourceChunk]


class WSDoneMessage(BaseModel):
    """Signals that the full response has been streamed."""
    type: Literal["done"] = "done"
    session_id: str
    model: str


class WSErrorMessage(BaseModel):
    """Sent when any server-side error occurs mid-stream."""
    type: Literal["error"] = "error"
    detail: str
