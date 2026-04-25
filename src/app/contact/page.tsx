'use client';

import { useState } from 'react';
import { Clock, Loader2, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedSection from '@/components/public/AnimatedSection';
import { INSTITUTE_INFO } from '@/lib/constants';
import { buildWhatsAppUrl, getPhoneHref } from '@/lib/utils';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '', course: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) {
      toast.error('Naam aur message dono zaroori hain.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Request failed');
      toast.success('Message bhej diya gaya. Hum jaldi contact karenge.');
      setForm({ name: '', email: '', phone: '', message: '', course: '' });
    } catch {
      toast.error('Message send nahi ho paya. Kripya call ya WhatsApp try karein.');
    } finally {
      setLoading(false);
    }
  };

  const contactDetails = [
    { icon: MapPin, label: 'Address', value: INSTITUTE_INFO.address },
    { icon: Phone, label: 'Phone', value: INSTITUTE_INFO.phone, href: getPhoneHref(INSTITUTE_INFO.phone) },
    { icon: Mail, label: 'Email', value: INSTITUTE_INFO.email, href: `mailto:${INSTITUTE_INFO.email}` },
    { icon: Clock, label: 'Timings', value: INSTITUTE_INFO.timings },
  ];

  const whatsappHref = buildWhatsAppUrl(
    INSTITUTE_INFO.whatsapp,
    `Hello ${INSTITUTE_INFO.name}, mujhe course details aur admission process ke baare mein batayiye.`
  );

  return (
    <>
      <section className="page-hero relative overflow-hidden pb-16 grid-bg">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(249,115,22,0.08),transparent)]" />
        <AnimatedSection className="container-custom relative z-10 text-center" variant="fadeInUp">
          <div className="badge mb-6">Contact Us</div>
          <h1 className="section-title mb-6">
            Let&apos;s <span className="gradient-text-vibrant">talk</span>
          </h1>
          <p className="section-subtitle mx-auto text-center">
            Admission, fees, demo class, batches ya course selection. Kisi bhi help ke liye hum available hain.
          </p>
        </AnimatedSection>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid gap-10 lg:grid-cols-2">
            <AnimatedSection variant="fadeInLeft" className="text-center lg:text-left">
              <h2 className="mb-7 text-2xl font-bold text-white">Reach Balaji Computer Classes</h2>
              <div className="space-y-4">
                {contactDetails.map((item) => (
                  <div key={item.label} className="glass-card flex items-start gap-4 p-5 text-left">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{item.label}</div>
                      {item.href ? (
                        <a href={item.href} className="text-sm leading-7 text-white hover:text-amber-200">
                          {item.value}
                        </a>
                      ) : (
                        <div className="text-sm leading-7 text-white">{item.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 flex items-center gap-4 rounded-[1.6rem] border border-emerald-400/25 bg-emerald-500/10 p-5 text-white"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-bold">WhatsApp par turant baat karein</div>
                  <div className="text-sm text-slate-300">Quick replies for admission and batch queries</div>
                </div>
              </a>

              <div className="mt-6 overflow-hidden rounded-[2rem] border border-white/10 shadow-xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.!2d75.787!3d26.9124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjbCsDU0JzQ0LjYiTiA3NcKwNDcnMTMuMiJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="320"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${INSTITUTE_INFO.name} location`}
                />
              </div>
            </AnimatedSection>

            <AnimatedSection variant="fadeInRight" className="glass-card p-8 sm:p-10">
              <h2 className="mb-2 text-2xl font-bold text-white">Send a message</h2>
              <p className="mb-8 text-sm leading-7 text-slate-400">Apni query bhejiye, hum jald reply karenge.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">Naam *</label>
                    <input
                      id="contact-name"
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Apna naam"
                      className="w-full rounded-2xl border border-white/10 bg-[#091425] px-4 py-3 text-white placeholder:text-slate-600 focus:border-amber-300/35 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-300">Phone</label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="98765 43210"
                      className="w-full rounded-2xl border border-white/10 bg-[#091425] px-4 py-3 text-white placeholder:text-slate-600 focus:border-amber-300/35 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@email.com"
                    className="w-full rounded-2xl border border-white/10 bg-[#091425] px-4 py-3 text-white placeholder:text-slate-600 focus:border-amber-300/35 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">Course Interest</label>
                  <select
                    id="contact-course"
                    value={form.course}
                    onChange={(e) => setForm({ ...form, course: e.target.value })}
                    className="w-full rounded-2xl border border-white/10 bg-[#091425] px-4 py-3 text-white focus:border-amber-300/35 focus:outline-none"
                  >
                    <option value="">Course select karo</option>
                    <option>RS-CIT</option>
                    <option>Web Development</option>
                    <option>Digital Marketing</option>
                    <option>Graphic Designing</option>
                    <option>Video Editing</option>
                    <option>Learn AI Tools</option>
                    <option>Not Sure Yet</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-300">Message *</label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Apna sawaal ya message likhiye..."
                    className="w-full rounded-2xl border border-white/10 bg-[#091425] px-4 py-3 text-white placeholder:text-slate-600 focus:border-amber-300/35 focus:outline-none"
                  />
                </div>

                <button id="contact-submit" type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 disabled:cursor-not-allowed disabled:opacity-60">
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" /> Message Bhejo
                    </>
                  )}
                </button>
              </form>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
