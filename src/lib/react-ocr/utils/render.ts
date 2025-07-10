import type { PDFPageProxy } from "pdfjs-dist";

export async function renderPageToImage(
  page: PDFPageProxy,
  scale = 1.5
): Promise<string> {
  const viewport = page.getViewport({ scale, rotation: 0 });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  await page.render({ canvasContext: context, viewport }).promise;
  return canvas.toDataURL("image/png");
}

export async function renderPagesToImages(
  pages: PDFPageProxy[],
  scale = 1.5
): Promise<string[]> {
  const imagePromises = pages.map(async (page) => {
    const viewport = page.getViewport({ scale, rotation: 0 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: context, viewport }).promise;
    return canvas.toDataURL("image/png");
  });

  return await Promise.all(imagePromises);
}
