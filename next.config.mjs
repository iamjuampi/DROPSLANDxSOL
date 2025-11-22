import nextPWA from "@ducanh2912/next-pwa";
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: "export",
};

// PWA Configuration
const withPWA = nextPWA({
  dest: "public", // Destination directory for PWA files
  register: true, // Register the service worker
  skipWaiting: true, // Skip waiting for service worker activation
  disable: process.env.NODE_ENV === "development", // Disable PWA in development
});

export default withPWA(nextConfig);
