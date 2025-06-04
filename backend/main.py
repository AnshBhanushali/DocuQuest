# main.py
import os
import io
from typing import List, Dict, Any

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langdetect import detect
import openai
from langchain.embeddings.openai import OpenAIEmbeddings
from dotenv import load_dotenv

import PyPDF2
import docx

load_dotenv()

# Make sure your OPENAI_API_KEY is set in the environment:
# export OPENAI_API_KEY="sk-..."
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    raise RuntimeError("OPENAI_API_KEY environment variable is missing")

app = FastAPI(
    title="Document RAG Backend",
    description="Upload docs, translate if needed, chunk, and embed via OpenAIEmbeddings",
    version="0.1.0",
)

# Allow CORS from localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Pydantic Models ----------

class ChunkWithEmbedding(BaseModel):
    chunk_index: int
    text: str
    original_language: str
    embedding: List[float]  

class UploadResponse(BaseModel):
    filename: str
    total_chunks: int
    chunks: List[ChunkWithEmbedding]

# ---------- Utility Functions ----------

def extract_text_from_pdf(file_stream: io.BytesIO) -> str:
    """Extracts text from a PDF file."""
    reader = PyPDF2.PdfReader(file_stream)
    text = []
    for page in reader.pages:
        try:
            text.append(page.extract_text() or "")
        except Exception:
            continue
    return "\n".join(text)

def extract_text_from_docx(file_stream: io.BytesIO) -> str:
    """Extracts text from a DOCX file."""
    doc = docx.Document(file_stream)
    paragraphs = [p.text for p in doc.paragraphs if p.text]
    return "\n".join(paragraphs)

def extract_text_from_txt(file_stream: io.BytesIO) -> str:
    """Extracts text from a plain text file."""
    content = file_stream.read().decode("utf-8", errors="ignore")
    return content

def detect_language_of_text(text: str) -> str:
    """Uses langdetect to guess the language of given text."""
    try:
        lang = detect(text[:2000])  # only supply first 2000 chars for speed
    except Exception:
        lang = "unknown"
    return lang

async def translate_to_english(text: str) -> str:
    """
    If text is not English, call OpenAI ChatCompletion with a translate prompt.
    Returns English text.
    """
    # We send the entire chunk for translation. In production you might chunk large docs first.
    prompt = (
        "Translate the following text to fluent English. "
        "Maintain meaning exactly. "
        "Do not add any commentary—only output the translation.\n\n"
        f"{text}"
    )
    try:
        resp = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a translation engine."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.0,
            max_tokens=  len(text.split()) * 2,  # allow enough tokens for translation
        )
        translation = resp.choices[0].message.content.strip()
        return translation
    except Exception as e:
        # If translation fails, just return the original
        return text

def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
    """
    Splits text into overlapping chunks of chunk_size characters,
    with the specified overlap.
    """
    chunks = []
    start = 0
    text_length = len(text)
    while start < text_length:
        end = min(start + chunk_size, text_length)
        chunk = text[start:end]
        chunks.append(chunk)
        # Move start forward by chunk_size - overlap
        start += chunk_size - overlap
    return chunks

def get_embeddings_for_chunks(chunks: List[str]) -> List[List[float]]:
    """
    Generates an embedding vector for each chunk using OpenAIEmbeddings.
    Returns a list of embedding vectors (one list of floats per chunk).
    """
    embedder = OpenAIEmbeddings(model="text-embedding-3-small")
    embeddings = embedder.embed_documents(chunks)
    return embeddings

# ---------- /upload Endpoint ----------

@app.post("/upload", response_model=UploadResponse)
async def upload_document(file: UploadFile = File(...)):
    """
    1. Accepts a PDF, DOCX, or TXT via multipart/form-data.
    2. Extracts raw text, detects language, translates if needed.
    3. Splits into overlapping chunks.
    4. Generates embeddings for each chunk.
    5. Returns the chunk texts, metadata, and embedding vectors.
    """
    filename = file.filename
    if not filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    # Read uploaded file into memory (BytesIO)
    contents = await file.read()
    file_stream = io.BytesIO(contents)

    # Determine file type by extension
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
        raise HTTPException(status_code=400, detail="Could not extract any text from the document")

    # Detect language
    detected_lang = detect_language_of_text(raw_text)

    # If not English ("en"), translate entire raw_text to English
    if detected_lang != "en":
        # You could also partition text into smaller pieces here before translation,
        # but we just translate the full text in one call for simplicity.
        raw_text = await translate_to_english(raw_text)
        # After translation, we assume text is now English
        original_language = detected_lang
    else:
        original_language = "en"

    # Chunk the (English) text into overlapping segments
    chunk_list = chunk_text(raw_text, chunk_size=1000, overlap=200)

    # Generate embeddings for each chunk
    embeddings = get_embeddings_for_chunks(chunk_list)

    # Build response data
    response_chunks = []
    for idx, (chunk_text, emb_vec) in enumerate(zip(chunk_list, embeddings)):
        response_chunks.append(
            ChunkWithEmbedding(
                chunk_index=idx,
                text=chunk_text,
                original_language=original_language,
                embedding=emb_vec,
            )
        )

    return UploadResponse(
        filename=filename,
        total_chunks=len(response_chunks),
        chunks=response_chunks,
    )
