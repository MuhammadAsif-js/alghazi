/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Remove X-Powered-By header for security
  poweredByHeader: false,

  images: {
    remotePatterns: [
      // Pexels CDN (used for product/hero images)
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      // Supabase Storage (for future product image uploads)
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },

  // HTTP Security Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
