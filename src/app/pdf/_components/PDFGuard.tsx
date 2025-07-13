"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePDF } from "@/context/PDFContext";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function PDFGuard({ children, className }: Props) {
  const { fileName, parsedPdf, pageNumbers } = usePDF();

  const router = useRouter();

  const isInvalid =
    !fileName || !parsedPdf || !pageNumbers || pageNumbers.length === 0;

  useEffect(() => {
    if (isInvalid) {
      router.replace("/pdf");
    }
  }, [isInvalid, router]);

  // While redirecting, render nothing.
  if (isInvalid) return null;

  return <div className={className}>{children}</div>;
}
