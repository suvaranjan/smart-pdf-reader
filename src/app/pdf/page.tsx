"use client";
import React from "react";
import dynamic from "next/dynamic";
import Loading from "./loading";
const DynamicUploadPdf = dynamic(() => import("@/components/UploadPdf"), {
  loading: () => <Loading />,
  ssr: false,
});

function page() {
  return (
    <div className="min-h-[80vh]">
      <DynamicUploadPdf />
    </div>
  );
}

export default page;
