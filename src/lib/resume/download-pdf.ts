/** Direct PDF download — bypasses browser print dialog (no headers/footers). */

import { jsPDF } from "jspdf";
import { domToCanvas } from "modern-screenshot";

function sanitizeFilename(name: string): string {
  const cleaned = name.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").toLowerCase();
  return cleaned || "resume";
}

/** Lock sidebar column height to the body row before screenshot capture. */
function prepareForPdfExport(root: HTMLElement): () => void {
  const body = root.querySelector(".config-body");
  const sidebar = root.querySelector(".config-sidebar");
  const layout = root.querySelector(".config-layout");

  const saved: Array<{ el: HTMLElement; key: string; value: string }> = [];

  function setStyle(el: HTMLElement, key: string, value: string) {
    saved.push({ el, key, value: el.style.getPropertyValue(key) });
    el.style.setProperty(key, value);
  }

  if (body instanceof HTMLElement && sidebar instanceof HTMLElement) {
    const bodyHeight = Math.ceil(body.getBoundingClientRect().height);
    if (bodyHeight > 0) {
      setStyle(body, "min-height", `${bodyHeight}px`);
      setStyle(sidebar, "min-height", `${bodyHeight}px`);
      setStyle(sidebar, "height", `${bodyHeight}px`);
      setStyle(sidebar, "align-self", "stretch");
    }
  }

  if (layout instanceof HTMLElement) {
    const layoutHeight = Math.ceil(layout.getBoundingClientRect().height);
    if (layoutHeight > 0) {
      setStyle(layout, "min-height", `${layoutHeight}px`);
    }
  }

  return () => {
    for (const { el, key, value } of saved.reverse()) {
      if (value) {
        el.style.setProperty(key, value);
      } else {
        el.style.removeProperty(key);
      }
    }
  };
}

/** Fill only the gap below the sidebar if the screenshot clipped the background. */
function extendSidebarBackground(canvas: HTMLCanvasElement, root: HTMLElement): void {
  const sidebar = root.querySelector(".config-sidebar");
  const body = root.querySelector(".config-body");
  if (!(sidebar instanceof HTMLElement) || !(body instanceof HTMLElement)) return;

  const rootRect = root.getBoundingClientRect();
  const sidebarRect = sidebar.getBoundingClientRect();
  const bodyRect = body.getBoundingClientRect();
  if (rootRect.width <= 0) return;

  const scale = canvas.width / rootRect.width;
  const gapStartY = (sidebarRect.bottom - rootRect.top) * scale;
  const bodyEndY = (bodyRect.bottom - rootRect.top) * scale;
  const height = bodyEndY - gapStartY;

  if (height < 2) return;

  const x = Math.round((sidebarRect.left - rootRect.left) * scale);
  const width = Math.round(sidebarRect.width * scale);
  const bg = window.getComputedStyle(sidebar).backgroundColor;

  if (!bg || bg === "transparent" || bg === "rgba(0, 0, 0, 0)") return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = bg;
  ctx.fillRect(x, Math.round(gapStartY), width, Math.round(height));
}

/** Crop trailing empty whitespace so min-height doesn't add a blank PDF page. */
function trimCanvasBottom(canvas: HTMLCanvasElement, paddingPx = 8): HTMLCanvasElement {
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const { width, height } = canvas;
  const data = ctx.getImageData(0, 0, width, height).data;
  let lastContentRow = -1;

  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x += 2) {
      const i = (y * width + x) * 4;
      const alpha = data[i + 3];
      if (alpha < 8) continue;
      if (data[i] < 252 || data[i + 1] < 252 || data[i + 2] < 252) {
        lastContentRow = y;
        break;
      }
    }
    if (lastContentRow >= 0) break;
  }

  if (lastContentRow < 0 || lastContentRow + paddingPx >= height - 1) {
    return canvas;
  }

  const trimmedHeight = Math.min(height, lastContentRow + paddingPx + 1);
  const trimmed = document.createElement("canvas");
  trimmed.width = width;
  trimmed.height = trimmedHeight;
  trimmed.getContext("2d")?.drawImage(canvas, 0, 0);
  return trimmed;
}

async function canvasToPdf(canvas: HTMLCanvasElement, filename: string): Promise<void> {
  const trimmed = trimCanvasBottom(canvas);
  const pdf = new jsPDF({ unit: "pt", format: "letter", orientation: "portrait" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth;
  const pxPageHeight = Math.floor((trimmed.width * pageHeight) / pageWidth);
  const minSlicePx = 12;

  let renderedHeight = 0;
  let page = 0;

  while (renderedHeight < trimmed.height) {
    const remaining = trimmed.height - renderedHeight;
    if (remaining < minSlicePx) break;

    const sliceHeight = Math.min(pxPageHeight, remaining);
    if (page > 0) pdf.addPage();

    const pageCanvas = document.createElement("canvas");
    pageCanvas.width = trimmed.width;
    pageCanvas.height = sliceHeight;

    const ctx = pageCanvas.getContext("2d");
    if (!ctx) break;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
    ctx.drawImage(
      trimmed,
      0,
      renderedHeight,
      trimmed.width,
      sliceHeight,
      0,
      0,
      trimmed.width,
      sliceHeight,
    );

    const imgData = pageCanvas.toDataURL("image/jpeg", 0.98);
    const pdfSliceHeight = (sliceHeight * imgWidth) / trimmed.width;
    pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, pdfSliceHeight);

    renderedHeight += sliceHeight;
    page += 1;
  }

  pdf.save(`${sanitizeFilename(filename)}.pdf`);
}

export async function downloadResumePdf(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  await document.fonts.ready;

  element.classList.add("pdf-export");

  try {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });

    const restoreLayout = prepareForPdfExport(element);

    try {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      });

      const canvas = await domToCanvas(element, {
        scale: 2,
        backgroundColor: "#ffffff",
        style: {
          margin: "0",
          boxShadow: "none",
        },
      });

      extendSidebarBackground(canvas, element);
      await canvasToPdf(canvas, filename);
    } finally {
      restoreLayout();
    }
  } finally {
    element.classList.remove("pdf-export");
  }
}

export function findResumePageElement(root: ParentNode = document): HTMLElement | null {
  return root.querySelector(".resume-page") as HTMLElement | null;
}
