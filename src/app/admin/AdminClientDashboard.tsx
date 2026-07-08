'use client';

import { useState, useEffect, useRef } from 'react';
import { signOut } from 'next-auth/react';
import {
  Shield, LogOut, Loader2, Check, X, RefreshCw,
  Search, Phone, Package, TrendingUp, Clock, Truck,
  CreditCard, Activity, Tag,
} from 'lucide-react';
import { updateOrderStatus, updatePaymentStatus } from '../actions/order';

type OrderStatus   = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
type PaymentStatus = 'UNPAID' | 'PARTIAL_ADVANCE' | 'FULL_ADVANCE' | 'PAID';
type PaymentMethod = 'ADVANCE' | 'COD';

interface Product  { id: string; name: string; image: string; }
interface OrderItem { id: string; productId: string; quantity: number; priceAtPurchase: number; product: Product; }

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  discountApplied: number;
  totalAmount: number;
  customerName: string;
  customerPhone: string;
  province: string; district: string; tehsil: string; city: string; addressLine: string;
  createdAt: Date;
  items: OrderItem[];
}

interface AdminClientDashboardProps { initialOrders: Order[]; }

const STATUS_BADGES: Record<string, string> = {
  PENDING:    'bg-amber-900/50 text-amber-400 border-amber-800',
  PROCESSING: 'bg-blue-900/50 text-blue-400 border-blue-800',
  SHIPPED:    'bg-purple-900/50 text-purple-400 border-purple-800',
  DELIVERED:  'bg-emerald-900/50 text-emerald-400 border-emerald-800',
  CANCELLED:  'bg-red-900/50 text-red-400 border-red-800',
};

const PAYMENT_STATUS_BADGES: Record<string, string> = {
  UNPAID:          'bg-red-900/40 text-red-400 border-red-800',
  PARTIAL_ADVANCE: 'bg-orange-900/40 text-orange-400 border-orange-800',
  FULL_ADVANCE:    'bg-emerald-900/40 text-emerald-400 border-emerald-800',
  PAID:            'bg-emerald-900/60 text-emerald-300 border-emerald-700',
};

