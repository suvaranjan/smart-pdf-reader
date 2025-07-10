// app/api/chat/route.ts

import { generateTranslation } from "@/services/ai";

export async function POST(request: Request) {
  const { originalText, sourceLang, targetLang } = await request.json();

  try {
    const reply = await generateTranslation({
      originalText,
      sourceLang,
      targetLang,
    });
    return Response.json({ reply });
  } catch (error) {
    console.log(error);
    return Response.json({ error: error }, { status: 500 });
  }
}
