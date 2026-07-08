'use server';

import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { calcShipping, calcBreakdown, generateOrderId } from '../../utils/pricing';

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

const pakistaniPhoneRegex = /^(\+92|0092|0)?[3][0-9]{9}$/;

const CreateOrderSchema = z.object({
  productId:     z.string().min(1, 'Product ID is required'),
  customerName:  z.string().min(2, 'Name must be at least 2 characters').max(100),
  customerPhone: z
    .string()
    .regex(pakistaniPhoneRegex, 'Please enter a valid Pakistani phone number (e.g. 03001234567)'),
  province:    z.string().min(1, 'Province is required'),
  district:    z.string().min(1, 'District is required'),
  tehsil:      z.string().min(1, 'Tehsil is required'),
  city:        z.string().min(1, 'City is required'),
  addressLine: z.string().min(5, 'Please enter a valid address').max(500),
  paymentMode: z.enum(['advance', 'cod']),
});

type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

type OrderStatus    = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
type PaymentStatus  = 'UNPAID' | 'PARTIAL_ADVANCE' | 'FULL_ADVANCE' | 'PAID';
type PaymentMethod  = 'ADVANCE' | 'COD';

// ─── Create Order ─────────────────────────────────────────────────────────────

export async function createOrder(input: CreateOrderInput) {
  const parsed = CreateOrderSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { success: false, error: firstError?.message || 'Invalid form data.' };
  }
  const data = parsed.data;

  try {
    // Fetch product price from DB (server-side pricing — never trust client)
    const product = await prisma.product.findUnique({ where: { id: data.productId } });

    if (!product) return { success: false, error: 'Product not found or no longer available.' };
    if (!product.isAvailable) return { success: false, error: 'Sorry, this product is currently out of stock.' };

    const shipping = calcShipping(data.province, data.paymentMode, product.discountedPrice);
    const { discountApplied, total } = calcBreakdown(product.discountedPrice, shipping, data.paymentMode);

    // Generate unique order number
    let orderNumber = generateOrderId();
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 5) {
      const existing = await prisma.order.findUnique({ where: { orderNumber } });
      if (!existing) { isUnique = true; } else { orderNumber = generateOrderId(); attempts++; }
    }
    if (!isUnique) return { success: false, error: 'Could not generate a unique order number. Please try again.' };

    const paymentMethodEnum: PaymentMethod = data.paymentMode === 'advance' ? 'ADVANCE' : 'COD';

    const order = await prisma.$transaction(async (tx: any) => {
      return tx.order.create({
        data: {
          orderNumber,
          customerName:   data.customerName.trim(),
          customerPhone:  data.customerPhone.trim(),
          province:       data.province,
          district:       data.district,
          tehsil:         data.tehsil,
          city:           data.city,
          addressLine:    data.addressLine.trim(),
          totalAmount:    total,
          discountApplied,
          paymentMethod:  paymentMethodEnum,
          paymentStatus:  'UNPAID',
          items: {
            create: {
              productId:       product.id,
              quantity:        1,
              priceAtPurchase: product.discountedPrice,
            },
          },
        },
      });
    });

    return {
      success: true,
      order: {
        id:              order.id,
        orderNumber:     order.orderNumber,
        totalAmount:     order.totalAmount,
        discountApplied: order.discountApplied,
        paymentMethod:   order.paymentMethod,
        customerName:    order.customerName,
      },
    };
  } catch (error: any) {
    // ────────────────────────────────────────────────────────────────────────
    // CHECKOUT DEBUG — full raw error always printed here in the terminal
    // ────────────────────────────────────────────────────────────────────────
    console.error('\n╔══════════════════════════════════════╗');
    console.error('║     [CHECKOUT DEBUG] ORDER FAILED    ║');
    console.error('╚══════════════════════════════════════╝');
    console.error('[CHECKOUT DEBUG] error.name    :', error?.name);
    console.error('[CHECKOUT DEBUG] error.code    :', error?.code);
    console.error('[CHECKOUT DEBUG] error.message :', error?.message);
    console.error('[CHECKOUT DEBUG] error.meta    :', JSON.stringify(error?.meta ?? null, null, 2));
    console.error('[CHECKOUT DEBUG] error.stack   :', error?.stack);
    console.error('[CHECKOUT DEBUG] full object   :', error);
    console.error('══════════════════════════════════════════\n');

    if (error?.code === 'P2002') {
      return { success: false, error: 'Order number conflict. Please try again.' };
    }
    if (error?.code === 'P2003') {
      return { success: false, error: 'Product reference invalid. Please refresh and try again.' };
    }
    if (error?.message?.includes('column') || error?.message?.includes('does not exist')) {
      return { success: false, error: 'Database schema mismatch — run the migration in supabase/schema.sql.' };
    }
    if (error?.message?.includes('connect') || error?.message?.includes('ENOTFOUND') || error?.message?.includes('reach')) {
      return { success: false, error: `[DB OFFLINE] Raw error: ${error?.message}` };
    }

    return { success: false, error: `Order failed [${error?.code ?? 'unknown'}]: ${error?.message ?? 'See terminal logs.'}` };
  }
}

