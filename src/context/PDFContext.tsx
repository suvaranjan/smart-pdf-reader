"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { type OcrLanguageCode } from "@/lib/react-ocr/constants/ocrLanguages";

export const availableTranslateLanguages = [
  "English",
  "Hindi",
  "Odia",
  "Hinglish",
] as const;

export interface OcrLanguage {
  code: OcrLanguageCode;
  name: string;
}

export type TextData = {
  [pageNumber: number]: {
    original?: string;
    translated?: {
      text: string;
      language: string;
    };
  };
};

interface PDFContextType {
  resetTextData: () => void;
}

type LoadingState = {
  isLoading: boolean;
  type?: "ocr" | "translate";
};

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

  loading: LoadingState;
  setLoading: (loading: LoadingState) => void;
}

const PDFContext = createContext<PDFContextType | undefined>(undefined);

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

  const [loading, setLoading] = useState<LoadingState>({
    isLoading: false,
  });

  const resetTextData = () => {
    setTextData({});
  };

  const setPageOriginalText = (page: number, text: string) => {
    setTextData((prev) => ({
      ...prev,
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
      ...prev,
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
    loading,
    setLoading,
    resetTextData,
  };

  return <PDFContext.Provider value={value}>{children}</PDFContext.Provider>;
}

export function usePDF() {
  const context = useContext(PDFContext);
  if (!context) {
    throw new Error("usePDF must be used within a PDFProvider");
  }
  return context;
}
