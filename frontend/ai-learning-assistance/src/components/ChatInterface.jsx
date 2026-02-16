import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, User, Bot, Loader2 } from 'lucide-react';

const ChatInterface = ({ documentId }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || !documentId) return;

        const userMessage = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const token = JSON.parse(localStorage.getItem('user')).token;
            // Get last 5 messages for context history
            // Map 'user' to 'user' and 'assistant' (if any)
            const history = messages.slice(-5).map(m => ({
                role: m.role,
                content: m.content
            }));

            const { data } = await axios.post(
                'http://localhost:5000/api/study/chat',
                { documentId, question: userMessage.content, history },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessages((prev) => [...prev, { role: 'assistant', content: data.answer }]);
        } catch (error) {
            setMessages((prev) => [...prev, { role: 'assistant', content: "Sorry, I encountered an error answering that." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-70">
                        <Bot size={48} className="mb-2" />
                        <p>Ask me anything about your document!</p>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-xl shadow-sm flex items-start space-x-3 ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800'}`}>
                            {msg.role === 'assistant' ? <Bot size={20} className="mt-1 flex-shrink-0" /> : null}
                            <div>{msg.content}</div>
                            {msg.role === 'user' ? <User size={20} className="mt-1 flex-shrink-0 opacity-70" /> : null}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white p-4 rounded-xl shadow-sm flex items-center space-x-2">
                            <Loader2 size={16} className="animate-spin text-indigo-500" />
                            <span className="text-gray-500 text-sm">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex items-center space-x-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-1 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default ChatInterface;
