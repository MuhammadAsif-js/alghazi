/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Allow Server Actions from GitHub Codespaces
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        '*.app.github.dev', // Allows any Codespace domain
        'crispy-adventure-gg4x5j599xj397j6-3000.app.github.dev' // Your specific current domain
      ],
    },
  },

  // Remove X-Powered-By header for security
  poweredByHeader: false,

  images: {
    remotePatterns: [
      // Pexels CDN (used for hero images)
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      // Supabase Storage (for future product image uploads)
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      // Dropbox (product images)
      {
        protocol: 'https',
        hostname: 'www.dropbox.com',
      },
      {
        protocol: 'https',
        hostname: 'dl.dropboxusercontent.com',
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