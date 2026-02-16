import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { BottomNav } from "@/components/BottomNav";
import { AuthGuard } from "@/components/AuthGuard";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ondina",
  description: "Acompanhe seu ciclo de forma privada e segura.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.svg", // Using logo.svg as apple icon for now, or we could leave it out if not sure. Standard is often a png. User said verify favicon and logo.
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthGuard>
          {children}
          <BottomNav />
          <Toaster />
        </AuthGuard>
      </body>
    </html>
  );
}
