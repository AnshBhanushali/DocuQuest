````markdown
# DocuQuest

DocuQuest is a simple tool that lets you upload documents (PDF, Word, or text) and ask questions about their content. It breaks the document into smaller pieces, stores them in a database for quick lookup, and uses OpenAI’s models to give you answers with citations.

---

## Features

- Upload PDF, DOCX, or TXT files.
- Automatically split documents into smaller chunks.
- Store chunks in ChromaDB for fast searching.
- Use OpenAI to generate answers based on your document.
- Show the part of the document where the answer came from.
- Works with documents in any language (it translates before indexing).

---

## Tech Stack

- **Frontend**: Next.js (React), Ant Design  
- **Backend**: FastAPI (Python)  
- **Database**: ChromaDB (local or Docker)  
- **AI / Embeddings**: OpenAI API  

---

## Setup

1. **Clone the repository**  
   ```bash
   git clone https://github.com/<your-org>/DocuQuest.git
   cd DocuQuest
````

2. **Backend**

   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate      
   pip install --upgrade pip
   pip install -r requirements.txt
   ```


3. **Frontend**

   ```bash
   cd ../frontend
   npm install

   * Copy the example:


   * Open `.env.local` and set:

     ```
     NEXT_PUBLIC_API_URL=http://localhost:8000/api
     NEXT_PUBLIC_DEFAULT_MODEL=gpt-4
     ```


## How to Use

1. Click the “+” button in the chat area and upload a document (PDF, DOCX, or TXT).
2. Wait a moment while the document is processed and indexed.
3. Type a question in the chat box (for example, “What is the main point of Chapter 3?”) and press Enter.
4. You’ll see the answer along with a citation showing where in the document it came from.
5. Ask follow-up questions without re-uploading; the context stays in the chat.

---

## File Structure

```
DocuQuest/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI entry point
│   │   ├── routers/
│   │   │   ├── upload.py      # Handles file uploads
│   │   │   └── query.py       # Handles chat queries
│   │   └── services/
│   │       ├── parsing.py     # Code for reading PDFs/Word
│   │       ├── chunker.py     # Breaks text into pieces
│   │       ├── embedder.py    # Creates embeddings & stores in ChromaDB
│   │       └── rag_mcp.py     # Combines context and asks OpenAI
│   ├── requirements.txt       # Python dependencies
│   ├── .env.example           # Example environment variables
│
└── frontend/
    ├── pages/
    │   ├── index.tsx          # Main chat page
    │   └── _app.tsx           # App setup (themes, etc.)
    ├── components/            # Reusable UI bits (ChatBubble, FileUploader)
    ├── styles/                # Styling files or theme overrides
    ├── public/                # Static images, icons
    ├── package.json           # Frontend dependencies
    ├── .env.local.example     # Example frontend env variables
    └── next.config.js         # Next.js settings
```

---

## Common Commands

### Backend

```bash
# Activate virtual environment
source venv/bin/activate     

# Install dependencies
pip install -r requirements.txt

# Run the backend with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
# Install dependencies
npm install
# or
yarn install

# Start the frontend
npm run dev
# or
yarn dev
```

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

```
