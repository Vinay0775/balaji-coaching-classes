import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { INSTITUTE_INFO } from '@/lib/constants';

export default function CTASection() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="relative glass-card p-10 md:p-16 text-center overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-cyan-900/20" />

          <div className="relative z-10">
            <div className="badge mb-6 mx-auto">Limited Seats</div>
            <h2 className="section-title mb-5">
              Ready to Start Your{' '}
              <span className="gradient-text">Digital Journey?</span>
            </h2>
            <p className="section-subtitle mx-auto mb-10">
              Batch shuru hone wali hai — abhi enroll karo aur apna career badlo. Free demo class bhi available hai.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="btn-primary text-base py-3.5 px-8">
                Enroll Now — Free First Class <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href={`https://wa.me/${INSTITUTE_INFO.whatsapp}?text=Hello! I want to join a course. Please share details.`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-base py-3.5 px-8"
              >
                <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
              </a>
            </div>

            <p className="text-slate-500 text-sm mt-6">
              📞 Call us: {INSTITUTE_INFO.phone} | ⏰ {INSTITUTE_INFO.timings}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
