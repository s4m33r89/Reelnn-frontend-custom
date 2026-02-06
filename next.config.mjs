/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['image.tmdb.org'],
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
