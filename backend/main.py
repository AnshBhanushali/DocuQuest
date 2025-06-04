# main.py

import os
import io
from typing import List, Dict

from fastapi import FastAPI, UploadFile, File, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langdetect import detect
import openai
from dotenv import load_dotenv

import PyPDF2
import docx
import chromadb
from chromadb.config import Settings

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request


# ─── 1. Load environment (including OPENAI_API_KEY) ────────────────────────
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    raise RuntimeError("OPENAI_API_KEY environment variable is missing")


# ─── 2. Initialize FastAPI ─────────────────────────────────────────────────
app = FastAPI(
    title="Document RAG Backend",
    description="Upload docs, translate if needed, chunk, embed + store in ChromaDB, and query with citations",
    version="0.2.0",
)


# ─── 3. HEAD / to satisfy Render health checks ─────────────────────────────
@app.head("/")
async def head_root():
    return Response(status_code=200)


# ─── 4. Add middleware to allow larger uploads (100 MB) ────────────────────
class LimitUploadSizeMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_upload_size: int):
        super().__init__(app)
        self.max_upload_size = max_upload_size

    async def dispatch(self, request: Request, call_next):
        # Only check multipart/form-data (file uploads)
        content_type = request.headers.get("content-type") or ""
        if request.method == "POST" and "multipart/form-data" in content_type:
            content_length = request.headers.get("content-length")
            try:
                if content_length and int(content_length) > self.max_upload_size:
                    return Response(content="Upload payload too large", status_code=413)
            except ValueError:
                # If content-length is missing or invalid, let FastAPI handle it
                pass

        return await call_next(request)


# Set maximum upload size to 100 MB = 100 * 1024 * 1024 bytes
MAX_UPLOAD_SIZE = 50 * 1024 * 1024
app.add_middleware(LimitUploadSizeMiddleware, max_upload_size=MAX_UPLOAD_SIZE)


# ─── 5. Allow CORS from our frontend ───────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://docuquest-sigma.vercel.app",
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── 6. Initialize ChromaDB client & collection ────────────────────────────
chroma_client = chromadb.Client(
    Settings(
        persist_directory="chroma_db",
        anonymized_telemetry=False,
    )
)
collection = chroma_client.get_or_create_collection(name="documents")


# ─── 7. Pydantic Models ─────────────────────────────────────────────────────
class ChunkWithEmbedding(BaseModel):
    chunk_index: int
    text: str
    original_language: str
    embedding: List[float]


class UploadResponse(BaseModel):
    filename: str
    total_chunks: int
    chunks: List[ChunkWithEmbedding]


class QueryRequest(BaseModel):
    question: str
    top_k: int = 3  # number of chunks to retrieve for context


class QueryResponse(BaseModel):
    answer: str
    citations: List[Dict[str, str]]  # both source and chunk_index are strings


# ─── 8. Utility Functions ───────────────────────────────────────────────────
def extract_text_from_pdf(file_stream: io.BytesIO) -> str:
    reader = PyPDF2.PdfReader(file_stream)
    text = []
    for page in reader.pages:
        try:
            text.append(page.extract_text() or "")
        except Exception:
            continue
    return "\n".join(text)


def extract_text_from_docx(file_stream: io.BytesIO) -> str:
    doc = docx.Document(file_stream)
    paragraphs = [p.text for p in doc.paragraphs if p.text]
    return "\n".join(paragraphs)


def extract_text_from_txt(file_stream: io.BytesIO) -> str:
    return file_stream.read().decode("utf-8", errors="ignore")


def detect_language_of_text(text: str) -> str:
    try:
        return detect(text[:2000])
    except Exception:
        return "unknown"


async def translate_to_english(text: str) -> str:
    prompt = (
        "Translate the following text to fluent English. "
        "Maintain meaning exactly. "
        "Do not add any commentary—only output the translation.\n\n"
        f"{text}"
    )
    try:
        resp = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a translation engine."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.0,
            max_tokens=len(text.split()) * 2,
        )
        return resp.choices[0].message.content.strip()
    except Exception:
        return text


def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
    chunks = []
    start = 0
    length = len(text)
    while start < length:
        end = min(start + chunk_size, length)
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks


def get_embeddings_for_chunks(chunks: List[str]) -> List[List[float]]:
    """
    Generate embeddings by calling OpenAI’s v1-style SDK.
    """
    model_name = "text-embedding-3-small"
    batch_size = 8
    all_embeddings = []
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i : i + batch_size]
        resp = openai.embeddings.create(model=model_name, input=batch)
        for data_obj in resp.data:
            all_embeddings.append(data_obj.embedding)
    return all_embeddings


