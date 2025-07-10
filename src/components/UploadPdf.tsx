"use client";

import { useState, useRef, useEffect } from "react";
import { usePDF } from "@/context/PDFContext";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { supportedOcrLanguages, usePdfDocument } from "react-pdf-ocr";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function UploadPdf() {
  const { setOcrLanguage, ocrLanguage, setFileName, setPdf, setPageNumbers } =
    usePDF();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load PDF via hook
  const { pdf, pageNumbers, error: loadError, loading } = usePdfDocument(file);

  // Update context when loaded
  useEffect(() => {
    if (pdf) setPdf(pdf);
    if (pageNumbers) setPageNumbers(pageNumbers);
  }, [pdf, pageNumbers]);

  // Show error from loader
  useEffect(() => {
    if (loadError) setError(loadError);
  }, [loadError]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    // if (selectedFile.size > 5 * 1024 * 1024) {
    //   setError("File size should be less than 5MB");
    //   return;
    // }

    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a PDF file");
      return;
    }

    if (!ocrLanguage) {
      setError("Please select a language");
      return;
    }

    if (!pdf || !pageNumbers) {
      setError("PDF is not ready yet.");
      return;
    }

    // console.log("Submitting:", {
    //   file,
    //   language: ocrLanguage,
    //   pageCount: pageNumbers.length,
    // });

    router.push("/pdf/ocr/1");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md space-y-6">
        {/* <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">PDF Upload</h1>
          <p className="text-gray-500">Upload your document for processing</p>
        </div> */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-8 rounded-xl border border-gray-200 shadow-sm"
        >
          {/* File Upload */}
          <div className="space-y-2">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
                file
                  ? "border-green-500 bg-green-50"
                  : error
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center justify-center space-y-3">
                {file ? (
                  <>
                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      Click to change file
                    </p>
                  </>
                ) : (
                  <>
                    <UploadCloud
                      className={`h-10 w-10 ${
                        error ? "text-red-500" : "text-gray-400"
                      }`}
                    />
                    <p className="font-medium text-gray-900">
                      Drag & drop your PDF here
                    </p>
                    <p className="text-sm text-gray-500">or click to browse</p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
            </div>
          </div>

          {/* Language Select */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-500">
              <FileText className="h-4 w-4" />
              <label className="text-sm font-medium">OCR Language</label>
            </div>
            <Select
              value={ocrLanguage.code}
              onValueChange={(value) => {
                const selected = supportedOcrLanguages.find(
                  (lang) => lang.code === value
                );
                if (selected) {
                  setOcrLanguage(selected);
                }
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {supportedOcrLanguages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <XCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={!file || loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin h-4 w-4" />
                Processing...
              </span>
            ) : (
              "Process Document"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
