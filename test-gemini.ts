import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Find the direct PDF link for 'Save My Exams AQA GCSE Cell Biology revision notes'. The URL should start with https://cdn.savemyexams.com and end with .pdf",
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  console.log(response.text);
  console.log(JSON.stringify(response.candidates?.[0]?.groundingMetadata?.groundingChunks, null, 2));
}
run().catch(console.error);
