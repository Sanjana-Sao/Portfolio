from __future__ import annotations
import logging, uuid
from typing import AsyncGenerator
import pdfplumber
from openai import AsyncOpenAI
from config import settings

logger = logging.getLogger(__name__)

def _extract_pdf_text(pdf_path: str) -> str:
    parts = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            t = page.extract_text()
            if t:
                parts.append(t)
    return '\n\n'.join(parts)

_RESUME_TEXT: str = ''

def get_resume_text() -> str:
    global _RESUME_TEXT
    if not _RESUME_TEXT:
        logger.info('Loading resume: %s', settings.pdf_path)
        _RESUME_TEXT = _extract_pdf_text(settings.pdf_path)
        logger.info('Resume loaded - %d chars', len(_RESUME_TEXT))
    return _RESUME_TEXT

class ChatbotService:
    def _get_client(self) -> AsyncOpenAI:
        return AsyncOpenAI(api_key=settings.groq_api_key, base_url='https://api.groq.com/openai/v1')

    def _system_prompt(self) -> str:
        return (
            'You are a portfolio assistant for Sanjana Sao, a Senior AI/ML Engineer. '
            'Answer using ONLY the resume below. Be concise and professional.\n\n'
            '=== RESUME ===\n' + get_resume_text() + '\n=== END RESUME ==='
        )

    async def stream_chat(self, question: str, session_id=None):
        if not session_id:
            session_id = str(uuid.uuid4())
        stream = await self._get_client().chat.completions.create(
            model=settings.groq_model,
            messages=[{'role': 'system', 'content': self._system_prompt()}, {'role': 'user', 'content': question}],
            temperature=0.3, max_tokens=1024, stream=True,
        )
        async for chunk in stream:
            token = chunk.choices[0].delta.content or ''
            if token:
                yield {'type': 'token', 'token': token}
        yield {'type': 'done', 'session_id': session_id}
