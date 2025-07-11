"use client";

import React, { useEffect, useRef, useState } from "react";
import { TranslateControl } from "./TranslateControl";
import { CopyTextButton } from "./CopyText";
import { extractTextFromSinglePage } from "@/lib/react-ocr/utils/extractTextFromSinglePage";
import { usePDF } from "@/context/PDFContext";
import { Settings } from "lucide-react";

function OCRText({ pageNumber }: { pageNumber: string }) {
  const {
    pdf,
    ocrLanguage,
    ocrTextLoading,
    setOcrTextLoading,
    translationTextLoading,
    setTranslationTextLoading,
  } = usePDF();

  const abortControllerRef = useRef<AbortController | null>(null);

  const [originalText, setOriginalText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const runOcr = async () => {
      if (!pdf || !ocrLanguage) return;

      setOcrTextLoading(true);
      setProgress(0);
      setTranslatedText("");

      try {
        const page = await pdf.getPage(parseInt(pageNumber, 10));

        const text = await extractTextFromSinglePage(
          page,
          ocrLanguage.code,
          (prog) => setProgress(prog)
        );

        setOriginalText(text);
      } catch (err) {
        console.error("OCR failed:", err);
        setOriginalText("Failed to extract text from PDF.");
      } finally {
        setOcrTextLoading(false);
      }
    };

    runOcr();
  }, [pdf, ocrLanguage, pageNumber, setOcrTextLoading]);

  const runTranslation = async (lang: string) => {
    setTranslationTextLoading(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalText,
          sourceLang: ocrLanguage.name,
          targetLang: lang,
        }),
        signal: controller.signal,
      });

      const { reply } = await res.json();
      setTranslatedText(reply);
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.warn("Translation aborted");
      } else {
        console.error("Translation failed:", err);
      }
    } finally {
      setTranslationTextLoading(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200 px-2 py-3">
          <div className="flex justify-between items-center">
            <TranslateControl
              onTranslated={runTranslation}
              reset={() => {
                abortControllerRef.current?.abort();
                setTranslatedText("");
                setTranslationTextLoading(false);
              }}
              disableSelect={ocrTextLoading}
            />
            <CopyTextButton text={translatedText || originalText} />
          </div>
        </div>

        <div className="p-1">
          {ocrTextLoading ? (
            <TextLoading type="ocr" progress={progress} />
          ) : translationTextLoading ? (
            <TextLoading type="translate" />
          ) : (
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-md border">
              {translatedText || originalText}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

export default OCRText;

interface TextLoadingProps {
  type: "ocr" | "translate";
  progress?: number;
}

export function TextLoading({ type, progress }: TextLoadingProps) {
  const message =
    type === "ocr"
      ? `Processing OCR${progress !== undefined ? ` ${progress}%` : ""}`
      : "Translating";

  return (
    <div className="min-h-screen gap-2 text-sm text-gray-500">
      <div className="flex items-center justify-center space-x-2 py-10">
        <Settings
          className="animate-spin w-5 h-5 text-gray-600"
          strokeWidth={1}
        />
        <span>{message}</span>
      </div>
    </div>
  );
}
