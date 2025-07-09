import { notFound } from "next/navigation";
import React from "react";
import OCRText from "../../_components/OCRText";

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

  return <div>{mode == "ocr" ? <OCRText /> : "Hello"}</div>;
}

export default page;
