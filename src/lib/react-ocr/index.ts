"use client";
// lib/index.ts

import "./pdf/setupPdfWorker";

// Components
export { PDFPageCanvas } from "./components/PDFPageCanvas";

// Hooks
export { usePdfDocument } from "./hooks/usePdfDocument";

// Utils
export { extractTextFromImage, extractTextFromImages } from "./utils/ocr";
export { extractTextFromMultiPages } from "./utils/extractTextFromMultiPages";
export { extractTextFromSinglePage } from "./utils/extractTextFromSinglePage";
export { renderPageToImage, renderPagesToImages } from "./utils/render";

// PDF Loader and  worker
export { loadPdf } from "./pdf/loadPdf";

//constants
export {
  supportedOcrLanguages,
  type OcrLanguageCode,
} from "./constants/ocrLanguages";
