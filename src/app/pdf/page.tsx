"use client";
import dynamic from "next/dynamic";
const DynamicUploadPdf = dynamic(() => import("@/components/UploadPdf"), {
  ssr: false,
});
import React from "react";

function page() {
  return (
    <div>
      <DynamicUploadPdf />
    </div>
  );
}

export default page;
