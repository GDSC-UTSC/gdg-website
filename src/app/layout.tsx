import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GDG @ UTSC - Google Developer Group",
  description:
    "Google Developer Group at University of Toronto Scarborough - Join our community of passionate developers and innovators",
  authors: [{ name: "GDG @ UTSC" }],
  openGraph: {
    title: "GDG @ UTSC - Google Developer Group",
    description:
      "Google Developer Group at University of Toronto Scarborough - Join our community of passionate developers and innovators",
    type: "website",
    images: ["/gdg-logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/gdg-logo.png"],
  },
  icons: {
    icon: "/gdg-logo.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
