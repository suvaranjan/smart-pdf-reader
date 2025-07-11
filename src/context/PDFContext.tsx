"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { type OcrLanguageCode } from "@/lib/react-ocr/constants/ocrLanguages";

// ✅ Available translate languages
export const availableTranslateLanguages = [
  "English",
  "Hindi",
  "Odia",
  "Hinglish",
] as const;

// ✅ OCR language type
export interface OcrLanguage {
  code: OcrLanguageCode;
  name: string;
}

// ✅ Page-wise text structure
export type TextData = {
  [pageNumber: number]: {
    original?: string;
    translated?: {
      text: string;
      language: string;
    };
  };
};

// ✅ Context shape
interface PDFContextType {
  parsedPdf: any;
  setParsedPdf: (pdf: any) => void;

  fileName: string | null;
  setFileName: (name: string | null) => void;

  pageNumbers: number[] | null;
  setPageNumbers: (pages: number[] | null) => void;

  selectedOcrLanguage: OcrLanguage;
  setSelectedOcrLanguage: (lang: OcrLanguage) => void;

  selectedTranslateLanguage: string | null;
  setSelectedTranslateLanguage: (lang: string | null) => void;

  textData: TextData;
  setTextData: React.Dispatch<React.SetStateAction<TextData>>;

  setPageOriginalText: (page: number, text: string) => void;
  setPageTranslatedText: (page: number, text: string, language: string) => void;

  getOriginalOcrText: (page: number) => string | null;
  getTranslatedText: (page: number, language: string) => string | null;

  textLoading: boolean;
  setTextLoading: (loading: boolean) => void;
}

// ✅ Create context
const PDFContext = createContext<PDFContextType | undefined>(undefined);

// ✅ Provider
export function PDFProvider({ children }: { children: ReactNode }) {
  const [parsedPdf, setParsedPdf] = useState<any>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pageNumbers, setPageNumbers] = useState<number[] | null>(null);
  const [selectedOcrLanguage, setSelectedOcrLanguage] = useState<OcrLanguage>({
    name: "English",
    code: "eng",
  });
  const [selectedTranslateLanguage, setSelectedTranslateLanguage] = useState<
    string | null
  >(null);
  const [textData, setTextData] = useState<TextData>({});
  const [textLoading, setTextLoading] = useState<boolean>(false);

  const setPageOriginalText = (page: number, text: string) => {
    setTextData((prev) => ({
      [page]: {
        ...prev[page],
        original: text,
      },
    }));
  };

  const setPageTranslatedText = (
    page: number,
    text: string,
    language: string
  ) => {
    setTextData((prev) => ({
      [page]: {
        ...prev[page],
        translated: {
          text,
          language,
        },
      },
    }));
  };

  const getOriginalOcrText = (page: number): string | null => {
    return textData[page]?.original ?? null;
  };

  const getTranslatedText = (page: number, language: string): string | null => {
    const translated = textData[page]?.translated;
    if (!translated) return null;

    console.log("Yes translation of ", page, " is exists");

    return translated.language.toLowerCase() === language.toLowerCase()
      ? translated.text
      : null;
  };

  const value: PDFContextType = {
    parsedPdf,
    setParsedPdf,
    fileName,
    setFileName,
    pageNumbers,
    setPageNumbers,
    selectedOcrLanguage,
    setSelectedOcrLanguage,
    selectedTranslateLanguage,
    setSelectedTranslateLanguage,
    textData,
    setTextData,
    setPageOriginalText,
    setPageTranslatedText,
    getOriginalOcrText,
    getTranslatedText,
    textLoading,
    setTextLoading,
  };

  return <PDFContext.Provider value={value}>{children}</PDFContext.Provider>;
}

// ✅ Custom hook
export function usePDF() {
  const context = useContext(PDFContext);
  if (!context) {
    throw new Error("usePDF must be used within a PDFProvider");
  }
  return context;
}
