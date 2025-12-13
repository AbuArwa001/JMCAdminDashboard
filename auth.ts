import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Apple from "next-auth/providers/apple";
import Facebook from "next-auth/providers/facebook";
import { z } from "zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        Google,
        GitHub,
        Apple,
        Facebook,
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    // Mock authentication logic
                    if (email === "admin@jmc.org" && password === "password123") {
                        return {
                            id: "1",
                            name: "Admin User",
                            email: email,
                        };
                    }
                    return null;
                }
                return null;
            },
        }),
    ],
});
