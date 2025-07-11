"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { TranslateControl } from "./TranslateControl";
import { CopyTextButton } from "./CopyText";
import { extractTextFromSinglePage } from "@/lib/react-ocr/utils/extractTextFromSinglePage";
import { usePDF } from "@/context/PDFContext";
import { Settings } from "lucide-react";

function OCRText({ pageNumber }: { pageNumber: string }) {
  const {
    parsedPdf,
    selectedOcrLanguage,
    selectedTranslateLanguage,
    setPageOriginalText,
    setPageTranslatedText,
    getOriginalOcrText,
    getTranslatedText,
    textLoading,
    setTextLoading,
  } = usePDF();

  const pageNum = parseInt(pageNumber, 10);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const originalText = getOriginalOcrText(pageNum);

  const runTranslation = async (targetLang: string) => {
    const existingTranslation = getTranslatedText(pageNum, targetLang);

    if (!originalText || existingTranslation) {
      console.log("2");
      return;
    }

    setTextLoading(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalText,
          sourceLang: selectedOcrLanguage.name,
          targetLang,
        }),
        signal: controller.signal,
      });

      const { reply } = await res.json();

      setPageTranslatedText(pageNum, reply, targetLang);
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.warn("Translation aborted");
      } else {
        console.error("Translation failed:", err);
      }
    } finally {
      setTextLoading(false);
      abortControllerRef.current = null;
    }
  };

  useEffect(() => {
    const runOcr = async () => {
      if (originalText) {
        return;
      }

      setTextLoading(true);
      setProgress(0);

      try {
        console.log("running OCR page no ", pageNum);

        const page = await parsedPdf.getPage(pageNum);
        const text = await extractTextFromSinglePage(
          page,
          selectedOcrLanguage.code,
          (prog) => setProgress(prog)
        );
        console.log("page num ", pageNum, " text ", text);
        setPageOriginalText(pageNum, text);
      } catch (err) {
        console.error("OCR failed:", err);
        setPageOriginalText(pageNum, "Failed to extract text from PDF.");
      } finally {
        if (selectedTranslateLanguage) {
          await runTranslation(selectedTranslateLanguage);
        } else {
          setTextLoading(false);
        }
      }
    };

    runOcr();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200 px-2 py-3">
          <div className="flex justify-between items-center">
            <TranslateControl
              onTranslated={runTranslation}
              reset={() => {
                abortControllerRef.current?.abort();
                setTextLoading(false);
              }}
              disableSelect={textLoading}
            />
            <CopyTextButton text="Hello" />
          </div>
        </div>

        <div className="p-1">
          {textLoading ? (
            <TextLoading progress={progress > 0 ? progress : undefined} />
          ) : (
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-md border min-h-screen">
              {selectedTranslateLanguage
                ? getTranslatedText(pageNum, selectedTranslateLanguage)
                : originalText}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

export default OCRText;

export function TextLoading({ progress = 0 }: { progress?: number }) {
  const { selectedTranslateLanguage } = usePDF();
  return (
    <div className="min-h-screen flex justify-center py-10 text-sm text-gray-500">
      <Settings
        className="animate-spin w-5 h-5 text-gray-600 mr-2"
        strokeWidth={1}
      />
      {selectedTranslateLanguage && (
        <span>Translating to {selectedTranslateLanguage}</span>
      )}

      {!selectedTranslateLanguage && (
        <span>Processing OCR {`${progress}%`}</span>
      )}
    </div>
  );
}
