const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const PRODUCTS = [
  {
    id: 'quran-stand',
    name: 'Quran Stand',
    originalPrice: 3000,
    discountedPrice: 2500,
    image: 'https://www.dropbox.com/scl/fi/lcv2ys91jfqs8hw8prr6e/Gemini_Generated_Image_1ms2ic1ms2ic1ms2.png?rlkey=yh6o31bhjt5atx8y2agw9ityb&st=pzxrrsbi&raw=1',
    tag: 'Bestseller',
    description: 'Beautifully handcrafted solid wood Quran stand. Perfect gift for every home.',
  },
  {
    id: 'lemon-juice-extractor',
    name: 'Lemon Juice Extractor',
    originalPrice: 450,
    discountedPrice: 300,
    image: 'https://www.dropbox.com/scl/fi/yoxqv7miziolt21yfa6ga/Gemini_Generated_Image_2pr5mt2pr5mt2pr5.png?rlkey=2mh5udwqfjyyrfs67n79iwmnw&st=ah55bggs&raw=1',
    tag: 'Kitchen',
    description: 'Solid wood lemon juice extractor. Natural, chemical-free, and easy to use.',
  },
  {
    id: 'chopping-board',
    name: 'Chopping Board',
    originalPrice: 1200,
    discountedPrice: 500,
    image: 'https://www.dropbox.com/scl/fi/z3ooayovai58hc7en0qeq/Gemini_Generated_Image_4msnhy4msnhy4msn.png?rlkey=ufcl5wbqvzmy6mz770l52jzt7&st=wetnxbgk&raw=1',
    tag: 'Kitchen',
    description: 'Premium solid wood chopping board. Available in Small (Rs.500), Medium (Rs.800), Large (Rs.1000).',
  },
  {
    id: 'allah-muhammad-name',
    name: 'Allah Muhammad Name Plate',
    originalPrice: 900,
    discountedPrice: 600,
    image: 'https://www.dropbox.com/scl/fi/cwxznlgj9520rlcx7v0wb/Gemini_Generated_Image_d9qw9bd9qw9bd9qw.png?rlkey=u7b9xmoglqe8cv3br5ms8mqb9&st=acn70tl0&raw=1',
    tag: 'Home Decor',
    description: 'Elegant handcrafted wooden name plate with Allah & Muhammad (PBUH) calligraphy.',
  },
  {
    id: 'roti-maker',
    name: 'Roti Maker (Chakla Velna)',
    originalPrice: 2500,
    discountedPrice: 1800,
    image: 'https://www.dropbox.com/scl/fi/5kcdllrcpca81iqkxynvf/Gemini_Generated_Image_hb6gzvhb6gzvhb6g.png?rlkey=fqglnt03cduu2atdjcelmomvl&st=k24ehqej&raw=1',
    tag: 'Kitchen',
    description: 'Traditional wooden Chakla Velna set. Durable, smooth surface for perfect rotis.',
  },
  {
    id: 'glass-stand',
    name: 'Glass Stand',
    originalPrice: 800,
    discountedPrice: 600,
    image: 'https://www.dropbox.com/scl/fi/26ej5ygxwcprd5co8sxin/Gemini_Generated_Image_j8c1vsj8c1vsj8c1.png?rlkey=5cxaci2jqypl7c1yz03kw6c9b&st=3glmylb3&raw=1',
    tag: 'New Arrival',
    description: 'Handcrafted wooden glass stand. Elegant addition to your dining table.',
  },
  {
    id: 'pencil-marker-keeper',
    name: 'Pencil & Marker Keeper',
    originalPrice: 600,
    discountedPrice: 400,
    image: 'https://www.dropbox.com/scl/fi/x8sg8zzsapzfhojjrzl3k/Gemini_Generated_Image_kkro38kkro38kkro-1.png?rlkey=ecis5zqqqflgn89izg4m9i98h&st=hud6giji&raw=1',
    tag: 'Office',
    description: 'Solid wood pencil and marker organizer. Keeps your desk tidy and stylish.',
  },
  {
    id: 'mobile-stand',
    name: 'Mobile Stand',
    originalPrice: 900,
    discountedPrice: 600,
    image: 'https://www.dropbox.com/scl/fi/qbegbps5z5q9t8qks9b58/Gemini_Generated_Image_l1yw33l1yw33l1yw.png?rlkey=fzjxw5ckjcj33lpu3wbdudmz9&st=f7ndz9bm&raw=1',
    tag: 'Office',
    description: 'Elegant wooden mobile stand. Perfect for your desk, kitchen, or bedside table.',
  },
  {
    id: 'tissue-paper-roller',
    name: 'Tissue Paper Roller',
    originalPrice: 600,
    discountedPrice: 300,
    image: 'https://www.dropbox.com/scl/fi/i314rzzvcwwq5ovfnwlov/Gemini_Generated_Image_oe5q8toe5q8toe5q.png?rlkey=sl2owgcwfukg5bl9ehf513qin&st=d99mp87y&raw=1',
    tag: 'Kitchen',
    description: 'Wooden tissue paper roller holder. Available in Medium (Rs.300) and Large (Rs.500).',
  },
  {
    id: 'knife-stand',
    name: 'Knife Stand',
    originalPrice: 1000,
    discountedPrice: 300,
    image: 'https://www.dropbox.com/scl/fi/oyyqy7dj9xer5e7f5yaol/Gemini_Generated_Image_ukejkzukejkzukej.png?rlkey=s27blau6kosdw4w9p8lyfxovt&st=scnjg8lj&raw=1',
    tag: 'Kitchen',
    description: 'Solid wood knife stand. Small Rs.300 | Medium Rs.500 | Large Rs.800.',
  },
  {
    id: 'wooden-calendar',
    name: 'Wooden Calendar',
    originalPrice: 3500,
    discountedPrice: 2500,
    image: 'https://www.dropbox.com/scl/fi/wa4qfffh1vwxqvz41fthe/Gemini_Generated_Image_yk6f35yk6f35yk6f.png?rlkey=f7nkj5gfs1e3unjwpviha8lsi&st=xx9vuhj0&raw=1',
    tag: 'Home Decor',
    description: 'Timeless handcrafted wooden perpetual calendar. A unique decor piece for any room.',
  },
  {
    id: 'cup-stand',
    name: 'Cup Stand',
    originalPrice: 700,
    discountedPrice: 500,
    image: 'https://www.dropbox.com/scl/fi/kqwx6xaj4ooqtb6arkybw/Gemini_Generated_Image_z4xou5z4xou5z4xo.png?rlkey=zdta3rvvkvyfic3bwfbpg2a9k&st=8cvlf4tw&raw=1',
    tag: 'Kitchen',
    description: 'Elegant wooden cup stand. Holds multiple cups neatly on your kitchen counter.',
  },
];

async function main() {
  console.log('🌱 Seeding AL GHAZI WOOD CRAFTS products...');

  for (const product of PRODUCTS) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {
        name:            product.name,
        originalPrice:   product.originalPrice,
        discountedPrice: product.discountedPrice,
        image:           product.image,
        tag:             product.tag,
        description:     product.description,
        isAvailable:     true,
      },
      create: {
        id:              product.id,
        name:            product.name,
        originalPrice:   product.originalPrice,
        discountedPrice: product.discountedPrice,
        image:           product.image,
        tag:             product.tag,
        description:     product.description,
        isAvailable:     true,
      },
    });
    console.log(`  ✅ ${product.name}`);
  }

  console.log(`\n🎉 Done! ${PRODUCTS.length} products seeded.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
