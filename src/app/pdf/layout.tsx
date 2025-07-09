import { PdfNavbar } from "@/components/PDFNavbar";
import type { ReactNode } from "react";

interface PdfLayoutProps {
  children: ReactNode;
}

export default function XyzLayout({ children }: PdfLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <main className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 min-h-screen">
        <PdfNavbar />
        {children}
      </main>
    </div>
  );
}
