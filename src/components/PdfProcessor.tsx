"use client";

import { useEffect } from "react";
import { usePdfDocument } from "@/lib/react-ocr";
import { usePDF } from "@/context/PDFContext";

export default function PdfProcessor({ file }: { file: File | null }) {
  const { setParsedPdf, setPageNumbers } = usePDF();
  const { pdf, pageNumbers, error } = usePdfDocument(file);

  useEffect(() => {
    if (pdf) setParsedPdf(pdf);
    if (pageNumbers) setPageNumbers(pageNumbers);
  }, [pdf, pageNumbers]);

  //   useEffect(() => {
  //     if (error) setError(error);
  //   }, [error]);

  return null;
}
