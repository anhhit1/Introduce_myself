from langchain_community.document_loaders import TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
from dotenv import load_dotenv
import os
load_dotenv()

# Load file info.md
loader = TextLoader("data/info.md", encoding="utf-8")
documents = loader.load()

# Chia nhỏ thành chunk (rất quan trọng)
text_splitter = RecursiveCharacterTextSplitter(chunk_size=800, chunk_overlap=100)
chunks = text_splitter.split_documents(documents)

# Embeddings của Gemini (miễn phí)
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/gemini-embedding-2.5-flash",
    google_api_key=os.getenv("GEMINI_API_KEY")
)

# Tạo ChromaDB
vectorstore = Chroma.from_documents(
    documents=chunks,
    embedding=embeddings,
    persist_directory="vectorstore"
)

print("Đã dạy AI xong! Vectorstore được lưu tại folder 'vectorstore'")