"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { usePDF } from "@/context/PDFContext";

export function TranslateControl({
  onTranslated,
  reset,
  disableSelect,
}: {
  onTranslated: (lang: string) => void;
  reset: () => void;
  disableSelect?: boolean;
}) {
  const [selectedLang, setSelectedLang] = useState<string | null>(null);

  const handleSelect = (lang: string) => {
    setSelectedLang(lang);
    onTranslated(lang);
  };

  const handleClear = () => {
    setSelectedLang(null);
    reset();
  };

  return selectedLang ? (
    <BadgeComp lang={selectedLang} onClear={handleClear} />
  ) : (
    <SelectComp onSelect={handleSelect} disabled={disableSelect} />
  );
}

function SelectComp({
  onSelect,
  disabled, // ✅ Accept prop
}: {
  onSelect: (lang: string) => void;
  disabled?: boolean;
}) {
  const { ocrLanguage } = usePDF();

  const translateLanguages = ["english", "hindi", "hinglish"];

  const availableLanguages = translateLanguages.filter(
    (lang) => lang.toLowerCase() !== ocrLanguage.name.toLowerCase()
  );

  return (
    <Select onValueChange={onSelect} disabled={disabled}>
      <SelectTrigger className="w-36">
        <SelectValue placeholder="Translate to..." />
      </SelectTrigger>
      <SelectContent>
        {availableLanguages.map((lang) => (
          <SelectItem key={lang} value={lang}>
            {lang.charAt(0).toUpperCase() + lang.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function BadgeComp({ lang, onClear }: { lang: string; onClear: () => void }) {
  const label = lang.charAt(0).toUpperCase() + lang.slice(1).toLowerCase();

  return (
    <Badge variant="outline" className="gap-0 rounded-md px-2 py-1">
      {label} Translated Text
      <button
        className="focus-visible:border-ring focus-visible:ring-ring/50 text-foreground/60 hover:text-foreground -my-[5px] -ms-0.5 -me-2 inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-[inherit] p-0 transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
        onClick={onClear}
        aria-label="Remove Translation"
      >
        <XIcon size={14} />
      </button>
    </Badge>
  );
}
