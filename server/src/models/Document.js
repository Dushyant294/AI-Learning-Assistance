import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    },
    textContent: {
        type: String,
        // For now we store extracted text directly. 
        // For very large docs, we might need a different strategy or gridfs/S3
    }
});

const Document = mongoose.model('Document', documentSchema);
export default Document;
