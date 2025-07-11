"use client";
// lib/pdf/setupPdfWorker.ts
import { GlobalWorkerOptions } from "pdfjs-dist";

// This will run once when the module is loaded
// GlobalWorkerOptions.workerSrc =
//   "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.3.93/pdf.worker.min.mjs";

// Configure worker once globally
GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();
