from __future__ import annotations

from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import List


class Settings(BaseSettings):
    """
    Central configuration object.
    All values are read from the .env file at project root.
    Import: from config import settings
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ── App ──────────────────────────────────────────────────────────
    app_name: str = Field(default="Portfolio Chatbot API")
    app_version: str = Field(default="1.0.0")

    # ── Groq LLM ─────────────────────────────────────────────────────
    groq_api_key: str = Field(default="")
    groq_model: str = Field(default="llama3-8b-8192")

    # ── ChromaDB ─────────────────────────────────────────────────────
    chroma_persist_dir: str = Field(default="./chroma_db")
    collection_name: str = Field(default="resume_docs")

    # ── Data ─────────────────────────────────────────────────────────
    pdf_path: str = Field(default="./data/RenderCV_EngineeringResumes_Theme.pdf")

    # ── Embedding ────────────────────────────────────────────────────
    embedding_model: str = Field(default="all-MiniLM-L6-v2")

    # ── RAG tuning ───────────────────────────────────────────────────
    chunk_size: int = Field(default=500)
    chunk_overlap: int = Field(default=60)
    top_k: int = Field(default=5)

    # ── CORS ─────────────────────────────────────────────────────────
    cors_origins: List[str] = Field(default=["http://localhost:4200"])


# Single shared instance — import this everywhere
settings = Settings()
