import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['cdn.builder.io', 'x.yummlystatic.com'],
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig
