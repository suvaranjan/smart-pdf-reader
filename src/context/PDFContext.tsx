"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { type OcrLanguageCode } from "@/lib/react-ocr/constants/ocrLanguages";

export interface OcrLanguage {
  code: OcrLanguageCode;
  name: string;
}

interface PDFContextType {
  pdf: any;
  setPdf: (pdf: any) => void;

  fileName: string | null;
  setFileName: (name: string | null) => void;

  ocrLanguage: OcrLanguage;
  setOcrLanguage: (lang: OcrLanguage) => void;

  pageNumbers: number[] | null;
  setPageNumbers: (pages: number[] | null) => void;

  ocrTextLoading: boolean;
  setOcrTextLoading: (loading: boolean) => void;

  translationTextLoading: boolean;
  setTranslationTextLoading: (loading: boolean) => void;
}

const PDFContext = createContext<PDFContextType | undefined>(undefined);

export function PDFProvider({ children }: { children: ReactNode }) {
  const [pdf, setPdf] = useState<any>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [ocrLanguage, setOcrLanguage] = useState<OcrLanguage>({
    name: "English",
    code: "eng",
  });
  const [pageNumbers, setPageNumbers] = useState<number[] | null>(null);
  const [ocrTextLoading, setOcrTextLoading] = useState<boolean>(false);
  const [translationTextLoading, setTranslationTextLoading] =
    useState<boolean>(false);

  const value: PDFContextType = {
    pdf,
    setPdf,
    fileName,
    setFileName,
    ocrLanguage,
    setOcrLanguage,
    pageNumbers,
    setPageNumbers,
    ocrTextLoading,
    setOcrTextLoading,
    translationTextLoading,
    setTranslationTextLoading,
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
