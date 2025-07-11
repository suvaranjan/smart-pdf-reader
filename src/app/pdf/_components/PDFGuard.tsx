"use client";

import { useEffect } from "react";
import { usePDF } from "@/context/PDFContext";
import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function PDFGuard({ children, className }: Props) {
  const { pdf, fileName, ocrLanguage, pageNumbers } = usePDF();
  const router = useRouter();

  const isInvalid =
    !pdf ||
    !fileName ||
    !ocrLanguage?.name ||
    !ocrLanguage?.code ||
    !pageNumbers ||
    pageNumbers.length === 0;

  useEffect(() => {
    if (isInvalid) {
      router.push("/pdf");
    }
  }, [isInvalid, router]);

  return <div className={className}>{children}</div>;
}
