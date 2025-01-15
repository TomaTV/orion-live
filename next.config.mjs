/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  async rewrites() {
    return [];
  },
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    domains: ["www.gravatar.com"], // Ajoutez Gravatar ici
  },
};

export default nextConfig;
