import { prisma } from '../lib/prisma';
import HomeClientPage from './HomeClientPage';
import { PRODUCTS } from '../data/products';

export const revalidate = 60; // Revalidate every 60 seconds (ISR)

export default async function Home() {
  let products = [];
  let ordersCount = 0;

  try {
    // Fetch products from PostgreSQL database via Prisma
    products = await prisma.product.findMany({
      where: { isAvailable: true },
      orderBy: { createdAt: 'desc' },
    });
    ordersCount = await prisma.order.count();
  } catch (error) {
    console.warn('[Prisma] Database connection failed, falling back to mock product data.');
    // Use fallback mock products
    products = PRODUCTS.map((p: any) => ({
      id: p.id.toString(),
      name: p.name,
      originalPrice: p.originalPrice,
      discountedPrice: p.discountedPrice,
      image: p.image,
      tag: p.tag || '',
      description: p.desc,
    }));
    ordersCount = 12; // default fallback count
  }

  return (
    <HomeClientPage
      initialProducts={products.map((p: any) => ({
        id: p.id,
        name: p.name,
        originalPrice: p.originalPrice,
        discountedPrice: p.discountedPrice,
        image: p.image,
        tag: p.tag || '',
        desc: p.description || p.desc || '',
      }))}
      initialOrdersCount={ordersCount}
    />
  );
}
