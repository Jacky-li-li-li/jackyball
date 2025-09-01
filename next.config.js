/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'res.cloudinary.com', 'api.qrserver.com'],
  },
  env: {
    NEXT_PUBLIC_WECHAT_APP_ID: process.env.WECHAT_APP_ID,
  },
}

module.exports = nextConfig