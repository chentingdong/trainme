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
      config.devtool = 'eval-source-map'; // Use eval-source-map for faster builds in development
    } else if (!dev && !isServer) {
      config.devtool = 'source-map'; // Use source-map for accurate debugging in production
    }
    return config;
  },
};

module.exports = nextConfig;
