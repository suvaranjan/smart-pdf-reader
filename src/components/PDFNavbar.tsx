"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, File } from "lucide-react";
import { usePDF } from "@/context/PDFContext";

export function PdfNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { pageNumbers } = usePDF();

  const isOcrActive = pathname.includes("/pdf/ocr");
  const isPdfActive = pathname.includes("/pdf/normal");

  const handlePageChange = (page: string) => {
    const basePath = isOcrActive ? "/pdf/ocr" : "/pdf/normal";
    router.push(`${basePath}/${page}`);
  };

  // Helper to extract the current page from the pathname and preserve it
  const getCurrentPageFromPath = () => {
    const parts = pathname.split("/");
    const pageSegment = parts[parts.length - 1];
    return /^\d+$/.test(pageSegment) ? pageSegment : "1";
  };

  const getNavigationUrl = (route: string) => {
    const currentPage = getCurrentPageFromPath();
    return `${route}/${currentPage}`;
  };

  return (
    <div className="p-1 border border-gray-200 rounded-lg mb-1">
      <div className="flex justify-between items-center gap-4">
        {/* Tab-like Navigation */}
        <div className="flex-1 max-w-sm">
          <div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground w-full">
            <Link
              href={getNavigationUrl("/pdf/ocr")}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-2 flex-1 ${
                isOcrActive
                  ? "bg-background text-foreground shadow-sm"
                  : "hover:bg-background/50"
              }`}
            >
              <FileText className="h-4 w-4" />
              OCR Text
            </Link>
            <Link
              href={getNavigationUrl("/pdf/normal")}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 gap-2 flex-1 ${
                isPdfActive
                  ? "bg-background text-foreground shadow-sm"
                  : "hover:bg-background/50"
              }`}
            >
              <File className="h-4 w-4" />
              PDF Page
            </Link>
          </div>
        </div>

        {/* Page Selector */}
        <div className="w-48">
          <Select
            value={getCurrentPageFromPath()}
            onValueChange={handlePageChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select page" />
            </SelectTrigger>
            <SelectContent>
              {pageNumbers?.map((page) => (
                <SelectItem key={page} value={page.toString()}>
                  Page {page}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
