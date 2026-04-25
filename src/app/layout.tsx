import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import FloatingButtons from '@/components/public/FloatingButtons';
import Providers from '@/components/Providers';
import { Plus_Jakarta_Sans } from 'next/font/google';

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jakarta',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#07111f',
};

export const metadata: Metadata = {
  title: 'Balaji Computer Classes - Shaping Digital Futures',
  description:
    'Join Balaji Computer Classes for top computer courses - RS-CIT, Web Development, Digital Marketing, Graphic Design, Video Editing and AI Tools. Best computer coaching in Rajasthan.',
  keywords:
    'balaji computer classes, computer courses rajasthan, RS-CIT coaching, web development course, digital marketing institute',
  openGraph: {
    title: 'Balaji Computer Classes',
    description: 'Best computer coaching in Rajasthan for RS-CIT, Web Development, Digital Marketing and more',
    type: 'website',
    siteName: 'Balaji Computer Classes',
  },
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={jakarta.variable}>
      <body className={`${jakarta.className} antialiased bg-[#07111f] text-white`} suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <FloatingButtons />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#112239',
                color: '#fff',
                border: '1px solid rgba(245,158,11,0.25)',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
