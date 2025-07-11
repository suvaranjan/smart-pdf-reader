"use client";

import { usePDF } from "@/context/PDFContext";
import { useEffect, useMemo, useState } from "react";
import { PDFPageCanvas } from "@/lib/react-ocr/components/PDFPageCanvas";

export default function PDFSinglePage({ pageNumber }: { pageNumber: string }) {
  const { pdf } = usePDF();
  const [page, setPage] = useState<any>(null);

  const pageNum = useMemo(() => parseInt(pageNumber, 10), [pageNumber]);

  useEffect(() => {
    const fetchPage = async () => {
      if (!pdf || isNaN(pageNum)) return;
      try {
        const loadedPage = await pdf.getPage(pageNum);
        setPage(loadedPage);
      } catch (err) {
        console.error("Failed to load page:", err);
      }
    };

    fetchPage();
  }, [pdf, pageNum]);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white border rounded-lg shadow-sm p-1">
        {page ? (
          <PDFPageCanvas
            page={page}
            scale={1.5}
            className="rounded-lg border"
          />
        ) : (
          <div className="text-center text-sm text-gray-500">
            Loading page...
          </div>
        )}
      </div>
    </div>
  );
}
