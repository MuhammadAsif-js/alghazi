const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PRODUCTS = [
  {
    name: 'Walnut Desk Organizer',
    originalPrice: 10500,
    discountedPrice: 8500,
    image: 'https://images.pexels.com/photos/5490336/pexels-photo-5490336.jpeg?auto=compress&cs=tinysrgb&w=800',
    tag: 'Bestseller',
    description: 'Solid walnut wood, hand-finished with natural oils.',
  },
  {
    name: 'Premium End-Grain Chopping Block',
    originalPrice: 18000,
    discountedPrice: 14000,
    image: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=800',
    tag: 'Kitchen',
    description: 'Professional grade end-grain oak, perfect for culinary experts.',
  },
  {
    name: 'Minimalist Laptop Stand',
    originalPrice: 9500,
    discountedPrice: 7500,
    image: 'https://images.pexels.com/photos/389818/pexels-photo-389818.jpeg?auto=compress&cs=tinysrgb&w=800',
    tag: 'Office',
    description: 'Ergonomic elevation crafted from sustainable ash wood.',
  },
  {
    name: 'Artisan Spice Rack',
    originalPrice: 12000,
    discountedPrice: 9500,
    image: 'https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg?auto=compress&cs=tinysrgb&w=800',
    tag: 'New Arrival',
    description: 'Magnetic locking system for seamless kitchen organization.',
  },
  {
    name: 'Wooden Catchall Tray',
    originalPrice: 5500,
    discountedPrice: 4500,
    image: 'https://images.pexels.com/photos/6686455/pexels-photo-6686455.jpeg?auto=compress&cs=tinysrgb&w=800',
    tag: 'Everyday',
    description: 'Sleek geometric design for keys, wallets, and EDC.',
  },
  {
    name: 'Ergonomic Monitor Riser',
    originalPrice: 14000,
    discountedPrice: 11000,
    image: 'https://images.pexels.com/photos/5095304/pexels-photo-5095304.jpeg?auto=compress&cs=tinysrgb&w=800',
    tag: 'Workspace',
    description: 'Elevate your screen and organize your desk beautifully.',
  },
];

async function main() {
  console.log('Seeding products...');
  for (const product of PRODUCTS) {
    await prisma.product.upsert({
      where: { id: product.name.toLowerCase().replace(/\s+/g, '-') }, // Using a slug as temporary id for tracking stability
      update: {},
      create: {
        id: product.name.toLowerCase().replace(/\s+/g, '-'),
        name: product.name,
        originalPrice: product.originalPrice,
        discountedPrice: product.discountedPrice,
        image: product.image,
        tag: product.tag,
        description: product.description,
      },
    });
  }
  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
