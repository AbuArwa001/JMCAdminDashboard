import { toast } from "sonner";

export function downloadQrSvg(svg: SVGSVGElement | null, title: string) {
  if (!svg) return;
  const svgData = new XMLSerializer().serializeToString(svg);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const img = new Image();

  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx?.drawImage(img, 0, 0);
    const pngFile = canvas.toDataURL("image/png");
    const downloadLink = document.createElement("a");
    downloadLink.download = `${title.replace(/\s+/g, "_")}_QR.png`;
    downloadLink.href = pngFile;
    downloadLink.click();
    toast.success("QR Code downloaded successfully");
  };

  img.src = "data:image/svg+xml;base64," + btoa(svgData);
}
