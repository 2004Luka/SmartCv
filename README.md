# SmartCv

An intelligent application that helps users tailor their resumes for specific job listings using AI.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or a MongoDB Atlas account)
- OpenAI API key

## Setup

1. Clone the repository
2. Create a `.env` file in the `smartcv-backend` directory with the following content:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/smartcv
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=24h
   OPENAI_API_KEY=your_openai_api_key_here
   MAX_FILE_SIZE=5242880
   UPLOAD_PATH=./uploads
   ```
3. Install dependencies:
   ```bash
   npm run install-all
   ```

## Running the Application

To start both frontend and backend servers with a single command:

```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend development server on http://localhost:5173

## Features

- AI-powered resume tailoring
- PDF/DOCX resume parsing
- Personalized cover letter generation
- Multi-step form wizard
- Live PDF preview
- User authentication
- Resume history tracking 