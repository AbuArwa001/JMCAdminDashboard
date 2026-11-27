export function getMediaUrl(path?: string | null): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("blob:") || path.startsWith("data:")) {
    return path;
  }
  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}
