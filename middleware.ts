// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// Make sure you installed this package: npm install jwt-decode
import { jwtDecode } from 'jwt-decode';

// Helper function to check token expiration
function isTokenExpired(token: string): boolean {
    try {
        const decoded: { exp: number } = jwtDecode(token);
        // exp is in seconds since epoch, Date.now() is in milliseconds
        return decoded.exp < Date.now() / 1000;
    } catch (error) {
        return true; // Invalid or malformed token format
    }
}

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('accessToken')?.value;
    const { pathname } = request.nextUrl;

    // Define paths that don't require authentication
    const publicPaths = ['/login', '/signup', '/logo.png'];
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

    // Check if a token is present AND if it is valid/not expired
    const isValidToken = accessToken && !isTokenExpired(accessToken);


    // --- 1. Handle Protected Routes ---
    if (!isPublicPath) {
        if (!isValidToken) {
            // Unauthenticated/Expired users trying to access protected paths get redirected to login
            console.log(`[Middleware] Redirecting to /login due to missing or expired token for ${pathname}`);
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // --- 2. Handle Public Routes (Login/Signup) ---
    if (isPublicPath) {
        if (isValidToken) {
            // Authenticated users trying to access login/signup get redirected to home
            console.log(`[Middleware] Redirecting to / home for authenticated user on ${pathname}`);
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // Allow the request to proceed
    return NextResponse.next();
}

export const config = {
    // Exclude API routes, static files, images, etc.
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
