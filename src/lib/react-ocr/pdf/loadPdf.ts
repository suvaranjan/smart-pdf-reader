"use client";

import { getDocument, type PDFDocumentProxy } from "pdfjs-dist";

export async function loadPdf(file: File): Promise<PDFDocumentProxy> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: arrayBuffer }).promise;
  return pdf;
}
