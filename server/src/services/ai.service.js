import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const generateSummary = async (text, length = 'medium') => {
    const prompt = `Summarize the following text. Level of detail: ${length}.\n\nText:\n${text}`;

    const completion = await openai.chat.completions.create({
        messages: [{ role: 'system', content: 'You are a helpful study assistant.' }, { role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
    });

    return completion.choices[0].message.content;
};

export const generateQuiz = async (text, difficulty = 'medium') => {
    const prompt = `Generate a quiz with 5 multiple choice questions based on the text below. Difficulty: ${difficulty}. 
  Return the output strictly as a JSON array of objects with keys: question, options (array of strings), correctParam (index of correct option).
  
  Text:\n${text}`;

    const completion = await openai.chat.completions.create({
        messages: [{ role: 'system', content: 'You are a quiz generator. Output JSON only.' }, { role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
        response_format: { type: "json_object" }
    });

    // Depending on model version, response request format might need adjustment or manual parsing.
    // For safety, let's parse the content.
    return JSON.parse(completion.choices[0].message.content);
};

export const generateFlashcards = async (text) => {
    const prompt = `Generate 10 flashcards (Concept - Definition pairs) from the text. 
  Return the output strictly as a JSON array of objects with keys: front, back.
  
  Text:\n${text}`;

    const completion = await openai.chat.completions.create({
        messages: [{ role: 'system', content: 'You are a flashcard generator. Output JSON only.' }, { role: 'user', content: prompt }],
        model: 'gpt-3.5-turbo',
        response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content);
};

export const chatWithDocument = async (text, question, chatHistory = []) => {
    // Simple RAG-like approach: Pass whole text context (limited by token window). 
    // For production with large docs, vector DB is needed.
    const messages = [
        { role: 'system', content: `You are a helpful assistant. Answer the user's question based ONLY on the provided context. If the answer is not in the context, say "I don't know based on the document."\n\nContext:\n${text}` },
        ...chatHistory,
        { role: 'user', content: question }
    ];

    const completion = await openai.chat.completions.create({
        messages: messages,
        model: 'gpt-3.5-turbo',
    });

    return completion.choices[0].message.content;
};
