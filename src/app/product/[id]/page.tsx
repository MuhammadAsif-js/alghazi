import { prisma } from '../../../lib/prisma';
import ProductDetailClient from './ProductDetailClient';
import { notFound } from 'next/navigation';
import { PRODUCTS } from '../../../data/products';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ProductPageProps) {
  return {
    title: 'Product Details',
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  let product = null;

  // 1. Try fetching from database
  try {
    product = await prisma.product.findUnique({
      where: { id: params.id },
    });
  } catch {
    // DB offline — fall through to mock data
  }

  // 2. Fallback: find in local PRODUCTS mock data
  if (!product) {
    const mock = (PRODUCTS as any[]).find(
      (p) =>
        p.id.toString() === params.id ||
        p.name.toLowerCase().replace(/\s+/g, '-') === params.id
    );
    if (mock) {
      product = {
        id:              mock.id.toString(),
        name:            mock.name,
        originalPrice:   mock.originalPrice,
        discountedPrice: mock.discountedPrice,
        image:           mock.image,
        tag:             mock.tag ?? '',
        description:     mock.desc,
        isAvailable:     true,
      };
    }
  }

  if (!product) {
    return notFound();
  }

  return (
    <ProductDetailClient
      product={{
        id:              product.id,
        name:            product.name,
        originalPrice:   product.originalPrice,
        discountedPrice: product.discountedPrice,
        image:           product.image,
        tag:             (product.tag as string) ?? '',
        desc:            (product as any).description ?? '',
      }}
    />
  );
}
