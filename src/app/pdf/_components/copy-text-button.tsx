"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface CopyTextButtonProps {
  text: string;
}

export function CopyTextButton({ text }: CopyTextButtonProps) {
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
      className="flex items-center gap-2 bg-transparent"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copied
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          Copy Text
        </>
      )}
    </Button>
  );
}
