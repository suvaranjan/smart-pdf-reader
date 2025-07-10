import { useEffect, useState } from "react";
import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";

export function usePdfPage(pdf: PDFDocumentProxy | null, pageNumber: number) {
  const [page, setPage] = useState<PDFPageProxy | null>(null);

  useEffect(() => {
    if (!pdf) return;
    const load = async () => {
      const p = await pdf.getPage(pageNumber);
      setPage(p);
    };
    load();
  }, [pdf, pageNumber]);

  return { page };
}
