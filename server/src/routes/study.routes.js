import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Document from '../models/Document.js';
import { generateSummary, generateQuiz, generateFlashcards, chatWithDocument } from '../services/ai.service.js';

const router = express.Router();

// Generate Summary
router.post('/summary', protect, async (req, res) => {
    const { documentId, length } = req.body;
    try {
        const doc = await Document.findById(documentId);
        if (!doc) return res.status(404).json({ message: 'Document not found' });

        // Truncate text if too long for simple prompt (basic safeguard)
        const text = doc.textContent.substring(0, 15000);

        const summary = await generateSummary(text, length);
        res.json({ summary });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Generate Quiz
router.post('/quiz', protect, async (req, res) => {
    const { documentId, difficulty } = req.body;
    try {
        const doc = await Document.findById(documentId);
        if (!doc) return res.status(404).json({ message: 'Document not found' });

        const text = doc.textContent.substring(0, 15000);
        const quizData = await generateQuiz(text, difficulty);
        res.json(quizData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Generate Flashcards
router.post('/flashcards', protect, async (req, res) => {
    const { documentId } = req.body;
    try {
        const doc = await Document.findById(documentId);
        if (!doc) return res.status(404).json({ message: 'Document not found' });

        const text = doc.textContent.substring(0, 15000);
        const flashcardsData = await generateFlashcards(text);
        res.json(flashcardsData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Chat with Document
router.post('/chat', protect, async (req, res) => {
    const { documentId, question, history } = req.body;
    try {
        const doc = await Document.findById(documentId);
        if (!doc) return res.status(404).json({ message: 'Document not found' });

        const text = doc.textContent.substring(0, 15000);
        const answer = await chatWithDocument(text, question, history);
        res.json({ answer });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
