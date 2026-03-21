<div align="center">
  <h1>🚀 Bùi Việt Quốc - AI Engineer Portfolio</h1>
  <p><i>A Modern Portfolio Website powered by an intelligent RAG Chatbot Assistant</i></p>
  
  [![Python](https://img.shields.io/badge/Python-3.9+-blue.svg?logo=python&logoColor=white)](https://python.org)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-00a393.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
  [![LangChain](https://img.shields.io/badge/LangChain-Integration-green.svg)](https://langchain.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

---

## 📖 Giới thiệu (Overview)

Chào mừng bạn đến với mã nguồn website Portfolio cá nhân của **Bùi Việt Quốc**. Đây không chỉ là một trang web tĩnh hiển thị thông tin hồ sơ, kỹ năng và các dự án AI/ML, mà còn được tích hợp một **trợ lý ảo AI (Chatbot)** thông minh sử dụng kiến trúc **RAG (Retrieval-Augmented Generation)**.

Welcome to the source code of **Bùi Việt Quốc**'s personal portfolio website. This is not just a static profile showcasing AI/ML projects and skills; it also integrates an intelligent **AI Chatbot Assistant** powered by **RAG (Retrieval-Augmented Generation)** architecture.

## ✨ Tính năng nổi bật (Key Features)

- **🤖 AI RAG Chatbot:** Trợ lý ảo hiểu rõ mọi thông tin về kỹ năng, kinh nghiệm và dự án của tác giả dựa trên cơ sở dữ liệu `info.md`. Đảm bảo câu trả lời luôn có căn cứ thực tế (grounded generation), tránh tình trạng ảo giác (hallucination).
- **🌗 Giao diện hiện đại (Dark/Light Mode):** Thiết kế Glassmorphism chuyên nghiệp, mượt mà và tự động lưu tuỳ chọn giao diện thông qua LocalStorage.
- **🌐 Đa ngôn ngữ (Bilingual):** Hỗ trợ chuyển đổi ngôn ngữ liền mạch giữa tiếng Việt (VI) và tiếng Anh (EN).
- **📱 Responsive Design:** Hiển thị hoàn hảo trên mọi kích cỡ màn hình (Mobile, Tablet, Desktop) nhờ sức mạnh của Tailwind CSS.
- **⚡ Tốc độ cao:** FastAPI backend đảm bảo AI Chatbot xử lý luồng tin nhắn (async) với độ trễ thấp nhất.

## 🛠️ Công nghệ sử dụng (Tech Stack)

### **Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- **Tailwind CSS** (Styling framework)
- **Lucide Icons** (Vector icons)

### **Backend (Trợ lý AI - RAG):**
- **Python** & **FastAPI** (Tạo REST API)
- **LangChain** (Frameowrk xây dựng RAG pipeline)
- **Google Gemini API** (LLM sinh text & Vector Embeddings)
- **ChromaDB** (Vector Database lưu trữ Knowledge Base)
- **Uvicorn** (ASGI Server)

## 🏗️ Kiến trúc RAG (RAG Architecture)

Chatbot AI trên website hoạt động qua 2 giai đoạn chính:
1. **Ingest Phase (`backend/ingest.py`):** Đọc file tri thức `data/info.md`, chia văn bản thành các đoạn nhỏ (text chunks), chuyển đổi thành các vector số (embeddings) và lưu vào **ChromaDB**.
2. **Serve Phase (`backend/main.py`):** Khi người dùng đặt câu hỏi, hệ thống sẽ nhúng câu hỏi đó để tìm kiếm ngữ nghĩa (Semantic Search) trong ChromaDB. Hệ thống tự động trích xuất các thông tin liên quan, lồng ghép vào lời nhắc (Prompt) và gửi tới mô hình **Gemini LLM** để sinh ra câu trả lời chính xác nhất.

---

## 🚀 Hướng dẫn cài đặt & Chạy Local (Getting Started)

### 1. Yêu cầu hệ thống (Prerequisites)
- Python 3.9+
- Trình duyệt Web (Chrome, Edge, Firefox,...)
- Đã lấy **GEMINI_API_KEY** từ Google AI Studio.

### 2. Cài đặt Backend
Di chuyển vào thư mục `backend` và cài đặt không gian ảo:
```bash
cd backend
python -m venv venv

# Kích hoạt trên Windows
venv\Scripts\activate
# Kích hoạt trên Linux/Mac
source venv/bin/activate

# Cài đặt thư viện
pip install -r requirements.txt
```

Tạo file `.env` trong thư mục `backend` và thiết lập biến môi trường:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

Chạy script để nạp dữ liệu vào Vector Database (Chỉ cần chạy lần đầu hoặc khi có cập nhật `info.md`):
```bash
python ingest.py
```

Khởi động Server FastAPI:
```bash
uvicorn main:app --reload
```
API Backend sẽ chạy tại: `http://127.0.0.1:8000`

### 3. Cài đặt Frontend
Mở trực tiếp file `index.html` trên trình duyệt hoặc sử dụng extension **Live Server** (VSCode) để có trải nghiệm tốt nhất. Mặc định, Chatbot ở Frontend đã được lập trình để gọi đến REST API ở `http://127.0.0.1:8000`.

---

## ☁️ Triển khai (Deployment)

Dự án đựợc cấu trúc chuẩn để có thể deploy miễn phí:
- **Frontend** có thể được triển khai trên [Vercel](https://vercel.com/) hoặc [GitHub Pages](https://pages.github.com/). (*Lưu ý: Mở file `assets/js/chatbot.js` và thay đổi URL đích hướng về URL của Backend sau khi deploy.*)
- **Backend** có thể được triển khai dưới dạng *Web Service* trên [Render.com](https://render.com/). Đừng quên bổ sung biến môi trường `GEMINI_API_KEY` trong quá trình deploy. 
- Xem chi tiết tại file `how to deploy.txt` đi kèm dự án.

---

## 👨‍💻 Tác giả (Author)

**Bùi Việt Quốc** 
- Nhắn tin cho tôi qua Email: [buiquoc2k4@gmail.com](mailto:buiquoc2k4@gmail.com)
- Kết nối trên [LinkedIn](https://www.linkedin.com/in/quoc-bui-3680413a3)
- Khám phá các dự án open-source khác tại [GitHub](https://github.com/anhhit1)

> 💡 *Sứ mệnh của tôi là mang Trí tuệ nhân tạo (AI) áp dụng vào giải quyết các bài toán thực tế và xây dựng phần mềm mang lại giá trị thiết thực.*

---
⭐️ **Nếu bạn thấy kiến trúc mã nguồn này hữu ích, hãy để lại một sao để ủng hộ nhé!** (If you find this project useful, please consider giving it a star!)
