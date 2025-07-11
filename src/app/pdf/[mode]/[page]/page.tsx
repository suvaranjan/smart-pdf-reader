// app/pdf/[mode]/[page]/page.tsx

import { notFound } from "next/navigation";
import React from "react";
import OCRText from "../../_components/OCRText";
import PDFSinglePage from "../../_components/PDFSinglePage";

interface PageProps {
  params: Promise<{
    mode: string;
    page: string;
  }>;
}

async function page({ params }: PageProps) {
  const { mode, page } = await params;
  const pageNumber = Number.parseInt(page);

  if (!["normal", "ocr"].includes(mode)) {
    notFound();
  }

  if (isNaN(pageNumber) || pageNumber < 1) {
    notFound();
  }

  return (
    <div>
      {mode == "ocr" ? (
        <OCRText pageNumber={page} />
      ) : (
        <PDFSinglePage pageNumber={page} />
      )}
    </div>
  );
}

export default page;
