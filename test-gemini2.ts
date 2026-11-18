import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function test() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Search for 'cdn.savemyexams.com AQA GCSE Cell Biology revision notes filetype:pdf' and return the exact PDF URL.",
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    console.log(response.text);
    console.log(JSON.stringify(response.candidates?.[0]?.groundingMetadata?.groundingChunks, null, 2));
  } catch (e) {
    console.error("Error:", e);
  }
}

test();
