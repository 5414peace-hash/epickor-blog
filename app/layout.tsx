import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import Link from 'next/link';
import "./globals.css";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.epickor.com"),
  title: "EpicKor | No.1 Korean Dispatch Channel",
  description: "Discover Hidden Travel Gems, Unique Attractions, and Must-Visit Destinations in Korea",
  verification: {
    google: "lkmJl1SXKSHSfz7_W2pK3VG-_VrxvN820yQ_xmydpUg",
  },
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
        <header className="sticky top-0 z-[1000] border-b border-gray-200/80 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/75">
          <div className="container mx-auto flex items-center justify-between px-4 py-4">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              EpicKor
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                Home
              </Link>
              <Link href="/business" className="text-gray-600 hover:text-gray-900">
                Business
              </Link>
              <a
                href="https://www.instagram.com/epickorsnippets/reels/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-pink-200 bg-pink-50 px-3 py-1.5 text-sm font-semibold text-pink-700 transition-colors hover:bg-pink-100"
              >
                Instagram
              </a>
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
      </body>
    </html>
  );
}