const ALL_STATUSES: Array<OrderStatus | 'ALL'> = ['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminClientDashboard({ initialOrders }: AdminClientDashboardProps) {
  const [orders, setOrders]           = useState<Order[]>(initialOrders);
  const [updatingId, setUpdatingId]   = useState<string | null>(null);
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [liveCount, setLiveCount]     = useState<number>(initialOrders.length);
  const esRef = useRef<EventSource | null>(null);

  // ── SSE live counter ────────────────────────────────────────────────────
  useEffect(() => {
    esRef.current = new EventSource('/api/orders/count');
    esRef.current.onmessage = (e) => {
      try {
        const { count } = JSON.parse(e.data);
        setLiveCount(count);
      } catch {}
    };
    return () => { esRef.current?.close(); };
  }, []);

  // ── Update order status ─────────────────────────────────────────────────
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingId(orderId);
    const res = await updateOrderStatus(orderId, newStatus);
    setUpdatingId(null);
    if (res.success && res.order) {
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
    } else { alert('Failed to update status.'); }
  };

  // ── Update payment status ───────────────────────────────────────────────
  const handleUpdatePaymentStatus = async (orderId: string, newPaymentStatus: PaymentStatus) => {
    setUpdatingId(orderId);
    const res = await updatePaymentStatus(orderId, newPaymentStatus);
    setUpdatingId(null);
    if (res.success && res.order) {
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, paymentStatus: newPaymentStatus } : o));
    } else { alert('Failed to update payment status.'); }
  };

  // ── Stats ───────────────────────────────────────────────────────────────
  const totalRevenue  = orders.filter((o) => o.status !== 'CANCELLED').reduce((s, o) => s + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.status === 'PENDING').length;
  const shippedOrders = orders.filter((o) => o.status === 'SHIPPED').length;

  const filteredOrders = orders.filter((o) => {
    const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch = !q || o.orderNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.customerPhone.includes(q) || o.city.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen bg-stone-900 text-stone-300 p-6 font-mono selection:bg-emerald-500/30">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-stone-800 pb-6 gap-4">
          <div>
            <h1 className="text-3xl text-white font-bold tracking-tighter mb-2 flex items-center gap-3">
              <Shield className="text-emerald-500" /> OWNER DASHBOARD
            </h1>
            <p className="text-sm text-emerald-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Connection — {liveCount} total orders
            </p>
          </div>
          <button onClick={() => signOut({ callbackUrl: '/' })}
            className="bg-white text-black px-4 py-2.5 rounded font-bold text-xs hover:bg-stone-200 transition-colors flex items-center gap-2">
            <LogOut size={14} /> Exit System
          </button>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard icon={<Activity size={18} className="text-emerald-400" />} label="Live Total Orders" value={liveCount} valueClass="text-emerald-400" />
          <StatCard icon={<Clock size={18} className="text-amber-400" />} label="Pending Verification" value={pendingOrders} valueClass="text-amber-400" />
          <StatCard icon={<Truck size={18} className="text-purple-400" />} label="Shipped" value={shippedOrders} valueClass="text-purple-400" />
          <StatCard icon={<TrendingUp size={18} className="text-emerald-400" />} label="Revenue (Excl. Cancelled)" value={`PKR ${totalRevenue.toLocaleString()}`} valueClass="text-emerald-400" />
        </div>

        {/* ── Search & Filter ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order #, name, phone, city…"
              className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-9 pr-4 py-3 text-xs text-white placeholder-stone-600 outline-none focus:border-stone-600 transition-colors" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {ALL_STATUSES.map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  statusFilter === s ? 'bg-white text-black' : 'bg-stone-800 text-stone-400 hover:bg-stone-700'
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* ── Order List ── */}
        <div className="grid gap-4">
          {filteredOrders.length === 0 ? (
            <div className="p-10 border border-dashed border-stone-700 text-center text-stone-500 rounded-xl">
              {search || statusFilter !== 'ALL' ? 'No orders match your search/filter.' : 'No orders yet. Place a test order to get started.'}
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id}
                className="bg-stone-950 border border-stone-800 rounded-2xl p-5 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 hover:border-stone-700 transition-colors">

                {/* Order info */}
                <div className="flex-1 w-full">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="bg-stone-800 text-white px-2 py-1 rounded text-xs font-bold">{order.orderNumber}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${STATUS_BADGES[order.status] || STATUS_BADGES.PENDING}`}>
                      {order.status}
                    </span>
                    {/* Payment method badge */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                      order.paymentMethod === 'ADVANCE' ? 'bg-amber-900/40 text-amber-400 border-amber-800' : 'bg-blue-900/40 text-blue-400 border-blue-800'
                    }`}>
                      {order.paymentMethod === 'ADVANCE' ? <><Tag size={9} /> ADVANCE</> : <><Truck size={9} /> COD</>}
                    </span>
                    {/* Payment status badge */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${PAYMENT_STATUS_BADGES[order.paymentStatus] || PAYMENT_STATUS_BADGES.UNPAID}`}>
                      {order.paymentStatus.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] text-stone-600 ml-auto">
                      {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="text-base text-white font-bold mb-3">
                    {order.items[0]?.product.name || 'Artisan Craft'}
                    {order.items.length > 1 && <span className="text-stone-500 text-xs font-normal ml-2">+{order.items.length - 1} more</span>}
                  </h3>

                  <div className="text-xs grid sm:grid-cols-2 gap-1.5 text-stone-400">
                    <div>👤 {order.customerName}</div>
                    <div className="flex items-center gap-2">
                      <Phone size={10} className="text-stone-500 shrink-0" />
                      <a href={`tel:${order.customerPhone}`} className="hover:text-white transition-colors underline underline-offset-2">{order.customerPhone}</a>
                      <a href={`https://wa.me/92${order.customerPhone.replace(/^0/, '')}`} target="_blank" rel="noopener noreferrer"
                        className="text-emerald-600 hover:text-emerald-400 text-[10px] font-bold transition-colors">WA</a>
                    </div>
                    <div className="sm:col-span-2 text-stone-500">📍 {order.addressLine}, {order.city}, {order.district}, {order.province}</div>
                  </div>
                </div>

                {/* Actions panel */}
                <div className="w-full lg:w-auto shrink-0 bg-stone-900 p-4 rounded-xl border border-stone-800 min-w-[220px]">
                  <div className="text-[10px] text-stone-500 mb-1">Total Value</div>
                  <div className="text-xl text-white font-bold mb-1">PKR {order.totalAmount.toLocaleString()}</div>
                  {order.discountApplied > 0 && (
                    <div className="text-[10px] text-amber-500 mb-3">
                      Saved PKR {order.discountApplied.toLocaleString()} (advance)
                    </div>
                  )}

                  {updatingId === order.id ? (
                    <div className="flex items-center gap-2 text-stone-500 text-xs"><Loader2 className="animate-spin" size={14} /> Updating…</div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {/* ── Payment status controls (ADVANCE orders only) ── */}
                      {order.paymentMethod === 'ADVANCE' && order.status === 'PENDING' && (
                        <div className="border-t border-stone-800 pt-3 mt-1 space-y-1.5">
                          <div className="text-[9px] text-stone-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                            <CreditCard size={8} /> Payment Verification
                          </div>
                          {order.paymentStatus === 'UNPAID' && (
                            <button onClick={() => handleUpdatePaymentStatus(order.id, 'PARTIAL_ADVANCE')}
                              className="w-full bg-orange-900/50 hover:bg-orange-900 text-orange-300 border border-orange-800 px-3 py-1.5 rounded text-xs font-bold transition-colors">
                              Mark: Partial Advance Received
                            </button>
                          )}
                          {(order.paymentStatus === 'UNPAID' || order.paymentStatus === 'PARTIAL_ADVANCE') && (
                            <button onClick={() => handleUpdatePaymentStatus(order.id, 'FULL_ADVANCE')}
                              className="w-full bg-emerald-900/50 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 px-3 py-1.5 rounded text-xs font-bold transition-colors">
                              Mark: Full Advance Received
                            </button>
                          )}
                          {order.paymentStatus === 'FULL_ADVANCE' && (
                            <button onClick={() => handleUpdateStatus(order.id, 'PROCESSING')}
                              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center justify-center gap-1">
                              <Check size={12} /> Confirm Order (Processing)
                            </button>
                          )}
                        </div>
                      )}

                      {/* ── COD order confirm ── */}
                      {order.paymentMethod === 'COD' && order.status === 'PENDING' && (
                        <div className="border-t border-stone-800 pt-3 mt-1 space-y-1.5">
                          <div className="text-[9px] text-stone-600 uppercase tracking-wider mb-1">COD Order</div>
                          <button onClick={() => handleUpdateStatus(order.id, 'PROCESSING')}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center justify-center gap-1">
                            <Check size={12} /> Confirm Order
                          </button>
                        </div>
                      )}

                      {/* ── Ship / Deliver / Cancel / Revert ── */}
                      <div className="flex flex-wrap gap-2 mt-1">
                        {order.status === 'PENDING' && (
                          <button onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}
                            className="bg-red-900/50 hover:bg-red-900 text-red-400 border border-red-800 px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1">
                            <X size={12} /> Cancel
                          </button>
                        )}
                        {order.status === 'PROCESSING' && (
                          <button onClick={() => handleUpdateStatus(order.id, 'SHIPPED')}
                            className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1">
                            <Truck size={12} /> Mark Shipped
                          </button>
                        )}
                        {order.status === 'SHIPPED' && (
                          <button onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1">
                            <Check size={12} /> Mark Delivered
                          </button>
                        )}
                        {(order.status === 'DELIVERED' || order.status === 'CANCELLED') && (
                          <button onClick={() => handleUpdateStatus(order.id, 'PENDING')}
                            className="text-xs text-stone-500 hover:text-white underline transition-colors flex items-center gap-1">
                            <RefreshCw size={10} /> Revert to Pending
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <p className="text-center text-stone-700 text-[10px] mt-10 font-mono">
          AL GHAZI WOOD CRAFTS — INTERNAL SYSTEM v3.0 — {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, valueClass }: { icon: React.ReactNode; label: string; value: string | number; valueClass: string }) {
  return (
    <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-[9px] uppercase font-bold text-stone-500 tracking-wider leading-tight">{label}</span>
      </div>
      <div className={`text-2xl font-bold ${valueClass}`}>{value}</div>
    </div>
  );
}
