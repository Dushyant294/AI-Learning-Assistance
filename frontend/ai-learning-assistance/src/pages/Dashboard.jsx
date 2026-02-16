import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, FileText, Calendar, LogOut, Loader2, BookOpen } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import UploadModal from '../components/UploadModal';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const fetchDocuments = async () => {
        try {
            const token = user.token;
            const { data } = await axios.get('http://localhost:5000/api/documents', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDocuments(data);
        } catch (error) {
            console.error("Failed to fetch docs", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <BookOpen className="text-indigo-600" size={28} />
                        <h1 className="text-xl font-bold text-gray-900 tracking-tight">AI Study Assistant</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-500">Welcome, {user?.username}</span>
                        <button
                            onClick={logout}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Your Documents</h2>
                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md transition-all active:scale-95"
                    >
                        <Plus size={20} className="mr-2" />
                        New Document
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin text-indigo-500" size={40} />
                    </div>
                ) : documents.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
                        <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-medium text-gray-900">No documents yet</h3>
                        <p className="text-gray-500 mt-2">Upload a PDF or DOCX to get started with AI learning.</p>
                        <button
                            onClick={() => setIsUploadModalOpen(true)}
                            className="mt-6 text-indigo-600 font-medium hover:text-indigo-800 hover:underline"
                        >
                            Upload your first document
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {documents.map((doc) => (
                            <Link
                                key={doc._id}
                                to={`/study/${doc._id}`}
                                className="group block bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg hover:border-indigo-100 transition-all duration-300 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />

                                <div className="flex items-start justify-between relative z-10">
                                    <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <FileText size={24} />
                                    </div>
                                </div>

                                <div className="mt-4 relative z-10">
                                    <h3 className="text-lg font-bold text-gray-900 truncate pr-2">{doc.originalName}</h3>
                                    <div className="flex items-center mt-2 text-sm text-gray-500">
                                        <Calendar size={14} className="mr-2" />
                                        <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            <UploadModal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                onUploadSuccess={fetchDocuments}
            />
        </div>
    );
};

export default Dashboard;
