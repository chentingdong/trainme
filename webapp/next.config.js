const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin');

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['knex'],
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
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

    if (isServer) {
      config.plugins.push(new PrismaPlugin());
    }

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
