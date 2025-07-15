import React, { ReactNode } from "react";
import { PDFGuard } from "../_components/PDFGuard";
import { SelectedPDF } from "../_components/SelectedPDF";
import { PdfNavbar } from "@/app/pdf/_components/PDFNavbar";
import PageNavigation from "../_components/PageNavigation";

interface PdfLayoutProps {
  children: ReactNode;
}

function layout({ children }: PdfLayoutProps) {
  return (
    <PDFGuard className="max-w-4xl mx-auto bg-white rounded-lg border my-3 p-2 min-h-screen">
      <SelectedPDF />
      <PdfNavbar />
      {children}
      <PageNavigation />
    </PDFGuard>
  );
}

export default layout;
