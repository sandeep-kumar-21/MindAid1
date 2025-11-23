import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();


// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const run = async () => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });
  const result = await model.generateContent("Say hi from Gemini 2.5 pro!");
  console.log(result.response.text());
};

run().catch(console.error);
