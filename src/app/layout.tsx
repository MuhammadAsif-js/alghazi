import '../styles/globals.css';
import '../index.css';
import { Inter, Playfair_Display } from 'next/font/google';
import NextAuthProvider from './providers';


const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://alghaziwoodcrafts.com'),
  title: {
    default: 'AL GHAZI WOOD CRAFTS | Premium Handcrafted Wooden Artistry',
    template: '%s | AL GHAZI WOOD CRAFTS',
  },
  description:
    'Handcrafted premium walnut and ash wood organizers, chopping blocks, and monitor risers. Made in Pakistan. Nationwide delivery with Cash on Delivery.',
  keywords: [
    'wood crafts Pakistan',
    'handmade wooden organizer',
    'walnut desk organizer',
    'end-grain chopping block',
    'wooden monitor riser',
    'artisan wood Pakistan',
    'al ghazi wood crafts',
  ],
  authors: [{ name: 'AL GHAZI WOOD CRAFTS' }],
  creator: 'AL GHAZI WOOD CRAFTS',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: 'website',
    locale: 'en_PK',
    url: 'https://alghaziwoodcrafts.com',
    siteName: 'AL GHAZI WOOD CRAFTS',
    title: 'AL GHAZI WOOD CRAFTS | Premium Handcrafted Wooden Artistry',
    description:
      'Handcrafted premium walnut and ash wood organizers, chopping blocks, and monitor risers. Made in Pakistan.',
    images: [
      {
        url: 'https://images.pexels.com/photos/5998041/pexels-photo-5998041.jpeg?auto=compress&cs=tinysrgb&w=1200',
        width: 1200,
        height: 630,
        alt: 'AL GHAZI WOOD CRAFTS - Premium Artisan Wood Products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AL GHAZI WOOD CRAFTS | Premium Handcrafted Wooden Artistry',
    description:
      'Handcrafted premium walnut and ash wood organizers. Made in Pakistan.',
    images: [
      'https://images.pexels.com/photos/5998041/pexels-photo-5998041.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body className="min-h-screen bg-[#FDFBF7] text-[#1C1917] font-sans overflow-x-hidden w-full antialiased">
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
