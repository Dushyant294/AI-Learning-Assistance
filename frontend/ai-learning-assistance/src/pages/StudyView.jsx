import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { BookOpen, Brain, Layers, MessageSquare, ChevronLeft, FileText } from 'lucide-react';
import SummaryView from '../components/SummaryView';
import QuizComponent from '../components/QuizComponent';
import FlashcardDeck from '../components/FlashcardDeck';
import ChatInterface from '../components/ChatInterface';
import AuthContext from '../context/AuthContext';

const StudyView = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('summary');
    const [document, setDocument] = useState(null);

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const token = user.token;
                const { data } = await axios.get(`http://localhost:5000/api/documents/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDocument(data);
            } catch (error) {
                console.error("Failed to fetch document", error);
            }
        };
        if (user && id) fetchDocument();
    }, [id, user]);

    const tabs = [
        { id: 'summary', label: 'Summary', icon: FileText },
        { id: 'quiz', label: 'Quiz', icon: Brain },
        { id: 'flashcards', label: 'Flashcards', icon: Layers },
        { id: 'chat', label: 'AI Chat', icon: MessageSquare },
    ];

    return (
        <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center">
                    <Link to="/dashboard" className="mr-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition">
                        <ChevronLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 truncate max-w-md">{document?.originalName || 'Loading...'}</h1>
                        <p className="text-sm text-gray-500">Study Mode</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                        {document?.fileType?.split('/')[1] || 'DOC'}
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar Tabs */}
                <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                    <div className="p-4 space-y-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                            ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon size={20} className={`mr-3 ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 p-6 overflow-hidden bg-gray-50 relative">
                    <div className="h-full max-w-5xl mx-auto">
                        {activeTab === 'summary' && <SummaryView documentId={id} />}
                        {activeTab === 'quiz' && <QuizComponent documentId={id} />}
                        {activeTab === 'flashcards' && <FlashcardDeck documentId={id} />}
                        {activeTab === 'chat' && <ChatInterface documentId={id} />}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudyView;
