"use client";

import React, { useEffect, useState } from "react";
import { TranslateControl } from "./TranslateControl";
import { CopyTextButton } from "./CopyText";
import { usePDF } from "@/context/PDFContext";
import { Settings } from "lucide-react";
import { extractTextFromSinglePage } from "@/lib/react-ocr";
import { useTranslation } from "@/hook/useTranslation";

function OCRText({ pageNumber }: { pageNumber: number }) {
  const {
    parsedPdf,
    selectedOcrLanguage,
    selectedTranslateLanguage,
    setSelectedTranslateLanguage,
    setPageOriginalText,
    setPageTranslatedText,
    getOriginalOcrText,
    getTranslatedText,
    loading,
    setLoading,
  } = usePDF();

  const { translate, abort } = useTranslation();
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [ocrDone, setOcrDone] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    if (ocrDone && selectedTranslateLanguage) {
      const existingTranslation = getTranslatedText(
        pageNumber,
        selectedTranslateLanguage
      );
      if (existingTranslation) {
        console.log("Yes");

        setText(existingTranslation);
        return;
      }
      runTranslation(selectedTranslateLanguage);
    }
  }, [ocrDone]);

  useEffect(() => {
    const originalText = getOriginalOcrText(pageNumber);
    if (selectedTranslateLanguage) {
      const existingTranslation = getTranslatedText(
        pageNumber,
        selectedTranslateLanguage
      );
      if (existingTranslation) {
        setText(existingTranslation);
        return;
      }
    }
    if (originalText) {
      setText(originalText);
      return;
    }
    runOCR();
  }, []);

  const runTranslation = (targetLang: string) => {
    const existingTranslation = getTranslatedText(pageNumber, targetLang);

    if (existingTranslation) {
      setText(existingTranslation);
      return;
    }

    if (!text.trim() || existingTranslation) return;

    setIsTranslating(true);
    setLoading({
      isLoading: true,
      type: "translate",
    });

    console.log("translation running");

    translate(
      {
        originalText: text,
        sourceLang: selectedOcrLanguage.name,
        targetLang,
      },
      // Success callback
      (reply) => {
        setText(reply);
        setPageTranslatedText(pageNumber, reply, targetLang);
        setLoading({ isLoading: false });
        setIsTranslating(false);
      },
      // Error callback
      () => {
        setText("Error translating text");
        setPageTranslatedText(pageNumber, "Error translating text", targetLang);
        setLoading({ isLoading: false });
        setIsTranslating(false);
      }
    );
  };

  async function runOCR() {
    try {
      setLoading({
        isLoading: true,
        type: "ocr",
      });
      console.log("ocr running");
      const extractedText = await extractTextFromSinglePage(
        parsedPdf,
        pageNumber,
        selectedOcrLanguage.code,
        (prog) => {
          setProgress(prog);
        }
      );
      setText(extractedText);
      setPageOriginalText(pageNumber, extractedText);
      setOcrDone(true);
    } catch (error) {
      setText("Error extracting text");
    } finally {
      if (loading.type === "translate") return;
      setLoading({ isLoading: false });
    }
  }

  function translationReset() {
    const originalText = getOriginalOcrText(pageNumber);
    if (originalText) {
      setText(originalText);
    }
    abort();
    setLoading({ isLoading: false });
    setIsTranslating(false);
    setSelectedTranslateLanguage(null);
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200 px-2 py-3">
          <div className="flex justify-between items-center">
            <TranslateControl
              onTranslated={runTranslation}
              reset={() => translationReset()}
              disableSelect={loading.isLoading}
            />
            <CopyTextButton text={text} />
          </div>
        </div>

        <div className="p-1">
          {loading.isLoading ? (
            <TextLoading progress={progress > 0 ? progress : undefined} />
          ) : isTranslating ? (
            <TextLoading />
          ) : (
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-md border min-h-screen">
              {text}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}

export default OCRText;

export function TextLoading({ progress = 0 }: { progress?: number }) {
  const { loading, selectedTranslateLanguage } = usePDF();
  return (
    <div className="min-h-screen flex justify-center py-10 text-sm text-gray-500">
      <Settings
        className="animate-spin w-5 h-5 text-gray-600 mr-2"
        strokeWidth={1}
      />
      <span>
        {loading.type === "ocr"
          ? `OCR Progress ${progress > 0 ? `${progress}%` : ""}`
          : `Translating ${
              selectedTranslateLanguage ? `to ${selectedTranslateLanguage}` : ""
            }`}
      </span>
    </div>
  );
}
