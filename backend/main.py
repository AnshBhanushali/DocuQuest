import os
import io
from typing import List

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langdetect import detect
import openai
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.llms import OpenAI
from langchain.chains import RetrievalQA
from dotenv import load_dotenv

import PyPDF2
import docx

load_dotenv()

# Make sure your OPENAI_API_KEY is set in the environment:
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    raise RuntimeError("OPENAI_API_KEY environment variable is missing")

app = FastAPI(
    title="Document RAG Backend",
    description="Upload docs, translate if needed, chunk, embed, and query via OpenAIEmbeddings + ChromaDB",
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

class QueryRequest(BaseModel):
    question: str

# ---------- Setup Embedding Model and Vector Store ----------

embedding_model = OpenAIEmbeddings(model="text-embedding-3-small")
vectordb = Chroma(persist_directory="db", embedding_function=embedding_model)

# ---------- Utility Functions ----------

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
    content = file_stream.read().decode("utf-8", errors="ignore")
    return content

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
        resp = openai.ChatCompletion.create(
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
    text_length = len(text)
    while start < text_length:
        end = min(start + chunk_size, text_length)
        chunks.append(text[start:end])
        start += chunk_size - overlap
    return chunks

def get_embeddings_for_chunks(chunks: List[str]) -> List[List[float]]:
    embedder = OpenAIEmbeddings(model="text-embedding-3-small")
    return embedder.embed_documents(chunks)

# ---------- /upload Endpoint ----------

@app.post("/upload", response_model=UploadResponse)
async def upload_document(file: UploadFile = File(...)):
    filename = file.filename
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
        raise HTTPException(status_code=400, detail="Could not extract any text from the document")

    detected_lang = detect_language_of_text(raw_text)
    if detected_lang != "en":
        raw_text = await translate_to_english(raw_text)
        original_language = detected_lang
    else:
        original_language = "en"

    chunk_list = chunk_text(raw_text, chunk_size=1000, overlap=200)
    embeddings = get_embeddings_for_chunks(chunk_list)

    # Store into Chroma
    vectordb.add_texts(
        texts=chunk_list,
        metadatas=[
            {"source": filename, "chunk_index": i, "original_language": original_language}
            for i in range(len(chunk_list))
        ]
    )

    response_chunks = []
    for idx, (c, emb_vec) in enumerate(zip(chunk_list, embeddings)):
        response_chunks.append(
            ChunkWithEmbedding(
                chunk_index=idx,
                text=c,
                original_language=original_language,
                embedding=emb_vec,
            )
        )

    return UploadResponse(
        filename=filename,
        total_chunks=len(response_chunks),
        chunks=response_chunks,
    )

# ---------- /query Endpoint ----------

@app.post("/query")
async def query_docs(req: QueryRequest):
    retriever = vectordb.as_retriever(search_kwargs={"k": 3})
    qa_chain = RetrievalQA.from_chain_type(
        llm=OpenAI(temperature=0),
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True
    )

    result = qa_chain(req.question)

    return {
        "answer": result["result"],
        "citations": [
            {
                "source": doc.metadata.get("source", "unknown"),
                "chunk_index": doc.metadata.get("chunk_index", -1),
                "content": doc.page_content
            }
            for doc in result["source_documents"]
        ]
    }
