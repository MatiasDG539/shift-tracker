import type { NextConfig } from "next";
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
};

const config = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
}) as (config: any) => NextConfig;

export default config(nextConfig);
