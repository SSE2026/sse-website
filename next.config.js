/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
    // 用于小容器/卡片组件（配合 sizes 计算）
    imageSizes: [16, 32, 64, 96, 128, 256, 384, 512, 640],
    // 用于全屏/大 Banner
    deviceSizes: [750, 828, 1080, 1200, 1920, 2048, 3840],
    formats: ['image/avif', 'image/webp'],
  },
};

module.exports = nextConfig;
