import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@libsql/client', '@prisma/client', '@prisma/adapter-libsql', 'better-sqlite3'],
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize libsql packages to prevent bundling
      config.externals.push('@libsql/client', '@libsql/isomorphic-fetch', '@libsql/isomorphic-ws', '@libsql/hrana-client');

      // Ignore README and LICENSE files
      config.module.rules.push({
        test: /\.(md|txt|LICENSE)$/,
        loader: 'ignore-loader',
      });
    }

    // Fallback for polyfills
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    return config;
  },
};

export default nextConfig;
