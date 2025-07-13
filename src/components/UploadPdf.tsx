"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { usePDF } from "@/context/PDFContext";
import { supportedOcrLanguages } from "@/lib/react-ocr";

export default function UploadPdf() {
  const router = useRouter();
  const {
    setSelectedOcrLanguage,
    selectedOcrLanguage,
    setFileName,
    setParsedPdf,
    setPageNumbers,
  } = usePDF();

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setLoading(true);

    try {
      // 👇 Dynamically load pdfjs-dist directly here
      const pdfjsLib = await import("pdfjs-dist");
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      const totalPages = pdf.numPages;
      const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

      setParsedPdf(pdf);
      setPageNumbers(pages);
    } catch (err) {
      console.error("PDF load error:", err);
      setError("Failed to load PDF.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setError("Please select a PDF.");
    if (!selectedOcrLanguage) return setError("Please select a language.");
    router.push("/pdf/ocr/1");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-white text-black">
      <div className="w-full max-w-md space-y-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 border border-black p-8 shadow-[4px_4px_0_0_black] rounded-none"
        >
          <FileUploader
            file={file}
            error={error}
            fileInputRef={fileInputRef}
            onChange={handleFileChange}
          />
          <LanguageSelector
            selectedCode={selectedOcrLanguage?.code}
            onSelect={(code) => {
              const selected = supportedOcrLanguages.find(
                (l) => l.code === code
              );
              if (selected) setSelectedOcrLanguage(selected);
            }}
          />
          {error && <ErrorMessage message={error} />}
          <SubmitButton disabled={!file || loading} loading={loading} />
        </form>
      </div>
    </div>
  );
}

// -------------------- Subcomponents --------------------

function FileUploader({
  file,
  error,
  fileInputRef,
  onChange,
}: {
  file: File | null;
  error: string | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div
      className={`border border-dashed border-black p-6 cursor-pointer text-center transition-all select-none ${
        file ? "bg-gray-100" : error ? "bg-gray-50" : "bg-white"
      }`}
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="flex flex-col items-center justify-center gap-3">
        {file ? (
          <>
            <CheckCircle2 className="h-6 w-6 text-black" />
            <p className="font-mono uppercase text-sm tracking-wide">
              {file.name}
            </p>
            <p className="text-xs">Click to change file</p>
          </>
        ) : (
          <>
            <UploadCloud className="h-6 w-6 text-black" />
            <p className="font-mono uppercase text-sm tracking-wide">
              Drag or click to upload
            </p>
            <p className="text-xs text-black/70">PDF only</p>
          </>
        )}
      </div>
      <input
        type="file"
        accept="application/pdf"
        ref={fileInputRef}
        onChange={onChange}
        className="hidden"
      />
    </div>
  );
}

function LanguageSelector({
  selectedCode,
  onSelect,
}: {
  selectedCode?: string;
  onSelect: (code: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-wide">
        <FileText className="h-4 w-4 text-black" />
        <label>OCR Language</label>
      </div>
      <Select value={selectedCode} onValueChange={onSelect}>
        <SelectTrigger className="w-full border border-black rounded-none">
          <SelectValue placeholder="Select Language" />
        </SelectTrigger>
        <SelectContent>
          {supportedOcrLanguages.map((lang) => (
            <SelectItem
              key={lang.code}
              value={lang.code}
              className="font-mono uppercase text-sm"
            >
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-black">
      <XCircle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
}

import { cn } from "@/lib/utils";

function SubmitButton({
  disabled,
  loading,
}: {
  disabled: boolean;
  loading: boolean;
}) {
  return (
    <Button
      type="submit"
      disabled={disabled}
      className={cn(
        "w-full border border-black shadow-[2px_2px_0_0_black] rounded-none font-mono uppercase tracking-wide",
        "hover:text-white hover:shadow-white",
        !disabled && "bg-green-300 text-black",
        disabled && "bg-white text-black"
      )}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Processing
        </span>
      ) : (
        "Process Document"
      )}
    </Button>
  );
}
