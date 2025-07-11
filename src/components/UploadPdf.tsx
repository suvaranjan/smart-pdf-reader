"use client";

import { useState, useRef, useEffect } from "react";
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
import { supportedOcrLanguages, usePdfDocument } from "@/lib/react-ocr";

export default function UploadPdf() {
  const router = useRouter();
  const { setOcrLanguage, ocrLanguage, setFileName, setPdf, setPageNumbers } =
    usePDF();

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { pdf, pageNumbers, error: loadError, loading } = usePdfDocument(file);

  useEffect(() => {
    if (pdf) setPdf(pdf);
    if (pageNumbers) setPageNumbers(pageNumbers);
  }, [pdf, pageNumbers]);

  useEffect(() => {
    if (loadError) setError(loadError);
  }, [loadError]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);

    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return setError("Please select a PDF.");
    if (!ocrLanguage) return setError("Please select a language.");
    if (!pdf || !pageNumbers) return setError("PDF not ready yet.");
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
            selectedCode={ocrLanguage?.code}
            onSelect={(code) => {
              const selected = supportedOcrLanguages.find(
                (l) => l.code === code
              );
              if (selected) setOcrLanguage(selected);
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
      className="w-full bg-white text-black border border-black shadow-[2px_2px_0_0_black] rounded-none font-mono uppercase tracking-wide hover:text-white hover:shadow-white"
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
