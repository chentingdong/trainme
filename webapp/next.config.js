const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['knex'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.resolve.alias['@'] = __dirname;
    }
    return config;
  },
};

module.exports = nextConfig;
