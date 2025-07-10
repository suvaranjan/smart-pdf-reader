import { renderPageToImage } from "./render";
import Tesseract from "tesseract.js";
import type { PDFPageProxy } from "pdfjs-dist";
import type { OcrLanguageCode } from "../constants/ocrLanguages";

/**
 * Extract text from multiple PDF pages with optional per-page progress tracking
 */
export async function extractTextFromMultiPages(
  pages: PDFPageProxy[],
  lang: OcrLanguageCode = "eng",
  onPageProgress?: (pageIndex: number, progress: number) => void
): Promise<string[]> {
  const results: string[] = [];

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const image = await renderPageToImage(page);

    const {
      data: { text },
    } = await Tesseract.recognize(image, lang, {
      logger: (m) => {
        if (m.status === "recognizing text" && onPageProgress) {
          onPageProgress(i, Math.round(m.progress * 100));
        }
      },
    });

    results.push(text.trim());
  }

  return results;
}
