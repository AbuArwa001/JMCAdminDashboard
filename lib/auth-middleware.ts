import { jwtDecode } from "jwt-decode";

export const PUBLIC_PATHS = [
    '/login',
    '/signup',
    '/reset-password',
    '/forgot-password',
    '/logo.png',
    '/api/auth'
];

export function isPathPublic(pathname: string): boolean {
    return PUBLIC_PATHS.some(path => pathname.startsWith(path));
}

export function isFirebaseTokenValid(token?: string): boolean {
    if (!token) return false;
    try {
        const decoded = jwtDecode<{ exp?: number }>(token);
        const currentTime = Date.now() / 1000;
        return Boolean(decoded.exp && decoded.exp > currentTime);
    } catch {
        return false;
    }
}

