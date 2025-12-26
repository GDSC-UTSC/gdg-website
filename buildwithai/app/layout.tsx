import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@buildwithai/components/Navbar";
import Footer from "@buildwithai/components/Footer";
import Starfield from "@buildwithai/components/Starfield";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Build With AI 2025 — GDG UTSC",
  description: "A space‑themed developer conference with keynotes, workshops, and a build competition.",
  metadataBase: new URL("https://buildwithai.local"),
  openGraph: {
    title: "Build With AI 2025 — GDG UTSC",
    description:
      "A space‑themed developer conference with keynotes, workshops, and a build competition.",
    images: ["/globe.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}>
        <Starfield />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
