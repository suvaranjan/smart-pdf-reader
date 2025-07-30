"use client";

import { usePDF } from "@/context/PDFContext";
import { useEffect, useState } from "react";
import { PDFPageCanvas } from "@/lib/react-ocr/components/PDFPageCanvas";
import { Loader } from "lucide-react";

export default function PDFSinglePage({ pageNumber }: { pageNumber: number }) {
  const { parsedPdf } = usePDF();
  const [page, setPage] = useState<any>(null);

  useEffect(() => {
    const fetchPage = async () => {
      if (!parsedPdf || isNaN(pageNumber)) return;
      try {
        const loadedPage = await parsedPdf.getPage(pageNumber);
        setPage(loadedPage);
      } catch (err) {
        console.error("Failed to load page:", err);
      }
    };

    fetchPage();
  }, [parsedPdf, pageNumber]);

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
          <Loading />
        )}
      </div>
    </div>
  );
}

function Loading() {
  return (
    <div className="min-h-screen flex justify-center py-10 text-sm text-gray-500">
      <Loader
        className="animate-spin w-5 h-5 text-gray-600 mr-2"
        strokeWidth={1}
      />
      <span>Loading</span>
    </div>
  );
}
