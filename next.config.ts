import type { NextConfig } from "next";
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  webpack: (config, { dev, isServer }) => {
    // Desactivar la caché persistente de webpack para evitar errores
    config.cache = {
      type: 'memory'
    };
    
    return config;
  },
};

const config = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
}) as (config: any) => NextConfig;

export default config(nextConfig);
