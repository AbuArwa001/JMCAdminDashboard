import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isPathPublic, isFirebaseTokenValid } from '@/lib/auth-middleware';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const isPublic = isPathPublic(pathname);
    const firebaseToken = request.cookies.get('firebaseToken')?.value;
    const isAuthenticated = isFirebaseTokenValid(firebaseToken);

    if (!isPublic && !isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isPublic && (pathname === '/login' || pathname === '/signup')) {
        const hasError = request.nextUrl.searchParams.has('error');
        if (isAuthenticated && !hasError) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
