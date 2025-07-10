import { forwardRef, useEffect, useRef } from "react";
import type { PDFPageProxy } from "pdfjs-dist";

interface Props {
  pages: PDFPageProxy[];
  className?: string;
  style?: React.CSSProperties;
}

export const PDFPagesCanvas = forwardRef<HTMLDivElement, Props>(
  ({ pages, className = "", style }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!pages.length) return;

      const renderPages = async () => {
        const container = containerRef.current;
        if (!container) return;

        // Clear previous content
        container.innerHTML = "";

        for (const page of pages) {
          const viewport = page.getViewport({ scale: 1.5 });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d")!;
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          // Make canvas responsive
          canvas.style.width = "100%";
          canvas.style.height = "auto";
          canvas.style.display = "block";

          await page.render({ canvasContext: context, viewport }).promise;

          const wrapper = document.createElement("div");
          wrapper.style.width = "100%";
          wrapper.style.maxWidth = "900px";
          wrapper.style.margin = "1rem auto";
          wrapper.appendChild(canvas);

          container.appendChild(wrapper);
        }
      };

      renderPages();
    }, [pages]);

    return (
      <div
        ref={ref ?? containerRef}
        className={className}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          gap: "1rem",
          ...style,
        }}
      />
    );
  }
);
