// lib/index.ts

// Setup Worker
import "./pdf/setupPdfWorker";

// Components
export { PDFPageCanvas } from "./components/PDFPageCanvas";
export { PDFPagesCanvas } from "./components/PDFPagesCanvas";

// Hooks
export { usePdfDocument } from "./hooks/usePdfDocument";
export { usePdfPage } from "./hooks/usePdfPage";
export { usePdfPages } from "./hooks/usePdfPages";

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
