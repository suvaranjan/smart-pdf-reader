import React, { ReactNode } from "react";
import { PDFGuard } from "../_components/PDFGuard";
import { SelectedPDF } from "../_components/SelectedPDF";
import { PdfNavbar } from "@/app/pdf/_components/PDFNavbar";

interface PdfLayoutProps {
  children: ReactNode;
}

function layout({ children }: PdfLayoutProps) {
  return (
    <PDFGuard className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 min-h-screen">
      <SelectedPDF />
      <PdfNavbar />
      {children}
    </PDFGuard>
  );
}

export default layout;
