"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
// import api from "@/lib/api";
import Cookies from "js-cookie";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";


import { AnimatePresence, motion } from "framer-motion";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [loginSuccess, setLoginSuccess] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Handle session expired error
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('error') === 'session_expired') {
            // Clear all auth data
            Cookies.remove('firebaseToken');
            localStorage.removeItem('firebaseToken');
            localStorage.removeItem('firebaseUser');
            auth.signOut();
            toast.error("Session expired. Please log in again.");

            // Remove the query param
            router.replace('/login');
        }
    }, [router]);

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Sign in with Firebase using the imported auth instance
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Get ID token result to check claims
            const idTokenResult = await user.getIdTokenResult();

            // Check for admin claim or specific email
            const isAdmin = idTokenResult.claims.admin === true || user.email === "admin@jmc.org";

            if (!isAdmin) {
                await auth.signOut();
                toast.error("Access denied. Only administrators are allowed.");
                setIsLoading(false);
                return;
            }

            // Get Firebase ID token
            const firebaseToken = await user.getIdToken();

            // Store Firebase token in cookies for middleware
            Cookies.set('firebaseToken', firebaseToken, {
                expires: 1, // 1 day
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            // Also store in localStorage for client-side use
            localStorage.setItem('firebaseToken', firebaseToken);
            localStorage.setItem('firebaseUser', JSON.stringify(user));

            console.log("Admin signed in successfully:", user.email);
            setLoginSuccess(true);
            toast.success("Logged in successfully");

            // Navigate to dashboard
            router.push("/");
            router.refresh();
        } catch (error: any) {
            console.error("Login error:", error);
            const errorCode = error.code;

            // Better error messages
            let userFriendlyError = "Invalid credentials";
            if (errorCode === 'auth/user-not-found') {
                userFriendlyError = "No account found with this email";
            } else if (errorCode === 'auth/wrong-password') {
                userFriendlyError = "Incorrect password";
            } else if (errorCode === 'auth/invalid-email') {
                userFriendlyError = "Invalid email address";
            } else if (errorCode === 'auth/too-many-requests') {
                userFriendlyError = "Too many failed attempts. Please try again later";
            }

            toast.error(userFriendlyError);
            setIsLoading(false);
        }
    };


    const handleSocialLogin = (provider: string) => {
        signIn(provider, { callbackUrl: "/" });
    };

    return (
        <>
            <AnimatePresence>
                {loginSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="flex flex-col items-center"
                        >
                            <div className="relative w-24 h-24 mb-6">
                                <Image src="/logo.png" alt="JMC Logo" fill className="object-contain" />
                                <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authenticating...</h2>
                            <p className="text-gray-500">Welcome back to the JMC Admin Portal</p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="text-center space-y-2">
                <div className="relative w-20 h-20 mx-auto" style={{ width: '100px', height: '100px', position: 'relative' }}>
                    <Image src="/logo.png" alt="JMC Logo" fill className="object-contain" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                <p className="text-gray-500">Sign in to your admin account</p>
            </div>

            <form onSubmit={handleCredentialsLogin} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                        placeholder="admin@jmc.org"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                        placeholder="••••••••"
                        required
                    />
                    <div className="text-right mt-1">
                        <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                            Forgot password?
                        </Link>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary-bronze text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                </button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => handleSocialLogin("google")}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            className="text-blue-600"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            className="text-green-600"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            className="text-yellow-600"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            className="text-red-600"
                        />
                    </svg>
                    Google
                </button>
                <button
                    onClick={() => handleSocialLogin("github")}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                </button>
                <button
                    onClick={() => handleSocialLogin("facebook")}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                </button>
                <button
                    onClick={() => handleSocialLogin("apple")}
                    className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-.93 3.23-.93.63 0 1.99.32 2.78 1.44-2.38 1.33-1.97 4.76.52 5.85-.56 1.55-1.34 3.09-2.18 4.38-.64.97-1.33 1.93-2.2 2.85-.09.1-.19.18-.29.28zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                    Apple
                </button>
            </div>

            <p className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline font-medium">
                    Sign up
                </Link>
            </p>
        </>
    );
}
