import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Vinext's production worker does not transform Next.js image optimizer
  // requests reliably through the Cloudflare tunnel. Serve the original
  // static and admin-uploaded images directly so logos and galleries render.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
