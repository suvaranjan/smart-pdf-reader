"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function TranslateSelect() {
  const [language, setLanguage] = useState("english");

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Translate to:</span>
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="english">English</SelectItem>
          <SelectItem value="hindi">Hindi</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
