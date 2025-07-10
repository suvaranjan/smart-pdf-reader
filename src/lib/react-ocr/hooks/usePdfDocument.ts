import { useEffect, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import { loadPdf } from "../pdf/loadPdf";

export function usePdfDocument(file: File | null) {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [pageNumbers, setPageNumbers] = useState<number[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!file) return;

    let cancelled = false;
    setLoading(true);
    setError("");
    setPdf(null);
    setPageNumbers(null);

    const load = async () => {
      try {
        const doc = await loadPdf(file);
        if (cancelled) return;
        setPdf(doc);
        setPageNumbers(Array.from({ length: doc.numPages }, (_, i) => i + 1));
      } catch (err) {
        if (!cancelled) setError("Failed to load PDF.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [file]);

  return { pdf, pageNumbers, error, loading };
}
