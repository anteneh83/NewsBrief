import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/api/audio/:id',
        destination: '/coming-soon',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