def build_answer_prompt(question: str, relevant_chunks: List[Dict]) -> str:
    """
    Build a prompt that instructs the LLM to answer using only the provided chunks.
    Each chunk dict has: 'text', 'source', 'chunk_index'.
    """
    context_parts = []
    for c in relevant_chunks:
        context_parts.append(
            f"(source: {c['source']} – chunk #{c['chunk_index']})\n{c['text']}\n"
        )
    context_str = "\n---\n".join(context_parts)

    prompt = (
        "You are an AI assistant. Use ONLY the following context to answer the user’s question. "
        "Cite each piece of evidence in parentheses like this: “(source: filename.pdf – chunk #3)”.\n\n"
        "Context:\n"
        f"{context_str}\n\n"
        "Question:\n"
        f"{question}\n\n"
        "Answer (include citations):"
    )
    return prompt


# ─── 9. Root Endpoint ───────────────────────────────────────────────────────
@app.get("/")
async def read_root():
    return {
        "message": "FastAPI backend is running. Use POST /upload to upload documents and POST /query to query."
    }


# ─── 10. /upload Endpoint ─────────────────────────────────────────────────────
@app.post("/upload", response_model=UploadResponse)
async def upload_document(file: UploadFile = File(...)):
    filename = file.filename or ""
    if not filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    contents = await file.read()
    file_stream = io.BytesIO(contents)

    ext = filename.lower().split(".")[-1]
    if ext == "pdf":
        raw_text = extract_text_from_pdf(file_stream)
    elif ext in ("docx", "doc"):
        raw_text = extract_text_from_docx(file_stream)
    elif ext in ("txt", "md", "text"):
        raw_text = extract_text_from_txt(file_stream)
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {ext}")

    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="No extractable text in document")

    # Detect and translate if not English
    detected_lang = detect_language_of_text(raw_text)
    if detected_lang != "en":
        raw_text = await translate_to_english(raw_text)
        original_lang = detected_lang
    else:
        original_lang = "en"

    # Chunk the (possibly translated) text
    chunk_list = chunk_text(raw_text, chunk_size=1000, overlap=200)

    # Generate embeddings
    embeddings = get_embeddings_for_chunks(chunk_list)

    # Upsert into ChromaDB
    ids = []
    metadatas = []
    documents = []
    for idx, chunk in enumerate(chunk_list):
        chunk_id = f"{filename}_chunk_{idx}"
        ids.append(chunk_id)
        metadatas.append({
            "source": filename,
            "chunk_index": idx,
            "original_language": original_lang
        })
        documents.append(chunk)

    collection.add(
        ids=ids,
        metadatas=metadatas,
        documents=documents,
        embeddings=embeddings,
    )

    response_chunks = []
    for idx, (c, emb) in enumerate(zip(chunk_list, embeddings)):
        response_chunks.append({
            "chunk_index": idx,
            "text": c,
            "original_language": original_lang,
            "embedding": emb,
        })

    return {
        "filename": filename,
        "total_chunks": len(response_chunks),
        "chunks": response_chunks,
    }


# ─── 11. /query Endpoint ─────────────────────────────────────────────────────
@app.post("/query", response_model=QueryResponse)
async def query_document(q: QueryRequest):
    question = q.question.strip()
    if not question:
        raise HTTPException(status_code=400, detail="Question must not be empty")

    # 1. Create embedding for the question
    resp = openai.embeddings.create(model="text-embedding-3-small", input=[question])
    question_embedding = resp.data[0].embedding

    # 2. Query Chroma for top_k similar chunks
    results = collection.query(
        query_embeddings=[question_embedding],
        n_results=q.top_k,
        include=["metadatas", "documents"]
    )

    metadatas = results["metadatas"][0]  # list of metadata dicts
    docs = results["documents"][0]        # list of chunk texts

    relevant_chunks = []
    for md, chunk_text in zip(metadatas, docs):
        relevant_chunks.append({
            "source": md.get("source", "unknown"),
            "chunk_index": md.get("chunk_index", -1),
            "text": chunk_text
        })

    prompt = build_answer_prompt(question, relevant_chunks)

    try:
        chat_resp = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=512,
            temperature=0.2,
        )
        answer = chat_resp.choices[0].message.content.strip()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ChatCompletion failed: {e}")

    citations = [
        {"source": rc["source"], "chunk_index": str(rc["chunk_index"])}
        for rc in relevant_chunks
    ]

    return {"answer": answer, "citations": citations}
