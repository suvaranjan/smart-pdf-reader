"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { usePDF } from "@/context/PDFContext";

interface CopyTextButtonProps {
  text: string;
}

export function CopyTextButton({ text }: CopyTextButtonProps) {
  const { loading } = usePDF();
  const [copied, setCopied] = useState(false);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <Button
      onClick={handleCopyText}
      variant="outline"
      size="sm"
      className="flex items-center gap-2 bg-transparent cursor-pointer text-gray-700"
      disabled={loading.isLoading}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-500" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          Copy
        </>
      )}
    </Button>
  );
}