// ─── Track Order ──────────────────────────────────────────────────────────────

export async function trackOrder(orderNumber: string) {
  if (!orderNumber?.trim()) return { success: false, error: 'Please enter an order number.' };

  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: orderNumber.toUpperCase().trim() },
      include: { items: { include: { product: true } } },
    });

    if (!order) {
      return {
        success: false,
        error: `Order "${orderNumber.toUpperCase().trim()}" not found. Double-check and try again.`,
      };
    }

    return {
      success: true,
      order: {
        orderNumber:    order.orderNumber,
        status:         order.status,
        paymentMethod:  order.paymentMethod,
        paymentStatus:  order.paymentStatus,
        itemName:       order.items[0]?.product.name || 'Artisan Craft',
        totalAmount:    order.totalAmount,
        discountApplied: order.discountApplied,
        createdAt:      order.createdAt.toISOString(),
        customerName:   order.customerName,
        city:           order.city,
        province:       order.province,
      },
    };
  } catch (error: any) {
    console.error('[trackOrder] Error:', error);
    return { success: false, error: 'Could not track your order right now. Please try again shortly.' };
  }
}

// ─── Update Order Status (Admin) ──────────────────────────────────────────────

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  if (!orderId) return { success: false, error: 'Order ID is required.' };
  const validStatuses: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  if (!validStatuses.includes(status)) return { success: false, error: 'Invalid status value.' };

  try {
    const order = await prisma.order.update({ where: { id: orderId }, data: { status } });
    return { success: true, order };
  } catch (error: any) {
    console.error('[updateOrderStatus] Error:', error);
    return { success: false, error: 'Failed to update order status. Please try again.' };
  }
}

// ─── Update Payment Status (Admin) ───────────────────────────────────────────

export async function updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus) {
  if (!orderId) return { success: false, error: 'Order ID is required.' };
  const validStatuses: PaymentStatus[] = ['UNPAID', 'PARTIAL_ADVANCE', 'FULL_ADVANCE', 'PAID'];
  if (!validStatuses.includes(paymentStatus)) return { success: false, error: 'Invalid payment status.' };

  try {
    const order = await prisma.order.update({ where: { id: orderId }, data: { paymentStatus } });
    return { success: true, order };
  } catch (error: any) {
    console.error('[updatePaymentStatus] Error:', error);
    return { success: false, error: 'Failed to update payment status. Please try again.' };
  }
}

// ─── Get All Orders (Admin) ───────────────────────────────────────────────────

export async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, orders };
  } catch (error: any) {
    console.error('[getOrders] Error:', error);
    return { success: false, orders: [], error: 'Failed to fetch orders.' };
  }
}

// ─── Get Order Count (for SSE live counter) ───────────────────────────────────

export async function getOrderCount(): Promise<number> {
  try {
    return await prisma.order.count();
  } catch {
    return 0;
  }
}
