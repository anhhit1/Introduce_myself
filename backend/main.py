from fastapi import FastAPI, HTTPException
from prompts import SYSTEM_PROMPT
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="AI Portfolio Chatbot RAG")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load vectorstore
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-001",
    google_api_key=os.getenv("GEMINI_API_KEY")
)
vectorstore = Chroma(persist_directory="vectorstore", embedding_function=embeddings)
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

llm = ChatGoogleGenerativeAI(
    model="models/gemini-2.5-flash-lite",
    temperature=0.7,
    google_api_key=os.getenv("GEMINI_API_KEY")
)

class ChatRequest(BaseModel):
    message: str
    history: list = []

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        # Lấy thông tin liên quan từ info.md
        docs = retriever.invoke(request.message)
        context = "\n\n".join([doc.page_content for doc in docs])

        # Build danh sách messages trực tiếp (không qua template để tránh lỗi {})
        messages = [SystemMessage(content=SYSTEM_PROMPT + f"\n\nContext:\n{context}")]
        for msg in request.history:
            role = msg.get("sender")
            text = msg.get("text", "")
            if role == "bot":
                messages.append(AIMessage(content=text))
            else:
                messages.append(HumanMessage(content=text))
        messages.append(HumanMessage(content=request.message))

        # Gọi LLM trực tiếp với danh sách messages
        response = llm.invoke(messages)

        return {"reply": response.content}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)