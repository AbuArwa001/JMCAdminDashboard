import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    providers: [
        // Added later in auth.ts
    ],
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = !nextUrl.pathname.startsWith("/login") && !nextUrl.pathname.startsWith("/signup") && !nextUrl.pathname.startsWith("/api");

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                // If user is logged in and tries to access login/signup, redirect to dashboard
                if (nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/signup")) {
                    return Response.redirect(new URL("/", nextUrl));
                }
            }
            return true;
        },
    },
} satisfies NextAuthConfig;
