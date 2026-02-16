import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, RotateCw, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const FlashcardDeck = ({ documentId }) => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const fetchFlashcards = async () => {
        setLoading(true);
        setCards([]);
        setCurrentIndex(0);
        setIsFlipped(false);
        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const { data } = await axios.post(
                'http://localhost:5000/api/study/flashcards',
                { documentId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCards(data.flashcards || data);
        } catch (error) {
            console.error("Failed to fetch flashcards", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (documentId) fetchFlashcards();
    }, [documentId]);

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % cards.length);
        }, 200);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
        }, 200);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Loader2 size={40} className="animate-spin mb-4 text-indigo-500" />
                <p>Creating learning cards...</p>
            </div>
        );
    }

    if (cards.length === 0) return <div className="text-center p-10 text-gray-500">No flashcards available.</div>;

    return (
        <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="w-full max-w-2xl perspective-1000 h-96 relative cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
                <motion.div
                    className="w-full h-full relative preserve-3d transition-transform duration-500"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden bg-white border-2 border-indigo-100 rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 text-center hover:border-indigo-300 transition-colors">
                        <span className="text-xs uppercase font-bold text-indigo-400 tracking-widest mb-4">Concept</span>
                        <h3 className="text-3xl font-bold text-gray-800">{cards[currentIndex].front}</h3>
                        <p className="text-gray-400 text-sm mt-8 absolute bottom-6">Click to flip</p>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 backface-hidden bg-indigo-600 rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 text-center text-white" style={{ transform: 'rotateY(180deg)' }}>
                        <span className="text-xs uppercase font-bold text-indigo-200 tracking-widest mb-4">Definition</span>
                        <p className="text-xl font-medium leading-relaxed">{cards[currentIndex].back}</p>
                    </div>
                </motion.div>
            </div>

            <div className="mt-8 flex items-center space-x-8">
                <button onClick={handlePrev} className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 text-gray-700 transition">
                    <ArrowLeft size={24} />
                </button>
                <div className="text-gray-500 font-medium">
                    {currentIndex + 1} / {cards.length}
                </div>
                <button onClick={handleNext} className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 text-gray-700 transition">
                    <ArrowRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default FlashcardDeck;
