// import UploadPdf from "@/components/UploadPdf";
"use client";

import dynamic from "next/dynamic";

const DynamicUploadPdf = dynamic(() => import("@/components/UploadPdf"), {
  ssr: false,
});

export default function HomePage() {
  return (
    <div>
      <DynamicUploadPdf />
    </div>
  );
}
