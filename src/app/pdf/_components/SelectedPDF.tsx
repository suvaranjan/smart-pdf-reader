"use client";

import { Button } from "@/components/ui/button";
import { usePDF } from "@/context/PDFContext";
import { BookOpenText, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export function SelectedPDF() {
  const router = useRouter();
  const { fileName, pageNumbers, loading } = usePDF();

  return (
    <div className="flex items-center justify-between w-full p-2 mb-1 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 truncate">
        <Button
          variant="outline"
          size="icon"
          className="size-8 cursor-pointer"
          onClick={() => router.push("/pdf")}
          disabled={loading.isLoading}
        >
          <ArrowLeft className="size-4 text-gray-600" />
        </Button>
        <BookOpenText className="h-4 w-4 text-gray-500 shrink-0" />
        <span className="text-sm font-medium text-gray-700 truncate max-w-[180px]">
          {fileName}
        </span>
        <span className="text-sm font-medium text-gray-700 truncate max-w-[180px]">
          {pageNumbers?.length ? `(${pageNumbers.length} pages)` : ""}
        </span>
      </div>
      <Button
        variant="destructive"
        size="sm"
        className="px-2 text-xs cursor-pointer"
        onClick={() => router.push("/pdf")}
        disabled={loading.isLoading}
      >
        Change
      </Button>
    </div>
  );
}
