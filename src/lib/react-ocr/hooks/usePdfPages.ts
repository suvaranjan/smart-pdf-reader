import { useEffect, useState } from "react";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

type PageRange = "all" | { from: number; to: number };

export function usePdfPages(
  pdf: PDFDocumentProxy | null,
  range: PageRange = "all"
) {
  const [pages, setPages] = useState<PDFPageProxy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPages = async () => {
      if (!pdf) return;

      setLoading(true);
      setError("");
      try {
        let from = 1;
        let to = pdf.numPages;

        if (typeof range === "object") {
          from = Math.max(1, range.from);
          to = Math.min(pdf.numPages, range.to);
        }

        const pagePromises = [];
        for (let i = from; i <= to; i++) {
          pagePromises.push(pdf.getPage(i));
        }

        const loadedPages = await Promise.all(pagePromises);
        setPages(loadedPages);
      } catch (err) {
        setError("Failed to load pages.");
        setPages([]);
      } finally {
        setLoading(false);
      }
    };

    loadPages();
  }, [pdf, range]);

  return { pages, loading, error };
}
