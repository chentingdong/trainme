const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['knex'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { dev, isServer }) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    });

    if (dev && !isServer) {
      config.resolve.alias['@'] = __dirname;
      config.devtool = 'eval-source-map';
    } else if (!dev && !isServer) {
      config.devtool = 'source-map';
    }
    return config;
  },
};

module.exports = nextConfig;
