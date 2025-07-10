import { GoogleGenAI } from "@google/genai";
import { getTranslatePrompt } from "./prompt";

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

type TranslateParams = {
  originalText: string;
  sourceLang: string;
  targetLang: string;
};

export const generateTranslation = async ({
  originalText,
  sourceLang,
  targetLang,
}: TranslateParams): Promise<string | undefined> => {
  const prompt = getTranslatePrompt(sourceLang, targetLang, originalText);

  const result = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    // generationConfig: {
    //   temperature: 0.3,
    //   maxOutputTokens: 800,
    // },
  });

  return result.text;
};
