import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

export const DEFAULT_WARNING_SECONDS = 120;

export function getRemainingTokenSeconds(): number {
  const token = Cookies.get("firebaseToken") || localStorage.getItem("firebaseToken");
  if (!token) return 0;
  try {
    const decoded = jwtDecode<{ exp?: number }>(token);
    if (!decoded.exp) return 0;
    return Math.max(0, Math.floor((decoded.exp * 1000 - Date.now()) / 1000));
  } catch {
    return 0;
  }
}

export function formatTimeMMSS(secs: number): string {
  const safe = Math.max(0, secs);
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}
