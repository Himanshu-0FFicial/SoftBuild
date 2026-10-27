import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/lib/context/StoreContext';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { CartDrawer } from '@/components/common/CartDrawer';
import { CustomCursor } from '@/components/common/CustomCursor';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SoftBuild | Luxury Custom PCs & Handcrafted Hardware',
  description:
    'SoftBuild designs and hand-assembles cinematic luxury custom computers. 48-hour burn-in stress tested, 3-year concierge warranty, and precision acoustic engineering.',
  keywords: [
    'custom PC',
    'luxury gaming PC',
    'workstation',
    'RTX 4090 PC',
    'SoftBuild',
    'prebuilt PC',
    'PC builder',
    'trade-in PC parts',
  ],
  openGraph: {
    title: 'SoftBuild | Built Like Nothing Else',
    description:
      'Cinematic luxury hardware engineering. Custom builds, flagship prebuilts, certified components, and transparent trade-in valuation.',
    siteName: 'SoftBuild',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0A0B0D] text-[#F3F4F6] selection:bg-[#00E5FF] selection:text-black">
        <StoreProvider>
          <CustomCursor />
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <CartDrawer />
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
