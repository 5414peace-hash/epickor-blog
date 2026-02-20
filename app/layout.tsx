import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { SpeedInsights } from '@vercel/speed-insights/next';
import "./globals.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "EpicKor | No.1 Korean Dispatch Channel",
  description: "Discover Hidden Travel Gems, Unique Attractions, and Must-Visit Destinations in Korea",
  openGraph: {
    title: "EpicKor | No.1 Korean Dispatch Channel",
    description: "Discover Hidden Travel Gems, Unique Attractions, and Must-Visit Destinations in Korea",
    url: "https://www.epickor.com",
    siteName: "EpicKor",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {/* Header */}
        <header className="border-b border-gray-200 bg-white">
          <div className="container mx-auto flex items-center justify-between px-4 py-4">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              EpicKor
            </Link>
            <nav className="flex gap-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-gray-50 py-12">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p className="mb-2">© 2026 EpicKor. All rights reserved.</p>
            <p className="text-sm">
              Discover the hidden charms of Korea that no one has told you about!
            </p>
          </div>
        </footer>
        <SpeedInsights />
      </body>
    </html>
  );
}
