"use client";

import { useCallback, useState } from "react";
import { extractTextFromSinglePage } from "@/lib/react-ocr/utils/extractTextFromSinglePage";
import { type OcrLanguageCode } from "@/lib/react-ocr/constants/ocrLanguages";

interface UseGenerateOCRProps {
  parsedPdf: any;
  pageNumber: number;
  ocrLanguageCode: OcrLanguageCode;
}

interface UseGenerateOCRReturn {
  text: string | null;
  loading: boolean;
  error: string | null;
  progress: number;
  runOCR: () => Promise<void>;
}

export function useGenerateOCR({
  parsedPdf,
  pageNumber,
  ocrLanguageCode,
}: UseGenerateOCRProps): UseGenerateOCRReturn {
  const [text, setText] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const runOCR = useCallback(async () => {
    if (!parsedPdf || !ocrLanguageCode || !pageNumber) {
      setError("Invalid OCR parameters.");
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      const extractedText = await extractTextFromSinglePage(
        parsedPdf,
        pageNumber,
        ocrLanguageCode,
        (prog) => setProgress(prog)
      );
      setText(extractedText);
    } catch (err: any) {
      console.error("OCR extraction failed:", err);
      setError("Failed to extract text from PDF.");
      setText(null);
    } finally {
      setLoading(false);
    }
  }, [parsedPdf, pageNumber, ocrLanguageCode]);

  return {
    text,
    loading,
    error,
    progress,
    runOCR,
  };
}
