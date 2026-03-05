# 🎯 Smart Interview System

An AI-powered mock interview platform that helps students and job seekers practice interviews with real-time scoring, voice input, and performance analytics.

🔗 **Live Demo:** https://smart-interview-system-8349.vercel.app

---

## 📸 Features

- 🤖 **AI Answer Scoring** — Uses Sentence Transformers (NLP) to evaluate answers intelligently
- 🎙️ **Voice Input** — Speak your answers using Web Speech API
- 📊 **Performance Dashboard** — Track scores, weak areas, and progress with charts
- 🔐 **JWT Authentication** — Secure login and registration system
- 📝 **5 Interview Categories** — Python, SQL, HR, Data Structures, System Design
- 💬 **Instant Feedback** — Get detailed feedback after every answer
- 📱 **Responsive UI** — Clean, modern interface built with React

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Chart.js (dashboard analytics)
- Axios (API calls)
- React Router DOM (navigation)
- Web Speech API (voice input)

### Backend
- FastAPI (Python)
- SQLAlchemy (ORM)
- SQLite (database)
- JWT (authentication)
- Bcrypt (password hashing)

### AI / NLP
- Sentence Transformers
- all-MiniLM-L6-v2 model
- Cosine similarity scoring

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Git

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Open App
```
Frontend: http://localhost:3000
Backend:  http://127.0.0.1:8000
API Docs: http://127.0.0.1:8000/docs
```

---

## 📁 Project Structure
```
smart-interview-system/
│
├── backend/
│   ├── main.py              # FastAPI app entry point
│   ├── database.py          # Database connection
│   ├── models.py            # Database tables
│   ├── schemas.py           # Data validation
│   ├── auth.py              # JWT + password hashing
│   ├── requirements.txt     # Python dependencies
│   ├── ai/
│   │   └── analyzer.py      # AI scoring engine
│   └── routes/
│       ├── auth.py          # Register + Login APIs
│       ├── questions.py     # Questions API
│       └── interview.py     # Submit + Results APIs
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Login.js
        │   ├── Register.js
        │   ├── Dashboard.js
        │   ├── CategorySelect.js
        │   ├── Interview.js
        │   └── Results.js
        ├── components/
        │   ├── MicButton.js
        │   └── useVoice.js
        └── services/
            └── api.js
```

---

## 🤖 How AI Scoring Works

1. User submits an answer
2. Backend receives both user answer and expected answer
3. Sentence Transformer model encodes both into vectors
4. Cosine similarity is calculated between the two vectors
5. Similarity score (0-1) is converted to score out of 10
6. Feedback is generated based on score range
```python
# Core scoring logic
embeddings = model.encode([user_answer, expected_answer])
similarity = util.cos_sim(embeddings[0], embeddings[1])
score = float(similarity) * 10
```

---

## 📊 Screenshots

> Login Page — Clean split layout with feature highlights

> Dashboard — Real-time charts showing performance analytics

> Interview Page — Question display with voice input and AI scoring

> Results Page — Detailed breakdown with scores and feedback

---

## 👨‍💻 Author

**Athul Krishna**
- GitHub: [@agent47-alt](https://github.com/agent47-alt)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).