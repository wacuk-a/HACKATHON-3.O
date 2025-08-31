# AI-Powered Educational Platform  
*PLP Vibecode Hackathon 3.0 Project*

## 📚 Project Description
This project is an **AI-powered educational platform** designed to transform study materials into interactive learning tools.  
Users can upload PDF notes, and the system automatically generates **quizzes, flashcards, and summaries** using advanced AI/NLP capabilities.  

The solution aims to enhance learning efficiency and make study sessions more engaging, accessible, and personalized.  

---

## 🚀 Core Features

### 🔐 User Authentication System
- JWT-based authentication (Supabase/Firebase)
- Role-based access (Teachers/Students)
- Protected routes and API endpoints

### 📄 PDF Processing & Content Extraction
- PDF upload with drag-and-drop interface
- Backend parsing using **PyPDF2 / pdfplumber**
- Text extraction and cleaning pipeline

### 🤖 AI-Powered Content Generation
- Integration with **OpenAI API / Hugging Face**
- Automatic **quiz generation** (MCQ, True/False, Short Answer)
- **Flashcards** for key concepts
- **Summaries** from extracted text

### 🎓 Interactive Learning Interface
- Quizzes with instant grading
- Flip-style flashcards
- Progress tracking dashboard
- Performance analytics (strengths & weaknesses)

### 💳 Monetization System
- **IntaSend payment integration** for East Africa (Kenya, Uganda, Tanzania)
- Support for **M-Pesa & Card payments**
- Free tier (limited features) & Premium tier (unlimited access, analytics, exports)
- Webhook handling for subscription updates

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (TypeScript, TailwindCSS)  
- **Backend**: Django REST Framework (Python) or Node.js/Express  
- **Database**: PostgreSQL (users/subscriptions) + MongoDB (content)  
- **File Storage**: AWS S3 (PDF storage)  
- **AI Integration**: OpenAI API  
- **Payments**: IntaSend SDK/API  
- **Deployment**: Vercel (frontend) + Render/Heroku (backend)  


## 🧑‍💻 Authors
- ROSE B KARU

---

## 📜 License
This project is licensed under the **MIT License** – see the [LICENSE](./LICENSE) file for details.