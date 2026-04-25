'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ArrowUp, MessageCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { INSTITUTE_INFO } from '@/lib/constants';
import { buildWhatsAppUrl } from '@/lib/utils';

export default function FloatingButtons() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/staff') ||
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/signup')
  ) {
    return null;
  }

  const whatsappUrl = buildWhatsAppUrl(
    INSTITUTE_INFO.whatsapp,
    'Hello Balaji Computer Classes, mujhe course details aur demo class ke baare mein batayiye.'
  );

  return (
    <div className="fixed bottom-5 right-5 z-[90] flex flex-col items-center gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-300/20 bg-[#112239] text-amber-300 shadow-xl"
            aria-label="Back to top"
          >
            <ArrowUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_16px_34px_rgba(34,197,94,0.35)]"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <MessageCircle className="h-7 w-7" />
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-20 animate-ping" />
        <span className="pointer-events-none absolute right-full mr-3 top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-xl border border-white/10 bg-[#112239] px-3 py-2 text-xs font-semibold text-white shadow-2xl group-hover:block sm:block">
          WhatsApp par baat karein
        </span>
      </motion.a>
    </div>
  );
}
