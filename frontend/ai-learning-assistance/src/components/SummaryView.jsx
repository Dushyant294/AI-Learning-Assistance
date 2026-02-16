import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

const SummaryView = ({ documentId }) => {
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [length, setLength] = useState('medium'); // short, medium, long

    const fetchSummary = async () => {
        setLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const { data } = await axios.post(
                'http://localhost:5000/api/study/summary',
                { documentId, length },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSummary(data.summary);
        } catch (error) {
            console.error("Failed to fetch summary", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (documentId) {
            fetchSummary();
        }
    }, [documentId, length]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Smart Summary</h2>
                <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
                    {['short', 'medium', 'long'].map((l) => (
                        <button
                            key={l}
                            onClick={() => setLength(l)}
                            className={`px-3 py-1 text-xs font-semibold rounded-md capitalize transition-all ${length === l ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {l}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <Loader2 size={32} className="animate-spin mb-2" />
                    <p>Analyzing document...</p>
                </div>
            ) : (
                <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed">
                    {summary ? summary.split('\n').map((line, i) => (
                        <p key={i} className="mb-2">{line}</p>
                    )) : <p>Select a document to generate a summary.</p>}
                </div>
            )}
        </div>
    );
};

export default SummaryView;
