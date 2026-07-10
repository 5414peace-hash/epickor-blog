import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import BackToTopButton from '@/components/BackToTopButton';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.epickor.com'),
  title: 'EpicKor | Korea Guides, Culture, Travel, Beauty, and Business',
  description:
    'EpicKor is an English-language Korea media and guide hub for travel, food, shopping, K-beauty, culture explainers, and Korean business stories.',
  verification: {
    google: 'lkmJl1SXKSHSfz7_W2pK3VG-_VrxvN820yQ_xmydpUg',
  },
  openGraph: {
    title: 'EpicKor | Korea Guides, Culture, Travel, Beauty, and Business',
    description:
      'EpicKor is an English-language Korea media and guide hub for travel, food, shopping, K-beauty, culture explainers, and Korean business stories.',
    url: 'https://www.epickor.com',
    siteName: 'EpicKor',
    locale: 'en_US',
    type: 'website',
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
        <header className="fixed inset-x-0 top-0 z-[1000] h-[76px] border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
          <div className="container mx-auto flex h-full items-center justify-between gap-5 px-4">
            <Link href="/" className="shrink-0">
              <span className="block font-serif text-3xl font-black leading-none tracking-normal text-gray-950 md:text-[2.15rem]">
                EpicKor<span className="text-red-500">.</span>
              </span>
              <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.22em] text-gray-500">
                Korea, explained.
              </span>
            </Link>

            <nav className="flex min-w-0 items-center gap-3 overflow-x-auto whitespace-nowrap text-[13px] font-bold text-gray-700 sm:gap-5 md:text-sm">
              <Link href="/latest" className="hover:text-red-600">
                Latest
              </Link>
              <Link href="/travel" className="hover:text-blue-700">
                Travel
              </Link>
              <Link href="/food-shopping" className="hover:text-red-600">
                Food & Shopping
              </Link>
              <Link href="/beauty-lifestyle" className="hover:text-pink-600">
                Beauty & Lifestyle
              </Link>
              <Link href="/culture" className="hover:text-violet-700">
                Culture
              </Link>
              <Link href="/business" className="inline-flex items-center gap-2 hover:text-emerald-700">
                Business
                <span className="rounded-md bg-emerald-700 px-2 py-0.5 text-[10px] font-black uppercase text-white">
                  Desk
                </span>
              </Link>
              <Link href="/instagram" className="hover:text-red-500">
                Instagram Guides
              </Link>
            </nav>
          </div>
        </header>

        <div className="pt-[76px]">
          <main>{children}</main>
          <BackToTopButton />

          <footer className="border-t border-gray-200 bg-gray-50 py-10">
            <div className="container mx-auto grid gap-8 px-4 text-sm text-gray-600 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
            <div>
              <Link href="/" className="font-serif text-3xl font-black text-gray-950">
                EpicKor<span className="text-red-500">.</span>
              </Link>
              <p className="mt-3 max-w-sm leading-6">
                English-language Korea guides for travelers, shoppers, culture readers, and business researchers.
              </p>
            </div>

            <div>
              <h2 className="font-black uppercase text-gray-950">Explore</h2>
              <div className="mt-3 grid gap-2">
                <Link href="/latest" className="hover:text-gray-950">
                  Latest updates
                </Link>
                <Link href="/travel" className="hover:text-gray-950">
                  Travel guides
                </Link>
                <Link href="/food-shopping" className="hover:text-gray-950">
                  Food & shopping
                </Link>
                <Link href="/beauty-lifestyle" className="hover:text-gray-950">
                  Beauty & lifestyle
                </Link>
              </div>
            </div>

            <div>
              <h2 className="font-black uppercase text-gray-950">Business</h2>
              <div className="mt-3 grid gap-2">
                <Link href="/business" className="hover:text-gray-950">
                  Business Desk
                </Link>
                <Link href="/business/editor" className="hover:text-gray-950">
                  Editor profile
                </Link>
              </div>
            </div>

            <div>
              <h2 className="font-black uppercase text-gray-950">Follow</h2>
              <div className="mt-3 grid gap-2">
                <Link href="/instagram" className="hover:text-gray-950">
                  Instagram guide hub
                </Link>
                <a
                  href="https://www.instagram.com/epickorsnippets/reels/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-950"
                >
                  EpicKor Reels
                </a>
              </div>
            </div>

            <p className="border-t border-gray-200 pt-6 text-xs text-gray-500 md:col-span-4">
              (c) 2026 EpicKor. Korea, explained for travelers, shoppers, culture readers, and business researchers.
            </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
