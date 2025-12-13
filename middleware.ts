// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { admin } from '@/firebase/admint';
import { jwtDecode } from "jwt-decode";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Define paths that don't require authentication
    const publicPaths = ['/login', '/signup', '/logo.png', '/api/auth'];
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

    // Get Firebase token from cookies or headers
    const firebaseToken = request.cookies.get('firebaseToken')?.value;

    // Check if user is authenticated (Firebase token exists and is valid)
    let isAuthenticated = false;

    if (firebaseToken) {
        try {
            const decoded = jwtDecode(firebaseToken);
            const currentTime = Date.now() / 1000;
            // Check if token is expired
            if (decoded.exp && decoded.exp > currentTime) {
                isAuthenticated = true;
            } else {
                console.log(`[Middleware] Token expired for ${pathname}`);
            }
        } catch (error) {
            console.error(`[Middleware] Invalid token for ${pathname}`, error);
        }
    }

    // --- 1. Handle Protected Routes ---
    if (!isPublicPath) {
        if (!isAuthenticated) {
            console.log(`[Middleware] Redirecting to /login due to missing Firebase token for ${pathname}`);
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // --- 2. Handle Public Routes (Login/Signup) ---
    if (isPublicPath && (pathname === '/login' || pathname === '/signup')) {
        // If there is an error param (e.g. session_expired), allow access to login page to clear cookies
        const hasError = request.nextUrl.searchParams.has('error');

        if (isAuthenticated && !hasError) {
            console.log(`[Middleware] Redirecting to / for authenticated user on ${pathname}`);
            return NextResponse.redirect(new URL('/', request.url));
        }
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};