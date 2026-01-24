import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Toaster } from "sonner";
import FirebaseProvider from "@/components/FirebaseProvider";

import localFont from "next/font/local";

const inter = localFont({
  src: [
    {
      path: "../public/fonts/Inter-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Inter-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "JMC Admin Dashboard",
  description: "Admin dashboard for Jamia Mosque Donation Management",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <FirebaseProvider>
          {children}
        </FirebaseProvider>
        <Toaster position="top-right" richColors />
        <Analytics />
      </body>
    </html>
  );
}
