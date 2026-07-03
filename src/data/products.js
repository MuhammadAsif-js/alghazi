// ─────────────────────────────────────────────────────────────────────────────
// src/data/products.js
// HOW TO CHANGE PRODUCT IMAGES:
//
// OPTION A — Use your own photo files (RECOMMENDED):
//   1. Copy your product .jpg/.png photos into:
//      Al_ghazi/public/products/
//   2. Replace the image value below with: '/products/your-filename.jpg'
//   Example: image: '/products/desk-organizer.jpg',
//
// OPTION B — Use an online image link (e.g. from ImgBB.com or Google Drive):
//   1. Upload your photo to https://imgbb.com (free, instant)
//   2. Copy the "Direct link" (ends in .jpg or .png)
//   3. Paste it as the image value below
//   Example: image: 'https://i.ibb.co/abc123/my-product.jpg',
//
// HOW TO ADD A NEW PRODUCT: Copy any block below, change all 6 fields,
// and give it the next id number (7, 8, 9...).
// ─────────────────────────────────────────────────────────────────────────────

export const PRODUCTS = [
  {
    id: 1,
    name: 'Walnut Desk Organizer',
    originalPrice: 10500,
    discountedPrice: 8500,
    // ↓ CHANGE THIS — put your photo in public/products/ or use an online link
    image: 'https://images.pexels.com/photos/5490336/pexels-photo-5490336.jpeg?auto=compress&cs=tinysrgb&w=800',
    tag: 'Bestseller',
    desc: 'Solid walnut wood, hand-finished with natural oils.',
  },
  {
    id: 2,
    name: 'Premium End-Grain Chopping Block',
    originalPrice: 18000,
    discountedPrice: 14000,
    // ↓ CHANGE THIS
    image: 'https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=800',
    tag: 'Kitchen',
    desc: 'Professional grade end-grain oak, perfect for culinary experts.',
  },
  {
    id: 3,
    name: 'Minimalist Laptop Stand',
    originalPrice: 9500,
    discountedPrice: 7500,
    // ↓ CHANGE THIS
    image: 'https://images.pexels.com/photos/389818/pexels-photo-389818.jpeg?auto=compress&cs=tinysrgb&w=800',
    tag: 'Office',
    desc: 'Ergonomic elevation crafted from sustainable ash wood.',
  },
  {
    id: 4,
    name: 'Artisan Spice Rack',
    originalPrice: 12000,
    discountedPrice: 9500,
    // ↓ CHANGE THIS
    image: 'https://images.pexels.com/photos/3026804/pexels-photo-3026804.jpeg?auto=compress&cs=tinysrgb&w=800',
    tag: 'New Arrival',
    desc: 'Magnetic locking system for seamless kitchen organization.',
  },
  {
    id: 5,
    name: 'Wooden Catchall Tray',
    originalPrice: 5500,
    discountedPrice: 4500,
    // ↓ CHANGE THIS
    image: 'https://images.pexels.com/photos/6686455/pexels-photo-6686455.jpeg?auto=compress&cs=tinysrgb&w=800',
    tag: 'Everyday',
    desc: 'Sleek geometric design for keys, wallets, and EDC.',
  },
  {
    id: 6,
    name: 'Ergonomic Monitor Riser',
    originalPrice: 14000,
    discountedPrice: 11000,
    // ↓ CHANGE THIS
    image: 'https://images.pexels.com/photos/5095304/pexels-photo-5095304.jpeg?auto=compress&cs=tinysrgb&w=800',
    tag: 'Workspace',
    desc: 'Elevate your screen and organize your desk beautifully.',
  },
];
