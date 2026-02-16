# AI Study Assistant

An AI-powered web application that turns your documents into summaries, quizzes, flashcards, and interactive chat sessions.

## Prerequisites

- Node.js (v16+)
- MongoDB (Local or Atlas)
- OpenAI API Key

## Setup & Installation

### 1. Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory based on `.env.example`:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   OPENAI_API_KEY=your_openai_api_key
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend/ai-learning-assistance
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm run dev
   ```

## Usage

1. Open your browser at `http://localhost:5173` (or the port shown in your terminal).
2. Register a new account.
3. Upload a PDF, DOCX, or TXT file.
4. Click on the document to start studying!
   - **Summary**: View AI-generated summaries.
   - **Quiz**: Take a multiple-choice quiz.
   - **Flashcards**: Review concepts with flip cards.
   - **Chat**: Ask questions about your document.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express, MongoDB
- **AI**: OpenAI API
