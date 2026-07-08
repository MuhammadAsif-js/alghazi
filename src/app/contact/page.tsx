'use client';

import { useState, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  CreditCard,
  Truck,
  Mail,
  Heart,
} from 'lucide-react';

// Inline SVGs for social icons not in lucide-react v1.x
const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const FacebookIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const WHATSAPP_NUMBER = '923084382626';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

export default function ContactPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <Navbar isScrolled={isScrolled} />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-[50vh] flex items-end pb-16 pt-40 px-4 overflow-hidden">
        {/* Warm wood-toned gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#F5EFE6] via-[#EDE0D0] to-[#D6C4AE]" />
        {/* Decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#C8A882]/20 blur-3xl" />
        <div className="absolute bottom-0 -left-16 w-72 h-72 rounded-full bg-[#8c7462]/15 blur-3xl" />

        <div className="relative max-w-7xl mx-auto w-full">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.p
              variants={fadeUp}
              className="text-[10px] font-bold text-[#4A3728] uppercase tracking-[0.35em] mb-4"
            >
              AL GHAZI WOOD CRAFTS
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-[#1C1917] leading-[1.05] mb-6"
            >
              Get In Touch.<br />
              <span className="text-[#8c7462] italic font-light">We&apos;d love to hear from you.</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-lg text-stone-600 max-w-xl leading-relaxed"
            >
              Have a question about an order, want a custom piece, or just want to say hello? We&apos;re here and ready to help.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── QUICK CONTACT CARDS ───────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24"
        >
          {/* WhatsApp */}
          <motion.a
            variants={fadeUp}
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Al%20Ghazi%20Wood%20Crafts!%20I%20have%20a%20question.`}
            target="_blank"
            rel="noopener noreferrer"
            id="contact-whatsapp"
            className="group relative bg-white border border-stone-200 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#25D366]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="w-14 h-14 bg-[#25D366]/10 rounded-2xl flex items-center justify-center mb-5">
              <MessageCircle className="text-[#25D366]" size={28} />
            </div>
            <h3 className="font-bold text-[#1C1917] text-lg mb-1">WhatsApp</h3>
            <p className="text-stone-500 text-sm mb-3">Fastest response — usually within minutes</p>
            <p className="font-semibold text-[#1C1917]">+92 308-4382626</p>
            <span className="mt-4 inline-flex items-center text-[#25D366] text-sm font-semibold gap-1 group-hover:gap-2 transition-all">
              Chat Now →
            </span>
          </motion.a>

          {/* Phone */}
          <motion.a
            variants={fadeUp}
            href="tel:+923084382626"
            id="contact-phone"
            className="group relative bg-white border border-stone-200 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#4A3728]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="w-14 h-14 bg-[#1C1917]/8 rounded-2xl flex items-center justify-center mb-5 bg-stone-100">
              <Phone className="text-[#1C1917]" size={28} />
            </div>
            <h3 className="font-bold text-[#1C1917] text-lg mb-1">Call Us</h3>
            <p className="text-stone-500 text-sm mb-3">Available during business hours</p>
            <p className="font-semibold text-[#1C1917]">+92 308-4382626</p>
            <span className="mt-4 inline-flex items-center text-[#4A3728] text-sm font-semibold gap-1 group-hover:gap-2 transition-all">
              Call Now →
            </span>
          </motion.a>

          {/* Email */}
          <motion.a
            variants={fadeUp}
            href="mailto:alghaziwoodcrafts@gmail.com"
            id="contact-email"
            className="group relative bg-white border border-stone-200 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mb-5">
              <Mail className="text-amber-600" size={28} />
            </div>
            <h3 className="font-bold text-[#1C1917] text-lg mb-1">Email Us</h3>
            <p className="text-stone-500 text-sm mb-3">We reply within 24 hours</p>
            <p className="font-semibold text-[#1C1917] text-sm break-all">alghaziwoodcrafts@gmail.com</p>
            <span className="mt-4 inline-flex items-center text-amber-600 text-sm font-semibold gap-1 group-hover:gap-2 transition-all">
              Send Email →
            </span>
          </motion.a>
        </motion.div>

        {/* ── FOUNDERS SECTION ──────────────────────────────────────────── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-24"
        >
          <motion.div variants={fadeUp} className="text-center mb-14">
            <p className="text-[10px] font-bold text-[#4A3728] uppercase tracking-[0.35em] mb-4">
              The Faces Behind The Craft
            </p>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#1C1917]">
              Meet the Founders
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Khalid */}
            <motion.div
              variants={fadeUp}
              id="founder-khalid"
              className="relative bg-[#1C1917] text-white rounded-3xl p-10 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#8c7462]/20 blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="w-16 h-16 bg-[#8c7462]/30 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-2xl font-serif font-bold text-amber-300">K</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-serif font-bold">Khalid</h3>
                  <Heart className="text-rose-400" size={18} fill="currentColor" />
                </div>
                <p className="text-[#b59f8c] text-xs uppercase tracking-widest font-semibold mb-5">
                  Co-Founder · Master Craftsman
                </p>
                <p className="text-stone-400 text-base leading-relaxed">
                  Khalid is the creative heart of Al Ghazi Wood Crafts. With a deep love for timber and a meticulous eye for detail, he hand-selects every plank that enters the workshop. His passion for the grain, texture, and soul of wood drives every piece from concept to creation. Khalid believes that real wood should tell a story — and each product he crafts does exactly that.
                </p>
                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-stone-500 text-sm italic">
                    &quot;Wood is honest. It doesn&apos;t pretend. Neither do we.&quot;
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Sajid */}
            <motion.div
              variants={fadeUp}
              id="founder-sajid"
              className="relative bg-gradient-to-br from-[#F5EFE6] to-[#E8D9C8] rounded-3xl p-10 overflow-hidden border border-[#D6C4AE]"
            >
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#8c7462]/15 blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="w-16 h-16 bg-[#1C1917]/10 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-2xl font-serif font-bold text-[#4A3728]">S</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-serif font-bold text-[#1C1917]">Sajid</h3>
                  <Heart className="text-rose-400" size={18} fill="currentColor" />
                </div>
                <p className="text-[#8c7462] text-xs uppercase tracking-widest font-semibold mb-5">
                  Co-Founder · Operations & Vision
                </p>
                <p className="text-stone-600 text-base leading-relaxed">
                  Sajid is the strategic mind behind Al Ghazi&apos;s growth. He handles everything from sourcing the finest raw materials to ensuring every customer is taken care of with warmth and respect. Sajid brings the business vision to life — keeping prices fair, delivery reliable, and the brand true to its roots. Together with Khalid, he ensures that every customer feels like family.
                </p>
                <div className="mt-8 pt-6 border-t border-[#C8A882]/40">
                  <p className="text-stone-500 text-sm italic">
                    &quot;We don&apos;t just sell products. We build relationships — one piece at a time.&quot;
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Brotherhood note */}
          <motion.div
            variants={fadeUp}
            className="mt-8 bg-white border border-stone-200 rounded-3xl p-8 text-center shadow-sm"
          >
            <div className="flex justify-center gap-2 mb-4">
              <Heart className="text-rose-400" size={20} fill="currentColor" />
              <Heart className="text-rose-400" size={20} fill="currentColor" />
            </div>
            <p className="text-stone-600 text-base leading-relaxed max-w-2xl mx-auto">
              Khalid and Sajid are not just business partners — they are brothers, and the bond between them is the very foundation of Al Ghazi Wood Crafts. Their shared love for craftsmanship, honesty, and family values is what makes every product they create truly special.
            </p>
          </motion.div>
        </motion.div>

        {/* ── INFO GRID ─────────────────────────────────────────────────── */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24"
        >
          <InfoCard
            icon={<Clock className="text-[#4A3728]" size={22} />}
            title="Business Hours"
            lines={['Mon – Sat: 9 AM – 9 PM', 'Sunday: 10 AM – 6 PM', '(PKT — Pakistan Standard Time)']}
          />
          <InfoCard
            icon={<MapPin className="text-[#4A3728]" size={22} />}
            title="Workshop Location"
            lines={['Lahore, Punjab', 'Pakistan', 'Studio visits by appointment']}
          />
          <InfoCard
            icon={<CreditCard className="text-[#4A3728]" size={22} />}
            title="Payment Methods"
            lines={['Cash on Delivery (COD)', 'Meezan Bank Transfer', 'Easypaisa Mobile Wallet']}
          />
          <InfoCard
            icon={<Truck className="text-[#4A3728]" size={22} />}
            title="Delivery"
            lines={['Nationwide across Pakistan', 'Free delivery in Punjab', '(Orders above Rs. 2,500)']}
          />
        </motion.div>

        {/* ── CTA BANNER ────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="relative bg-[#1C1917] rounded-[2.5rem] overflow-hidden px-10 py-16 text-center text-white"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#4A3728_0%,_#1C1917_70%)]" />
          <div className="relative">
            <p className="text-[10px] font-bold text-[#b59f8c] uppercase tracking-[0.35em] mb-4">
              Ready to order?
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
              Chat with us on WhatsApp
            </h2>
            <p className="text-stone-400 max-w-lg mx-auto mb-8 leading-relaxed">
              The fastest way to place an order, ask about customizations, or get a quote. Khalid and Sajid are personally available to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Al%20Ghazi%20Wood%20Crafts!%20I%20would%20like%20to%20place%20an%20order.`}
                target="_blank"
                rel="noopener noreferrer"
                id="cta-whatsapp-btn"
                className="bg-[#25D366] text-white px-8 py-4 rounded-full font-bold shadow-xl hover:bg-[#1EB858] transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
              >
                <MessageCircle size={20} />
                Open WhatsApp
              </a>
              <Link
                href="/"
                id="cta-browse-btn"
                className="border border-white/20 text-white px-8 py-4 rounded-full font-medium hover:bg-white/10 transition-all"
              >
                Browse Collection
              </Link>
            </div>

            {/* Social links */}
            <div className="mt-10 flex justify-center gap-6">
              <a
                href="https://www.instagram.com/alghaziwoodcrafts"
                target="_blank"
                rel="noopener noreferrer"
                id="contact-instagram"
                className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors text-sm"
              >
                <InstagramIcon size={18} /> Instagram
              </a>
              <a
                href="https://www.facebook.com/alghaziwoodcrafts"
                target="_blank"
                rel="noopener noreferrer"
                id="contact-facebook"
                className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors text-sm"
              >
                <FacebookIcon size={18} /> Facebook
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}

function InfoCard({ icon, title, lines }: { icon: React.ReactNode; title: string; lines: string[] }) {
  return (
    <motion.div
      variants={fadeUp}
      className="bg-white border border-stone-200 rounded-3xl p-7 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="w-12 h-12 bg-stone-50 rounded-xl flex items-center justify-center mb-5">
        {icon}
      </div>
      <h4 className="font-bold text-[#1C1917] text-sm uppercase tracking-wider mb-3">{title}</h4>
      <ul className="space-y-1">
        {lines.map((line, i) => (
          <li key={i} className="text-sm text-stone-500 leading-relaxed">{line}</li>
        ))}
      </ul>
    </motion.div>
  );
}
