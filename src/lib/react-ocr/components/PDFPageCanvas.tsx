"use client";
import {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  type CSSProperties,
} from "react";
import type { PDFPageProxy } from "pdfjs-dist";

interface Props {
  page: PDFPageProxy | null;
  scale?: number;
  className?: string;
  style?: CSSProperties;
  onRenderStart?: () => void;
  onRenderComplete?: () => void;
}

/**
 * Renders a single PDF page onto a canvas.
 */
export const PDFPageCanvas = forwardRef<HTMLCanvasElement, Props>(
  (
    { page, scale = 1.5, className, style, onRenderStart, onRenderComplete },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useImperativeHandle(ref, () => canvasRef.current!);

    useEffect(() => {
      if (!page || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const viewport = page.getViewport({ scale });

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      onRenderStart?.();

      const renderTask = page.render({ canvasContext: ctx!, viewport });

      renderTask.promise
        .then(() => {
          onRenderComplete?.();
        })
        .catch((err) => {
          if (err?.name === "RenderingCancelledException") {
            return;
          }
          console.error("PDF render error:", err);
        });

      return () => {
        renderTask.cancel();
      };
    }, [page, scale, onRenderStart, onRenderComplete]);

    return (
      <canvas
        ref={canvasRef}
        className={className}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          ...style,
        }}
      />
    );
  }
);

PDFPageCanvas.displayName = "PDFPageCanvasNew";
