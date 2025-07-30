import { FileText, UploadCloud } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-white text-black">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-6 border border-black p-8 shadow-[4px_4px_0_0_black] rounded-none opacity-60 select-none pointer-events-none">
          {/* File Uploader Box */}
          <div className="border border-dashed border-black p-6 text-center bg-gray-50">
            <div className="flex flex-col items-center justify-center gap-3">
              <UploadCloud className="h-6 w-6 text-black" />

              <p className="font-mono uppercase text-sm tracking-wide">
                Drag or click to upload
              </p>
              <p className="text-xs text-black/70">PDF only</p>
            </div>
          </div>

          {/* OCR Language Selector Placeholder */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-wide">
              <FileText className="h-4 w-4 text-black" />
              <label>OCR Language</label>
            </div>
            <div className="h-9 bg-gray-100 border border-black rounded-none px-3 text-sm flex items-center justify-between">
              <span className="text-black/60">Loading</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Disabled Submit Button */}
          <button
            disabled
            className="w-full bg-white text-black border border-black shadow-[2px_2px_0_0_black] rounded-none font-mono uppercase tracking-wide px-4 py-1.5 opacity-60"
          >
            <span className="flex items-center gap-2 justify-center text-sm">
              Loading
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
