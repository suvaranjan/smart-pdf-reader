"use client";

import { dummyText } from "@/data/ocrText";
import React from "react";
import { TranslateSelect } from "./translate-select";
import { CopyTextButton } from "./copy-text-button";

function OCRText() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <TranslateSelect />
            <CopyTextButton text={dummyText} />
          </div>
        </div>

        <div className="p-4">
          <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800 leading-relaxed bg-gray-50 p-4 rounded-md border">
            {dummyText}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default OCRText;
