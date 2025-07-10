"use client";

import { useEffect } from "react";
import { usePDF } from "@/context/PDFContext";
import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export function PDFGuard({ children }: Props) {
  const { pdf, fileName, ocrLanguage, pageNumbers } = usePDF();
  const router = useRouter();

  const isInvalid =
    !pdf ||
    !fileName ||
    !ocrLanguage ||
    !pageNumbers ||
    pageNumbers.length === 0;

  useEffect(() => {
    if (isInvalid) {
      router.push("/");
    }
  }, [isInvalid, router]);

  // Optionally render null or a loading indicator while redirecting
  if (isInvalid) return null;

  return <>{children}</>;
}
