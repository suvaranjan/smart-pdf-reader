"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface PDFContextType {
  pdf: any; // Result of usePdfDocument
  setPdf: (pdf: any) => void;
  fileName: string | null;
  setFileName: (name: string | null) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
}

const PDFContext = createContext<PDFContextType | undefined>(undefined);

export function PDFProvider({ children }: { children: ReactNode }) {
  const [pdf, setPdf] = useState<any>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguageState] = useState("eng");

  // Load saved language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("ocr-language");
    if (savedLang) {
      setSelectedLanguageState(savedLang);
    }
  }, []);

  // Persist language changes
  useEffect(() => {
    localStorage.setItem("ocr-language", selectedLanguage);
  }, [selectedLanguage]);

  const value: PDFContextType = {
    pdf,
    setPdf,
    fileName,
    setFileName,
    selectedLanguage,
    setSelectedLanguage: setSelectedLanguageState,
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
