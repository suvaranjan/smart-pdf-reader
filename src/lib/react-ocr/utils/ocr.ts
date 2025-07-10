import Tesseract from "tesseract.js";

export async function extractTextFromImage(
  dataUrl: string,
  lang: string = "eng"
): Promise<string> {
  const {
    data: { text },
  } = await Tesseract.recognize(dataUrl, lang, {
    logger: (m) => console.log(m),
  });

  return text.trim();
}

export async function extractTextFromImages(
  imageDataUrls: string[],
  lang: string = "eng"
): Promise<string[]> {
  const textPromises = imageDataUrls.map(async (dataUrl) => {
    const {
      data: { text },
    } = await Tesseract.recognize(dataUrl, lang);
    return text.trim();
  });

  return await Promise.all(textPromises);
}
