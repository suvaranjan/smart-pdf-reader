"use client";

import { useRef, useState, useCallback } from "react";

export interface TranslationRequest {
  originalText: string;
  sourceLang: string;
  targetLang: string;
}

export function useTranslation() {
  const abortControllerRef = useRef<AbortController | null>(null);
  const [loading, setLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const translate = useCallback(
    async (
      { originalText, sourceLang, targetLang }: TranslationRequest,
      onSuccess?: (text: string) => void,
      onError?: (error: Error) => void
    ) => {
      if (!originalText || !sourceLang || !targetLang) return;

      const controller = new AbortController();
      abortControllerRef.current = controller;
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ originalText, sourceLang, targetLang }),
          signal: controller.signal,
        });

        const { reply } = await res.json();
        setTranslatedText(reply);
        onSuccess?.(reply);
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.warn("Translation aborted");
        } else {
          console.error("Translation failed:", err);
          setError(err);
          onError?.(err);
        }
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    []
  );

  const abort = () => {
    abortControllerRef.current?.abort();
    setLoading(false);
  };

  return {
    translate,
    abort,
    loading,
    translatedText,
    error,
  };
}
