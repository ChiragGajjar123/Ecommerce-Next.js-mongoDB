import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "CMG — Premium Essentials",
    template: "%s | CMG"
  },
  description: "Shop curated premium essentials with real-time stock, server-accurate pricing, and seamless checkout. CMG — built with Next.js and MongoDB.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png"
  },
  openGraph: {
    type: "website",
    siteName: "CMG",
    title: "CMG — Premium Essentials",
    description: "Shop curated premium essentials with real-time stock and seamless checkout."
  }
};

export const runtime = "nodejs";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
