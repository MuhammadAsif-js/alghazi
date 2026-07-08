'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft, MapPin, Banknote, AlertCircle, Shield, MessageCircle,
  Tag, Truck, Check, Copy, ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { calcShipping, calcBreakdown, COD_FEE, ADVANCE_DISCOUNT_RATE } from '../../../utils/pricing';
import { createOrder } from '../../actions/order';

interface Product {
  id: string;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  image: string;
  tag: string;
  desc: string;
}

export default function CheckoutClientPage({ product }: { product: Product }) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [paymentMode, setPaymentMode] = useState<'advance' | 'cod'>('advance');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    name: '', phone: '', province: '', district: '', tehsil: '', city: '', street: '',
  });

  // ── Derived pricing ──────────────────────────────────────────────────────
  const shipping       = calcShipping(form.province, paymentMode, product.discountedPrice);
  const { discountApplied, total } = calcBreakdown(product.discountedPrice, shipping, paymentMode);
  const isFreeShipping = shipping === 0;
  const codFee         = paymentMode === 'cod' ? COD_FEE : 0;

  // ── Form submit ──────────────────────────────────────────────────────────
  const handleProceedToPayment = async () => {
    const f = form;
    if (!f.name.trim() || !f.phone.trim() || !f.province.trim() || !f.district.trim() ||
        !f.tehsil.trim() || !f.city.trim() || !f.street.trim()) {
      setError('Please complete all shipping details before proceeding.');
      return;
    }
    if (!/^0?3[0-9]{9}$/.test(f.phone.replace(/\s+/g, ''))) {
      setError('Please enter a valid Pakistani phone number (e.g. 03001234567).');
      return;
    }

    setError('');
    setIsSubmitting(true);

    const res = await createOrder({
      productId:    product.id,
      customerName: f.name,
      customerPhone: f.phone,
      province:     f.province,
      district:     f.district,
      tehsil:       f.tehsil,
      city:         f.city,
      addressLine:  f.street,
      paymentMode,
    });

    setIsSubmitting(false);

    if (res.success && res.order) {
      setCreatedOrder(res.order);
      setStep(2);
    } else {
      setError(res.error || 'Failed to place order. Please try again or contact us on WhatsApp.');
    }
  };

  // ── WhatsApp CTA (advance orders) ────────────────────────────────────────
  const handleContinueWhatsApp = () => {
    const orderNum   = createdOrder?.orderNumber ?? 'PENDING';
    const totalAmt   = createdOrder?.totalAmount ?? total;
    const discAmt    = createdOrder?.discountApplied ?? discountApplied;
    const trackURL   = `${window.location.origin}/track?id=${orderNum}`;

    const message = [
      `Assalam-o-Alaikum! I placed an order on AL GHAZI WOOD CRAFTS.`,
      ``,
      `📦 Order No:   ${orderNum}`,
      `🛍️  Item:       ${product.name}`,
      `🏷️  Discount:   PKR ${discAmt.toLocaleString()} (7% advance discount)`,
      `💰 Total Paid: PKR ${totalAmt.toLocaleString()}`,
      ``,
      `📍 Delivery: ${form.street}, ${form.city}, ${form.district}, ${form.province}`,
      `👤 Name: ${form.name}  |  📱 ${form.phone}`,
      ``,
      `🔗 Track Order: ${trackURL}`,
      ``,
      `I am attaching payment proof screenshot. Please confirm my order.`,
    ].join('\n');

    window.open(`https://wa.me/923084382626?text=${encodeURIComponent(message)}`, '_blank');
    router.push(`/track?id=${orderNum}`);
  };

  // ── COD: no WhatsApp needed — show success directly ──────────────────────
  const handleCopyTracking = () => {
    const orderNum = createdOrder?.orderNumber ?? '';
    navigator.clipboard.writeText(`${window.location.origin}/track?id=${orderNum}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fieldCls = 'w-full p-4 rounded-xl bg-stone-50 border border-stone-200 focus:border-[#4A3728] outline-none text-[#1C1917] placeholder-stone-400 text-sm transition-colors';

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-stone-200 py-4 px-6 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <Link href="/" className="flex items-center gap-2 text-stone-500 hover:text-stone-900 font-medium text-sm transition-colors">
          <ChevronLeft size={16} /> Back to Store
        </Link>
        <span className="font-serif font-bold text-xl tracking-tighter">AL GHAZI</span>
        <div className="w-16" />
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full grid lg:grid-cols-12 gap-8 p-6 lg:p-12">
        {/* ── LEFT: form / confirmation ──────────────────────────────────── */}
        <div className="lg:col-span-7">
          <h1 className="text-3xl font-serif font-bold mb-8 text-[#1C1917]">Secure Checkout</h1>

          {/* ── STEP 1: Shipping + Payment selection ── */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-200">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-[#1C1917]">
                <MapPin className="text-stone-400" /> Shipping Details
              </h2>

              <div className="space-y-4 mb-8">
                <input required type="text" placeholder="Full Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={fieldCls} />
                <input required type="tel"  placeholder="WhatsApp Number *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={fieldCls} />
                <div className="grid grid-cols-2 gap-4">
                  <input required type="text" placeholder="Province *" value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })} className={fieldCls} />
                  <input required type="text" placeholder="District *" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className={fieldCls} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input required type="text" placeholder="Tehsil *"  value={form.tehsil} onChange={(e) => setForm({ ...form, tehsil: e.target.value })} className={fieldCls} />
                  <input required type="text" placeholder="City *"    value={form.city}   onChange={(e) => setForm({ ...form, city:   e.target.value })} className={fieldCls} />
                </div>
                <input required type="text" placeholder="House, Street, Postal Code *" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} className={fieldCls} />
              </div>

              {/* Payment options */}
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#1C1917]">
                <Banknote className="text-stone-400" /> Choose Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {/* Advance option */}
                <button
                  type="button"
                  onClick={() => setPaymentMode('advance')}
                  className={`p-5 rounded-2xl border-2 text-left flex flex-col gap-2 transition-all ${
                    paymentMode === 'advance'
                      ? 'border-amber-500 bg-amber-50 shadow-md'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#1C1917] flex items-center gap-1.5">
                      <Tag size={14} className="text-amber-500" /> Pay Advance
                    </span>
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Save {Math.round(ADVANCE_DISCOUNT_RATE * 100)}%
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">Get a 7% discount — pay via bank transfer & send proof on WhatsApp.</p>
                  {paymentMode === 'advance' && (
                    <p className="text-xs font-bold text-amber-700">
                      You save PKR {Math.round(product.discountedPrice * ADVANCE_DISCOUNT_RATE).toLocaleString()}!
                    </p>
                  )}
                </button>

                {/* COD option */}
                <button
                  type="button"
                  onClick={() => setPaymentMode('cod')}
                  className={`p-5 rounded-2xl border-2 text-left flex flex-col gap-2 transition-all ${
                    paymentMode === 'cod'
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#1C1917] flex items-center gap-1.5">
                      <Truck size={14} className="text-blue-500" /> Cash on Delivery
                    </span>
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      +PKR {COD_FEE}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">Pay when your order arrives. A PKR {COD_FEE} handling fee applies.</p>
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium flex items-center gap-2">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <button
                id="proceed-to-payment"
                onClick={handleProceedToPayment}
                disabled={isSubmitting}
                className="w-full bg-[#1C1917] text-white py-5 rounded-xl font-bold text-lg hover:bg-[#4A3728] transition-colors shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? 'Creating Order…' : 'Proceed to Payment →'}
              </button>
            </motion.div>
          )}

          {/* ── STEP 2a: Advance Payment — bank details + WhatsApp ── */}
          {step === 2 && paymentMode === 'advance' && (
            <motion.div key="step2a" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-200">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-amber-600" size={32} />
                </div>
                <h2 className="text-2xl font-serif font-bold mb-2 text-[#1C1917]">Bank Transfer</h2>
                <p className="text-stone-500">
                  Transfer <strong className="text-stone-900">PKR {createdOrder?.totalAmount?.toLocaleString()}</strong> to confirm your order.
                </p>
                <div className="mt-3 text-xs text-stone-400 bg-stone-100 py-1.5 px-4 rounded-full inline-block">
                  Order No: <strong className="text-stone-700">{createdOrder?.orderNumber}</strong>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-sm text-amber-800 flex items-center gap-3">
                <Tag size={16} className="shrink-0" />
                <span>7% advance discount applied — you saved <strong>PKR {createdOrder?.discountApplied?.toLocaleString()}</strong>!</span>
              </div>

              <div className="space-y-4 mb-8">
                <BankCard bank="Meezan Bank" holder="Khalid Mehmood" number="26760107034125" />
                <BankCard bank="Easypaisa / JazzCash" holder="Sajid Shokat" number="03084382626" />
              </div>

              <button
                id="complete-order-whatsapp"
                onClick={handleContinueWhatsApp}
                className="w-full bg-[#25D366] text-white py-5 rounded-xl font-bold text-lg hover:bg-[#1EBE5D] transition-colors shadow-[0_8px_25px_rgba(37,211,102,0.3)] flex items-center justify-center gap-2 mb-4"
              >
                <MessageCircle /> I Have Paid — Continue on WhatsApp
              </button>

              <TrackingBlock orderNumber={createdOrder?.orderNumber} onCopy={handleCopyTracking} copied={copied} />

              <button onClick={() => setStep(1)} className="w-full text-sm font-bold text-stone-400 hover:text-stone-600 py-3 transition-colors">
                ← Go Back
              </button>
            </motion.div>
          )}

          {/* ── STEP 2b: COD — success confirmation ── */}
          {step === 2 && paymentMode === 'cod' && (
            <motion.div key="step2b" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-200">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="text-emerald-600" size={36} />
                </div>
                <h2 className="text-2xl font-serif font-bold mb-2 text-[#1C1917]">Order Placed! 🎉</h2>
                <p className="text-stone-500">
                  Your Cash on Delivery order has been confirmed. We'll contact you soon.
                </p>
                <div className="mt-3 text-xs text-stone-400 bg-stone-100 py-1.5 px-4 rounded-full inline-block">
                  Order No: <strong className="text-stone-700">{createdOrder?.orderNumber}</strong>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 text-sm text-blue-800 flex items-center gap-3">
                <Truck size={16} className="shrink-0" />
                <span>Pay <strong>PKR {createdOrder?.totalAmount?.toLocaleString()}</strong> (includes PKR {COD_FEE} COD fee) when your package arrives.</span>
              </div>

              <TrackingBlock orderNumber={createdOrder?.orderNumber} onCopy={handleCopyTracking} copied={copied} />

              <Link href="/" className="w-full block text-center bg-[#1C1917] text-white py-4 rounded-xl font-bold hover:bg-[#4A3728] transition-colors mt-4">
                Continue Shopping
              </Link>
            </motion.div>
          )}
        </div>

        {/* ── RIGHT: Order summary ──────────────────────────────────────────── */}
        <div className="lg:col-span-5">
          <div className="bg-stone-100 p-8 rounded-[2rem] sticky top-24">
            <h3 className="font-serif font-bold text-xl mb-6 text-[#1C1917]">Order Summary</h3>

            <div className="flex gap-4 mb-6">
              <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0 shadow-sm">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1C1917]">{product.name}</h4>
                <p className="text-xs text-stone-500 mt-1">PKR {product.discountedPrice.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-stone-600 border-t border-stone-200 pt-6 mb-6">
              <SummaryRow label="Product" value={`PKR ${product.discountedPrice.toLocaleString()}`} />
              {paymentMode === 'advance' && discountApplied > 0 && (
                <SummaryRow
                  label={<span className="text-amber-700 font-semibold">7% Advance Discount</span>}
                  value={<span className="text-amber-700 font-semibold">− PKR {discountApplied.toLocaleString()}</span>}
                />
              )}
              <SummaryRow
                label={
                  <span>
                    Shipping{' '}
                    {isFreeShipping && (
                      <span className="text-emerald-600 font-bold text-[10px] ml-1 bg-emerald-100 px-2 py-0.5 rounded-full">FREE</span>
                    )}
                  </span>
                }
                value={`PKR ${shipping}`}
              />
              {paymentMode === 'cod' && (
                <SummaryRow
                  label={<span className="text-blue-700">COD Handling Fee</span>}
                  value={<span className="text-blue-700">+ PKR {COD_FEE}</span>}
                />
              )}
            </div>

            <div className="border-t border-stone-200 pt-6">
              <SummaryRow
                label={<span className="font-bold text-lg text-[#1C1917]">Total</span>}
                value={<span className="font-serif font-bold text-2xl text-[#4A3728]">PKR {total.toLocaleString()}</span>}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Helper components ──────────────────────────────────────────────────────────

const BankCard = ({ bank, holder, number }: { bank: string; holder: string; number: string }) => (
  <div className="p-5 border border-stone-200 rounded-2xl bg-stone-50">
    <div className="flex justify-between items-center mb-2">
      <span className="font-bold text-sm text-[#1C1917]">{bank}</span>
      <span className="text-[10px] uppercase font-bold text-stone-400">{holder}</span>
    </div>
    <code className="text-xl font-mono font-bold text-[#4A3728] tracking-widest">{number}</code>
  </div>
);

const SummaryRow = ({ label, value }: { label: React.ReactNode; value: React.ReactNode }) => (
  <div className="flex justify-between items-end">
    <span className="text-stone-600">{label}</span>
    <span className="font-semibold text-stone-800">{value}</span>
  </div>
);

const TrackingBlock = ({
  orderNumber,
  onCopy,
  copied,
}: {
  orderNumber?: string;
  onCopy: () => void;
  copied: boolean;
}) => {
  if (!orderNumber) return null;
  const trackUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/track?id=${orderNumber}`
    : `/track?id=${orderNumber}`;

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 mb-6">
      <p className="text-xs text-stone-500 font-semibold mb-2 uppercase tracking-wider">Your Tracking Link</p>
      <div className="flex items-center gap-2">
        <code className="flex-1 text-xs text-stone-700 bg-white border border-stone-200 rounded-lg px-3 py-2 overflow-hidden text-ellipsis whitespace-nowrap">
          {trackUrl}
        </code>
        <button
          onClick={onCopy}
          className="shrink-0 p-2 bg-white border border-stone-200 rounded-lg hover:bg-stone-100 transition-colors"
          title="Copy tracking link"
        >
          {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} className="text-stone-500" />}
        </button>
        <Link
          href={`/track?id=${orderNumber}`}
          className="shrink-0 p-2 bg-white border border-stone-200 rounded-lg hover:bg-stone-100 transition-colors"
          title="Open tracking page"
        >
          <ExternalLink size={14} className="text-stone-500" />
        </Link>
      </div>
    </div>
  );
};
