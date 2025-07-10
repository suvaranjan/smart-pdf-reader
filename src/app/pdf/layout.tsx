import { PdfNavbar } from "@/components/PDFNavbar";
import type { ReactNode } from "react";
import { SelectedPDF } from "./_components/SelectedPDF";
import { PDFGuard } from "./_components/PDFGuard";

interface PdfLayoutProps {
  children: ReactNode;
}

export default function PDFLayout({ children }: PdfLayoutProps) {
  return (
    <PDFGuard>
      <div className="min-h-screen bg-gray-50 p-6">
        <main className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 min-h-screen">
          <SelectedPDF />
          <PdfNavbar />
          {children}
        </main>
      </div>
    </PDFGuard>
  );
}
