# 📄 DocuQuest

**DocuQuest** is an AI-powered document question-answering assistant that combines Retrieval-Augmented Generation (RAG) with a Model Context Protocol (MCP). Users can upload any document—PDFs, Word files, or text—and ask questions directly in a chat-like interface. The system intelligently processes and chunks the content, indexes it into a vector database using ChromaDB, and leverages OpenAI’s language models to generate accurate, context-aware responses with citations.

---

## 🚀 Features

* 📁 **Document Upload**: Supports multiple formats for seamless ingestion.
* 🧠 **RAG + MCP Architecture**: Contextually relevant answers drawn from uploaded files.
* 🌍 **Multilingual Support**: Documents in any language are automatically translated and queried.
* 📚 **Citation-Aware Responses**: References are linked to specific parts of the source document.
* 💬 **Interactive Chat UI**: ChatGPT-like interface for smooth and intuitive interaction.
* ⚡ **FastAPI + Next.js Stack**: Python backend with FastAPI and a stylish, responsive frontend built in Next.js.
* 📦 **Vector Database**: Uses ChromaDB for fast and accurate similarity search.

---

## 🛠️ Tech Stack

* **Frontend**: Next.js, Ant Design
* **Backend**: FastAPI (Python)
* **LLM Provider**: OpenAI GPT Models
* **Vector DB**: ChromaDB
* **File Handling**: PyMuPDF, docx, langchain document loaders
* **Deployment**: Ready for cloud deployment (e.g., Vercel, Render, GCP, Azure)

---

## 📂 How It Works

1. User uploads a document.
2. The backend extracts and chunks the content.
3. Chunks are embedded and stored in ChromaDB.
4. A user query is processed with context-aware retrieval from the vector DB.
5. OpenAI's model generates an answer with source references.
6. Results are presented in an elegant chat UI.

---

## 🧪 Use Cases

* Academic Research Assistance
* Legal Document Search
* Corporate Knowledge Base
* Medical Report Summarization
* Multilingual Translation QA

---

## 📌 Future Enhancements

* User Authentication & History Tracking
* Support for collaborative document review
* Integration with other LLMs (Anthropic, Mistral)
* PDF annotation with cited answers
* Voice input and speech synthesis

