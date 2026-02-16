import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const QuizComponent = ({ documentId }) => {
    const [quiz, setQuiz] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [activeQuestion, setActiveQuestion] = useState(0);

    const generateQuiz = async (retry = false) => {
        if (!retry && quiz.length > 0) return;

        setLoading(true);
        setQuiz([]);
        setUserAnswers({});
        setShowResults(false);
        setActiveQuestion(0);

        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            const { data } = await axios.post(
                'http://localhost:5000/api/study/quiz',
                { documentId, difficulty: 'medium' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Ensure data is array (API returns parsed JSON)
            const questions = Array.isArray(data) ? data : data.questions || [];
            setQuiz(questions);
        } catch (error) {
            console.error("Failed to generate quiz", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (documentId) generateQuiz();
    }, [documentId]);

    const handleAnswer = (optionIndex) => {
        setUserAnswers({ ...userAnswers, [activeQuestion]: optionIndex });
    };

    const calculateScore = () => {
        let score = 0;
        quiz.forEach((q, i) => {
            if (userAnswers[i] === q.correctParam) score++; // Assumes correctParam is index
        });
        return score;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Loader2 size={40} className="animate-spin mb-4 text-indigo-500" />
                <p className="font-medium">Crafting questions...</p>
            </div>
        );
    }

    if (quiz.length === 0) return <div className="text-center p-10 text-gray-500">No quiz available.</div>;

    if (showResults) {
        const score = calculateScore();
        return (
            <div className="bg-white p-8 rounded-xl shadow-sm h-full flex flex-col items-center justify-center text-center">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
                <p className="text-gray-500 mb-6">Here is how you did</p>

                <div className="w-32 h-32 rounded-full border-8 border-indigo-100 flex items-center justify-center mb-6 relative">
                    <span className="text-4xl font-bold text-indigo-600">{Math.round((score / quiz.length) * 100)}%</span>
                </div>

                <p className="text-lg text-gray-700 mb-8">You got <span className="font-bold">{score}</span> out of {quiz.length} correct.</p>

                <button
                    onClick={() => generateQuiz(true)}
                    className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    <RefreshCw size={20} className="mr-2" /> Try New Quiz
                </button>
            </div>
        );
    }

    const question = quiz[activeQuestion];

    return (
        <div className="bg-white p-8 rounded-xl shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-8">
                <span className="text-sm font-bold text-indigo-500 tracking-wider">QUESTION {activeQuestion + 1}/{quiz.length}</span>
                <span className="text-xs font-medium text-gray-400">Multiple Choice</span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-6 leading-relaxed">{question.question}</h3>

            <div className="space-y-3 flex-1">
                {question.options.map((option, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all flex items-center ${userAnswers[activeQuestion] === idx
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                                : 'border-gray-100 hover:border-indigo-200 hover:bg-gray-50 text-gray-700'
                            }`}
                    >
                        <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${userAnswers[activeQuestion] === idx ? 'border-indigo-500' : 'border-gray-300'
                            }`}>
                            {userAnswers[activeQuestion] === idx && <div className="w-3 h-3 bg-indigo-500 rounded-full" />}
                        </div>
                        {option}
                    </button>
                ))}
            </div>

            <div className="pt-8 flex justify-between">
                <button
                    disabled={activeQuestion === 0}
                    onClick={() => setActiveQuestion(curr => curr - 1)}
                    className="px-6 py-2 text-gray-500 font-medium hover:text-gray-800 disabled:opacity-50"
                >
                    Previous
                </button>

                {activeQuestion === quiz.length - 1 ? (
                    <button
                        onClick={() => setShowResults(true)}
                        className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-bold shadow-lg hover:bg-indigo-700 transition"
                    >
                        Finish Quiz
                    </button>
                ) : (
                    <button
                        onClick={() => setActiveQuestion(curr => curr + 1)}
                        className="px-8 py-3 bg-gray-900 text-white rounded-lg font-bold shadow hover:bg-gray-800 transition"
                    >
                        Next Question
                    </button>
                )}
            </div>
        </div>
    );
};

export default QuizComponent;
