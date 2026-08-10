from __future__ import annotations

import logging
import uuid
from typing import AsyncGenerator, List, Tuple

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from openai import AsyncOpenAI

from config import settings
from database import get_chroma_collection, get_embedder
from schema import IngestResponse, SourceChunk

logger = logging.getLogger(__name__)


class ChatbotService:

    def _get_llm_client(self) -> AsyncOpenAI:
        return AsyncOpenAI(
            api_key=settings.groq_api_key,
            base_url="https://api.groq.com/openai/v1",
        )

    SYSTEM_PROMPT = (
        "You are an intelligent portfolio assistant for Sanjana Sao, "
        "a Senior AI/ML Engineer. Answer questions about her experience, "
        "projects, skills, and achievements using ONLY the context provided. "
        "If the context does not contain the answer, say so honestly. "
        "Be concise, professional, and highlight technical depth where relevant."
    )

    def ingest_pdf(self) -> IngestResponse:
        logger.info("Ingesting PDF: %s", settings.pdf_path)
        loader = PyPDFLoader(settings.pdf_path)
        raw_docs: List[Document] = loader.load()
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=settings.chunk_size,
            chunk_overlap=settings.chunk_overlap,
            separators=["\n\n", "\n", " ", ""],
        )
        chunks: List[Document] = splitter.split_documents(raw_docs)
        if not chunks:
            return IngestResponse(status="error", chunks_indexed=0,
                collection=settings.collection_name, message="No text extracted.")
        embedder = get_embedder()
        texts = [c.page_content for c in chunks]
        embeddings: List[List[float]] = embedder.encode(
            texts, show_progress_bar=False, convert_to_numpy=True).tolist()
        collection = get_chroma_collection()
        ids = [str(uuid.uuid4()) for _ in chunks]
        metadatas = [{"source": c.metadata.get("source", settings.pdf_path),
                      "page": str(c.metadata.get("page", "0"))} for c in chunks]
        collection.upsert(ids=ids, embeddings=embeddings, documents=texts, metadatas=metadatas)
        msg = f"Indexed {len(chunks)} chunks."
        logger.info(msg)
        return IngestResponse(status="ok", chunks_indexed=len(chunks),
                              collection=settings.collection_name, message=msg)

    def _retrieve(self, question: str) -> Tuple[List[str], List[SourceChunk]]:
        embedder = get_embedder()
        q_vec: List[float] = embedder.encode([question], convert_to_numpy=True).tolist()[0]
        collection = get_chroma_collection()
        results = collection.query(
            query_embeddings=[q_vec],
            n_results=min(settings.top_k, collection.count() or 1),
            include=["documents", "metadatas", "distances"],
        )
        raw_texts: List[str] = results["documents"][0]
        metadatas: List[dict] = results["metadatas"][0]
        distances: List[float] = results["distances"][0]
        source_chunks = [
            SourceChunk(
                content=text,
                source=f"{meta.get('source', 'resume')} - page {meta.get('page', '?')}",
                score=round(1 - dist, 4),
            )
            for text, meta, dist in zip(raw_texts, metadatas, distances)
        ]
        return raw_texts, source_chunks

    async def stream_chat(
        self,
        question: str,
        session_id: str | None = None,
    ) -> AsyncGenerator[dict, None]:
        if session_id is None:
            session_id = str(uuid.uuid4())
        raw_texts, source_chunks = self._retrieve(question)
        context_block = "\n\n---\n\n".join(raw_texts)
        user_message = f"Context:\n\n{context_block}\n\nQuestion: {question}"
        llm = self._get_llm_client()
        stream = await llm.chat.completions.create(
            model=settings.groq_model,
            messages=[
                {"role": "system", "content": self.SYSTEM_PROMPT},
                {"role": "user",   "content": user_message},
            ],
            temperature=0.3,
            max_tokens=1024,
            stream=True,
        )
        async for chunk in stream:
            delta = chunk.choices[0].delta
            # Normal models use delta.content; reasoning-only models (e.g. gpt-oss-120b)
            # put output in delta.reasoning — fall back to it so either model works.
            token = delta.content or getattr(delta, "reasoning", None)
            if token:
                yield {"type": "token", "token": token}
        yield {"type": "sources", "sources": [s.model_dump() for s in source_chunks]}
        yield {"type": "done", "session_id": session_id, "model": settings.groq_model}

    def collection_count(self) -> int:
        return get_chroma_collection().count()