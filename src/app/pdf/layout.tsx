import type { ReactNode } from "react";
// import { PDFGuard } from "./_components/PDFGuard";

interface PdfLayoutProps {
  children: ReactNode;
}

export default function PDFLayout({ children }: PdfLayoutProps) {
  return <div>{children}</div>;
}
