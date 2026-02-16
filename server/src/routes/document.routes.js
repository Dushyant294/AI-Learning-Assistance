import express from 'express';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';
import Document from '../models/Document.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

// Upload Document
router.post('/upload', protect, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        let textContent = '';

        if (req.file.mimetype === 'application/pdf') {
            const dataBuffer = fs.readFileSync(req.file.path);
            const data = await pdfParse(dataBuffer);
            textContent = data.text;
        } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const result = await mammoth.extractRawText({ path: req.file.path });
            textContent = result.value;
        } else {
            // Plain text
            textContent = fs.readFileSync(req.file.path, 'utf8');
        }

        const document = await Document.create({
            user: req.user._id,
            filename: req.file.filename,
            originalName: req.file.originalname,
            path: req.file.path,
            fileType: req.file.mimetype,
            textContent: textContent
        });

        res.status(201).json(document);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'File upload failed' });
    }
});

// Get All Documents for User
router.get('/', protect, async (req, res) => {
    try {
        const documents = await Document.find({ user: req.user._id }).sort({ uploadedAt: -1 });
        res.json(documents);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch documents' });
    }
});

// Get Single Document (for study view)
router.get('/:id', protect, async (req, res) => {
    try {
        const document = await Document.findOne({ _id: req.params.id, user: req.user._id });
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.json(document);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching document' });
    }
});

export default router;
