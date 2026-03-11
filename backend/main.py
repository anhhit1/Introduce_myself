from fastapi import FastAPI, HTTPException
from prompts import SYSTEM_PROMPT
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate
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
    model="models/gemini-2.5-flash",
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

        # Tạo prompt
        prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT + f"\n\nContext:\n{context}"),
            ("human", request.message)
        ])

        chain = prompt | llm
        response = chain.invoke({})

        return {"reply": response.content}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)