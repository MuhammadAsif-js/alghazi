'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft, MapPin, Banknote, AlertCircle, Shield, MessageCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { LOCATION_DATA } from '../../../data/locations';
import { calcShipping, calcBreakdown } from '../../../utils/pricing';
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

interface CheckoutClientPageProps {
  product: Product;
}

// ── Sub-component: cascading location selects ──────────────────────────────
const LocationSelects = ({ form, onLocation }: { form: any; onLocation: (level: string, val: string) => void }) => {
  const provinces = Object.keys(LOCATION_DATA);
  // @ts-ignore
  const districts = form.province ? Object.keys(LOCATION_DATA[form.province] || {}) : [];
  // @ts-ignore
  const tehsils = form.district ? Object.keys(LOCATION_DATA[form.province]?.[form.district] || {}) : [];
  // @ts-ignore
  const cities = form.tehsil ? LOCATION_DATA[form.province]?.[form.district]?.[form.tehsil] ?? [] : [];

  const cls = 'w-full p-4 rounded-xl bg-stone-50 border border-stone-200 focus:border-[#4A3728] outline-none disabled:opacity-50 text-sm text-[#1C1917]';

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <select className={cls} value={form.province} onChange={(e) => onLocation('province', e.target.value)}>
          <option value="">Select Province…</option>
          {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select className={cls} value={form.district} disabled={!form.province} onChange={(e) => onLocation('district', e.target.value)}>
          <option value="">Select District…</option>
          {districts.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <select className={cls} value={form.tehsil} disabled={!form.district} onChange={(e) => onLocation('tehsil', e.target.value)}>
          <option value="">Select Tehsil…</option>
          {tehsils.map((t: any) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className={cls} value={form.city} disabled={!form.tehsil} onChange={(e) => onLocation('city', e.target.value)}>
          <option value="">Select City / Town…</option>
          {cities.map((c: any) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
    </>
  );
};

export default function CheckoutClientPage({ product }: CheckoutClientPageProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [paymentMode, setPaymentMode] = useState<'advance' | 'full'>('advance');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderData, setCreatedOrderData] = useState<any>(null);

  const [form, setForm] = useState({
    name: '', phone: '', province: '', district: '', tehsil: '', city: '', street: '',
  });

  // ── Derived pricing ────────────────────────────────────────────────────────
  const shipping = calcShipping(form.province, paymentMode, product.discountedPrice);
  const { total, advance, cod } = calcBreakdown(product.discountedPrice, shipping, paymentMode);
  const isFreeShipping = shipping === 0;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleLocation = (level: string, val: string) => {
    setForm((prev) => {
      const next = { ...prev, [level]: val };
      if (level === 'province') { next.district = ''; next.tehsil = ''; next.city = ''; }
      if (level === 'district') { next.tehsil = ''; next.city = ''; }
      if (level === 'tehsil') { next.city = ''; }
      return next;
    });
  };

  const handleProceedToPayment = async () => {
    if (!form.name.trim() || !form.phone.trim() || !form.province || !form.district || !form.tehsil || !form.city || !form.street.trim()) {
      setError('Please complete all shipping details before proceeding.');
      return;
    }

    // Basic phone validation client-side
    if (!/^0?3[0-9]{9}$/.test(form.phone.replace(/\s+/g, ''))) {
      setError('Please enter a valid Pakistani phone number (e.g. 03001234567).');
      return;
    }

    setError('');
    setIsSubmitting(true);

    // Call Server Action to create order in DB
    const res = await createOrder({
      productId:     product.id,
      customerName:  form.name,
      customerPhone: form.phone,
      province:      form.province,
      district:      form.district,
      tehsil:        form.tehsil,
      city:          form.city,
      addressLine:   form.street,
      paymentMode,
    });

    setIsSubmitting(false);

    if (res.success && res.order) {
      setCreatedOrderData(res.order);
      setStep(2);
    } else {
      setError(res.error || 'Failed to place order. Please try again or contact us on WhatsApp.');
    }
  };

  const handleCompleteOrderWhatsApp = () => {
    const orderNum = createdOrderData?.orderNumber ?? 'PENDING';
    const advanceAmt = createdOrderData?.advanceToPay ?? advance;
    const totalAmt = createdOrderData?.totalAmount ?? total;

    // Pre-filled WhatsApp message with full order details
    const message = [
      `Assalam-o-Alaikum, I have placed an order on AL GHAZI WOOD CRAFTS.`,
      ``,
      `📦 Order Number: ${orderNum}`,
      `🛍️ Item: ${product.name}`,
      `💰 Total: PKR ${totalAmt.toLocaleString()}`,
      `💳 Advance Paid: PKR ${advanceAmt.toLocaleString()}`,
      ``,
      `📍 Delivery: ${form.street}, ${form.city}, ${form.district}, ${form.province}`,
      `👤 Name: ${form.name}`,
      `📱 Phone: ${form.phone}`,
      ``,
      `I have transferred the advance payment. Please find the receipt screenshot attached.`,
    ].join('\n');

    window.open(`https://wa.me/923084382626?text=${encodeURIComponent(message)}`, '_blank');

    // Redirect to tracking page with order number
    if (createdOrderData?.orderNumber) {
      router.push(`/track?id=${createdOrderData.orderNumber}`);
    }
  };


  const fieldCls = 'w-full p-4 rounded-xl bg-stone-50 border border-stone-200 focus:border-[#4A3728] outline-none text-[#1C1917] placeholder-stone-400 text-sm';

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-stone-200 py-4 px-6 flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <Link
          href="/"
          className="flex items-center gap-2 text-stone-500 hover:text-stone-900 font-medium text-sm transition-colors"
        >
          <ChevronLeft size={16} /> Back to Store
        </Link>
        <span className="font-serif font-bold text-xl tracking-tighter">AL GHAZI</span>
        <div className="w-16" />
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full grid lg:grid-cols-12 gap-8 p-6 lg:p-12">
        {/* ── LEFT: form ──────────────────────────────────────────────────── */}
        <div className="lg:col-span-7">
          <h1 className="text-3xl font-serif font-bold mb-8 text-[#1C1917]">Secure Checkout</h1>

          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-200"
            >
              {/* Shipping details */}
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-[#1C1917]">
                <MapPin className="text-stone-400" /> Shipping Details
              </h2>
              <div className="space-y-4 mb-8">
                <input type="text" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={fieldCls} />
                <input type="tel" placeholder="Phone Number (WhatsApp)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={fieldCls} />
                <LocationSelects form={form} onLocation={handleLocation} />
                <input type="text" placeholder="House, Street details…" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} className={fieldCls} />
              </div>

              {/* Payment option */}
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-[#1C1917]">
                <Banknote className="text-stone-400" /> Payment Option
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <PaymentOption
                  active={paymentMode === 'advance'}
                  onClick={() => setPaymentMode('advance')}
                  title="25% Advance"
                  sub="Pay remaining on Delivery"
                  activeClass="border-[#4A3728] bg-amber-50"
                />
                <PaymentOption
                  active={paymentMode === 'full'}
                  onClick={() => setPaymentMode('full')}
                  title="100% Full Payment"
                  sub="Free Delivery (Punjab)"
                  activeClass="border-emerald-600 bg-emerald-50"
                />
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
                {isSubmitting ? 'Creating Order...' : 'Proceed to Payment'}
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-[2rem] shadow-sm border border-stone-200"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-emerald-600" size={32} />
                </div>
                <h2 className="text-2xl font-serif font-bold mb-2 text-[#1C1917]">Secure Transfer</h2>
                <p className="text-stone-500">
                  Transfer <strong className="text-stone-900">PKR {createdOrderData?.advanceToPay}</strong> to confirm your order.
                </p>
                <div className="mt-2 text-xs text-stone-400 bg-stone-100 py-1.5 px-3 rounded-full inline-block">
                  Order Number: <strong className="text-stone-600">{createdOrderData?.orderNumber}</strong>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <BankCard bank="Meezan Bank" holder="Khalid Mehmood" number="26760107034125" />
                <BankCard bank="Easypaisa" holder="Sajid Shokat" number="03084382626" />
              </div>

              <button
                id="complete-order"
                onClick={handleCompleteOrderWhatsApp}
                className="w-full bg-[#25D366] text-white py-5 rounded-xl font-bold text-lg hover:bg-[#1EBE5D] transition-colors shadow-[0_8px_25px_rgba(37,211,102,0.3)] flex items-center justify-center gap-2 mb-4"
              >
                <MessageCircle /> I Have Paid — Complete Order
              </button>
              <button
                onClick={() => setStep(1)}
                className="w-full text-sm font-bold text-stone-400 hover:text-stone-600 py-3"
              >
                Go Back
              </button>
            </motion.div>
          )}
        </div>

        {/* ── RIGHT: order summary ─────────────────────────────────────────── */}
        <div className="lg:col-span-5">
          <div className="bg-stone-100 p-8 rounded-[2rem] sticky top-24">
            <h3 className="font-serif font-bold text-xl mb-6 text-[#1C1917]">Order Summary</h3>

            <div className="flex gap-4 mb-6">
              <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1C1917]">{product.name}</h4>
                <p className="text-xs text-stone-500 mt-1">PKR {product.discountedPrice.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-stone-600 border-t border-stone-200 pt-6 mb-6">
              <SummaryRow label="Subtotal" value={`PKR ${product.discountedPrice.toLocaleString()}`} />
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
            </div>

            <div className="border-t border-stone-200 pt-6">
              <SummaryRow
                label={<span className="font-bold text-lg text-[#1C1917]">Total</span>}
                value={<span className="font-serif font-bold text-2xl text-[#4A3728]">PKR {total.toLocaleString()}</span>}
              />

              {paymentMode === 'advance' && (
                <div className="bg-amber-100/50 p-4 rounded-xl mt-4 border border-amber-200/50">
                  <div className="flex justify-between text-sm font-bold text-amber-900 mb-1">
                    <span>Advance to Pay Now:</span>
                    <span>PKR {advance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-amber-700">
                    <span>Cash on Delivery:</span>
                    <span>PKR {cod.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Helper micro-components ─────────────────────────────────────────────────
const PaymentOption = ({ active, onClick, title, sub, activeClass }: { active: boolean; onClick: () => void; title: string; sub: string; activeClass: string }) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-4 rounded-xl border-2 text-left flex flex-col transition-all w-full ${active ? activeClass : 'border-stone-100 hover:border-stone-300'}`}
  >
    <span className="font-bold text-sm text-[#1C1917]">{title}</span>
    <span className="text-[10px] text-stone-500">{sub}</span>
  </button>
);

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
