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
import { availableTranslateLanguages, usePDF } from "@/context/PDFContext";

export function TranslateControl({
  onTranslated,
  reset,
  disableSelect,
}: {
  onTranslated: (lang: string) => void;
  reset: () => void;
  disableSelect?: boolean;
}) {
  const {
    selectedTranslateLanguage,
    setSelectedTranslateLanguage,
    selectedOcrLanguage,
  } = usePDF();

  const handleSelect = (lang: string) => {
    setSelectedTranslateLanguage(lang);
    onTranslated(lang);
  };

  return selectedTranslateLanguage ? (
    <BadgeComp lang={selectedTranslateLanguage} onClear={() => reset()} />
  ) : (
    <SelectComp
      onSelect={handleSelect}
      disabled={disableSelect}
      excludeLang={selectedOcrLanguage.name}
    />
  );
}

function SelectComp({
  onSelect,
  disabled,
  excludeLang,
}: {
  onSelect: (lang: string) => void;
  disabled?: boolean;
  excludeLang?: string;
}) {
  const availableLanguages = availableTranslateLanguages.filter(
    (lang) => lang.toLowerCase() !== excludeLang?.toLowerCase()
  );

  return (
    <Select onValueChange={onSelect} disabled={disabled}>
      <SelectTrigger className="w-36">
        <SelectValue placeholder="Translate to..." />
      </SelectTrigger>
      <SelectContent>
        {availableLanguages.map((lang) => (
          <SelectItem key={lang} value={lang}>
            {lang}
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
        className="text-foreground/60 hover:text-foreground -my-[5px] -ms-0.5 -me-2 inline-flex size-7 items-center justify-center rounded-[inherit] p-0 transition-colors focus-visible:ring-2 focus-visible:ring-ring"
        onClick={onClear}
        aria-label="Remove Translation"
      >
        <XIcon size={14} />
      </button>
    </Badge>
  );
}
