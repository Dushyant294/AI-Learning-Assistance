import { useState } from 'react';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import axios from 'axios';

const UploadModal = ({ isOpen, onClose, onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.type === 'application/pdf' ||
                selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                selectedFile.type === 'text/plain') {
                setFile(selectedFile);
                setError('');
            } else {
                setError('Please upload PDF, DOCX, or TXT files only.');
            }
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            };

            await axios.post('http://localhost:5000/api/documents/upload', formData, config);
            setUploading(false);
            onUploadSuccess();
            onClose();
        } catch (err) {
            setError('Upload failed. Please try again.');
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-4 text-gray-800">Upload Material</h2>

                <div className="border-2 border-dashed border-indigo-200 rounded-xl p-8 flex flex-col items-center justify-center bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer relative">
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".pdf,.docx,.txt"
                    />
                    <Upload size={48} className="text-indigo-500 mb-2" />
                    <p className="text-gray-600 font-medium">Click or drag file to upload</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, DOCX, TXT (Max 10MB)</p>
                </div>

                {file && (
                    <div className="mt-4 flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <FileText size={20} className="text-indigo-500 mr-3" />
                        <span className="text-sm text-gray-700 truncate flex-1">{file.name}</span>
                        <button onClick={() => setFile(null)} className="text-red-400 hover:text-red-600">
                            <X size={16} />
                        </button>
                    </div>
                )}

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <button
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    className={`mt-6 w-full py-3 rounded-lg font-semibold text-white flex items-center justify-center ${!file || uploading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg'
                        }`}
                >
                    {uploading ? <Loader2 className="animate-spin mr-2" /> : 'Process Document'}
                </button>
            </div>
        </div>
    );
};

export default UploadModal;
