/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['your-bucket.s3.amazonaws.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  typescript: {
    // ⚠️ Only during development - remove this in production
    ignoreBuildErrors: true,
  },
  eslint: {
    // ⚠️ Only during development - remove this in production
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
