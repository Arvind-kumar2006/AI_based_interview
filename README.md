# InterviewIQ.AI

An AI-powered mock interview platform built with React, Node.js, MongoDB, and Firebase.

## Features
- Google OAuth authentication via Firebase
- AI-generated interview questions using OpenRouter GPT-4o-mini
- Voice-based interview with browser Speech Recognition API
- Resume PDF upload and AI analysis
- Real-time answer evaluation with confidence, communication and correctness scores
- Performance analytics dashboard with charts
- Downloadable PDF interview report
- Credits-based system with Razorpay payment integration
- Interview history with detailed per-session reports

## Tech Stack
**Client:** React, Vite, Tailwind CSS, Redux Toolkit, Firebase Auth, Framer Motion, Recharts  
**Server:** Node.js, Express, MongoDB, Mongoose, JWT, Multer, pdfjs-dist  
**AI:** OpenRouter API (GPT-4o-mini)  
**Payments:** Razorpay

## Setup

### Server
```bash
cd server
npm install
# Create .env with MONGODB_URL, JWT_SECRET, OPENROUTER_API_KEY, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
npm start
```

### Client
```bash
cd client
npm install
# Create .env with VITE_FIREBASE_APIKEY, VITE_RAZORPAY_KEY_ID
npm run dev
```
