// import { renderPageToImage } from "./render";
// import Tesseract from "tesseract.js";
// import type { PDFPageProxy } from "pdfjs-dist";
// import type { OcrLanguageCode } from "../constants/ocrLanguages";

// /**
//  * Extract text from a single PDF page with optional progress tracking
//  */
// export async function extractTextFromSinglePage(
//   page: PDFPageProxy,
//   lang: OcrLanguageCode = "eng",
//   onProgress?: (progress: number) => void
// ): Promise<string> {
//   const image = await renderPageToImage(page);

//   const {
//     data: { text },
//   } = await Tesseract.recognize(image, lang, {
//     logger: (m) => {
//       if (m.status === "recognizing text" && onProgress) {
//         onProgress(Math.round(m.progress * 100));
//       }
//     },
//   });

//   return text.trim();
// }

"use client";
import { renderPageToImage } from "./render";
import Tesseract from "tesseract.js";
import type { PDFDocumentProxy } from "pdfjs-dist";
import type { OcrLanguageCode } from "../constants/ocrLanguages";

/**
 * Extract text from a specific PDF page number
 */
export async function extractTextFromSinglePage(
  parsedPdf: PDFDocumentProxy,
  pageNumber: number,
  lang: OcrLanguageCode = "eng",
  onProgress?: (progress: number) => void
): Promise<string> {
  const page = await parsedPdf.getPage(pageNumber);
  const image = await renderPageToImage(page);

  const {
    data: { text },
  } = await Tesseract.recognize(image, lang, {
    logger: (m) => {
      if (m.status === "recognizing text" && onProgress) {
        onProgress(Math.round(m.progress * 100));
      }
    },
  });

  return text.trim();
}
