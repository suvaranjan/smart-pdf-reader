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
}

/**
 * Renders a single PDF page onto a canvas.
 * - Fully customizable via `style`, `className`, and `ref`.
 * - `ref` gives access to the canvas DOM node.
 */
export const PDFPageCanvas = forwardRef<HTMLCanvasElement, Props>(
  ({ page, scale = 1.5, className, style }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Expose canvas element to parent via ref
    useImperativeHandle(ref, () => canvasRef.current!);

    useEffect(() => {
      if (!page || !canvasRef.current) return;

      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      page.render({ canvasContext: ctx!, viewport });
    }, [page, scale]);

    return (
      <canvas
        ref={canvasRef}
        className={className}
        style={{
          width: "100%", // Responsive
          height: "auto",
          display: "block",
          ...style,
        }}
      />
    );
  }
);
