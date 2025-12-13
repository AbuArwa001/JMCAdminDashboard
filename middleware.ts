// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { admin } from '@/firebase/admint';
export async function middleware(request: NextRequest){
    const { pathname } = request.nextUrl;

    // Define paths that don't require authentication
    const publicPaths = ['/login', '/signup', '/logo.png', '/api/auth'];
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

    // Get Firebase token from cookies or headers
    const firebaseToken = request.cookies.get('firebaseToken')?.value;

    // Check if user is authenticated (Firebase token exists)
    const isAuthenticated = !!firebaseToken;

    // --- 1. Handle Protected Routes ---
    if (!isPublicPath) {
        if (!isAuthenticated) {
            console.log(`[Middleware] Redirecting to /login due to missing Firebase token for ${pathname}`);
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // --- 2. Handle Public Routes (Login/Signup) ---
    if (isPublicPath && pathname === '/login' || pathname === '/signup') {
        if (isAuthenticated) {
            console.log(`[Middleware] Redirecting to / for authenticated user on ${pathname}`);
            return NextResponse.redirect(new URL('/', request.url));
        }
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};