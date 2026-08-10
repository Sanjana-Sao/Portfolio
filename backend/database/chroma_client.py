from __future__ import annotations

import logging
from functools import lru_cache

import chromadb
from chromadb import Collection
from chromadb.config import Settings as ChromaSettings
from sentence_transformers import SentenceTransformer

from config import settings

logger = logging.getLogger(__name__)


# ── Embedder singleton ────────────────────────────────────────────────

@lru_cache(maxsize=1)
def get_embedder() -> SentenceTransformer:
    """
    Load the SentenceTransformer model once and reuse across all requests.
    Model name is pulled from settings.embedding_model (.env).
    """
    logger.info("Loading embedding model: %s", settings.embedding_model)
    return SentenceTransformer(settings.embedding_model)


# ── ChromaDB client singleton ─────────────────────────────────────────

@lru_cache(maxsize=1)
def _get_chroma_client() -> chromadb.PersistentClient:
    """
    Single persistent ChromaDB client stored at settings.chroma_persist_dir.
    Data survives server restarts — no re-ingestion needed unless PDF changes.
    """
    logger.info("Initialising ChromaDB at: %s", settings.chroma_persist_dir)
    return chromadb.PersistentClient(
        path=settings.chroma_persist_dir,
        settings=ChromaSettings(anonymized_telemetry=False),
    )


def get_chroma_collection() -> Collection:
    """
    Return (or create) the named ChromaDB collection.
    Uses cosine similarity — best for sentence-transformer embeddings.
    """
    client = _get_chroma_client()
    collection = client.get_or_create_collection(
        name=settings.collection_name,
        metadata={"hnsw:space": "cosine"},
    )
    logger.info(
        "ChromaDB collection '%s' ready — %d doc(s) indexed.",
        settings.collection_name,
        collection.count(),
    )
    return collection
