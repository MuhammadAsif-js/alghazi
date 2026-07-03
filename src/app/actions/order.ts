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
  paymentMode: z.enum(['advance', 'full']),
});

type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

// OrderStatus defined locally so this compiles before `prisma generate` runs
type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

// ─── Create Order ─────────────────────────────────────────────────────────────

export async function createOrder(input: CreateOrderInput) {
  // 1. Validate input with Zod
  const parsed = CreateOrderSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0];
    return { success: false, error: firstError?.message || 'Invalid form data.' };
  }
  const data = parsed.data;

  try {
    // 2. Fetch product to verify pricing securely on server
    const product = await prisma.product.findUnique({
      where: { id: data.productId },
    });

    if (!product) {
      return { success: false, error: 'Product not found or no longer available.' };
    }

    if (!product.isAvailable) {
      return { success: false, error: 'Sorry, this product is currently out of stock.' };
    }

    // 3. Perform pricing business calculations on server (never trust client)
    const shipping = calcShipping(data.province, data.paymentMode, product.discountedPrice);
    const { total, advance, cod } = calcBreakdown(product.discountedPrice, shipping, data.paymentMode);

    // 4. Generate unique order number (verify uniqueness in DB)
    let orderNumber = generateOrderId();
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 5) {
      const existing = await prisma.order.findUnique({ where: { orderNumber } });
      if (!existing) {
        isUnique = true;
      } else {
        orderNumber = generateOrderId();
        attempts++;
      }
    }
    if (!isUnique) {
      return { success: false, error: 'Could not generate a unique order number. Please try again.' };
    }

    // 5. Create Order and OrderItems inside a transaction (atomic)
    const order = await prisma.$transaction(async (tx: any) => {
      return tx.order.create({
        data: {
          orderNumber,
          customerName:  data.customerName.trim(),
          customerPhone: data.customerPhone.trim(),
          province:      data.province,
          district:      data.district,
          tehsil:        data.tehsil,
          city:          data.city,
          addressLine:   data.addressLine.trim(),
          totalAmount:   total,
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
        id:            order.id,
        orderNumber:   order.orderNumber,
        totalAmount:   order.totalAmount,
        advanceToPay:  advance,
        codRemaining:  cod,
        customerName:  order.customerName,
      },
    };
  } catch (error: any) {
    console.error('[createOrder] Error:', error);
    return {
      success: false,
      error: 'Something went wrong placing your order. Please try again.',
    };
  }
}

// ─── Track Order ──────────────────────────────────────────────────────────────

export async function trackOrder(orderNumber: string) {
  if (!orderNumber?.trim()) {
    return { success: false, error: 'Please enter an order number.' };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: orderNumber.toUpperCase().trim() },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      return {
        success: false,
        error: `Order "${orderNumber.toUpperCase().trim()}" not found. Double-check the order number and try again.`,
      };
    }

    return {
      success: true,
      order: {
        orderNumber:  order.orderNumber,
        status:       order.status,
        itemName:     order.items[0]?.product.name || 'Artisan Craft',
        totalAmount:  order.totalAmount,
        createdAt:    order.createdAt.toISOString(),
        customerName: order.customerName,
        city:         order.city,
        province:     order.province,
      },
    };
  } catch (error: any) {
    console.error('[trackOrder] Error:', error);
    return { success: false, error: 'Could not track your order right now. Please try again shortly.' };
  }
}

// ─── Update Order Status (Admin) ──────────────────────────────────────────────

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  if (!orderId) {
    return { success: false, error: 'Order ID is required.' };
  }

  const validStatuses: OrderStatus[] = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  if (!validStatuses.includes(status)) {
    return { success: false, error: 'Invalid status value.' };
  }

  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data:  { status },
    });
    return { success: true, order };
  } catch (error: any) {
    console.error('[updateOrderStatus] Error:', error);
    return { success: false, error: 'Failed to update order status. Please try again.' };
  }
}

// ─── Get All Orders (Admin) ───────────────────────────────────────────────────

export async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, orders };
  } catch (error: any) {
    console.error('[getOrders] Error:', error);
    return { success: false, orders: [], error: 'Failed to fetch orders.' };
  }
}
