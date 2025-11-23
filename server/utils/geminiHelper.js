import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getAiSupport = async (journalEntry) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    const prompt = `
      You are MindAid, a supportive and empathetic AI companion. 
      A user has shared their journal entry with you. 
      Your goal is to provide a short, compassionate, and non-judgmental response. 
      Acknowledge their feelings and offer gentle encouragement. 
      Do not give medical advice. Keep the response to 2–3 sentences.

      User's Entry: "${journalEntry}"

      Your Response:
    `;

    console.log("Sending prompt to Gemini API:", prompt);
    const result = await model.generateContent(prompt);
    console.log("Gemini API response received:", result);
    const text = result.response.text();

    return text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "I’m having a little trouble responding right now, but your feelings are completely valid.";
  }
};



export const getDailyQuoteFromGemini = async () => {

  try {

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    const prompt = `Generate one short, inspiring quote for a mental wellness app. The quote should be about resilience, mindfulness, hope, or self-compassion.
    Provide it in JSON format with "text" and "author" keys.
    
    Example:
    {
      "text": "The best way out is always through.",
      "author": "Robert Frost"
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawJson = response.text();
    
    // Clean up the JSON string from Gemini
    const cleanedJson = rawJson.replace(/```json/g, '').replace(/```/g, '');
    
    const parsed = JSON.parse(cleanedJson);
    // console.log('Parsed daily quote from Gemini:', parsed); 
    return parsed; // Returns { text: "...", author: "..." }

  } catch (error) {
    console.error('Error calling Gemini for daily quote:', error);
    // Return a fallback quote if Gemini fails
    return {
      text: "The greatest revolution of our generation is the discovery that human beings can alter their lives by altering their attitudes.",
      author: "William James"
    };
  }
};
