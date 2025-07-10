"use client";

import { usePdfPage } from "react-pdf-ocr";
import { usePDF } from "@/context/PDFContext";
import { useMemo } from "react";
import { PDFPageCanvasNew } from "./PDFPageCanvasNew";

export default function PDFSinglePage({ pageNumber }: { pageNumber: string }) {
  const { pdf } = usePDF();

  const pageNum = useMemo(() => parseInt(pageNumber, 10), [pageNumber]);
  const { page } = usePdfPage(pdf, pageNum);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white border rounded-lg shadow-sm p-1">
        {page ? (
          <PDFPageCanvasNew
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
