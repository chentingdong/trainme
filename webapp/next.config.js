import path from 'path';

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
    config.context = path.resolve(process.cwd());
    config.experiments = { ...config.experiments, topLevelAwait: true };

    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    });

    if (dev && !isServer) {
      config.module.rules.push({
        test: /\.(ts|tsx)$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: /node_modules/,
      });
      config.devtool = 'eval-source-map';
    }

    if (!dev && isServer) {
      // config.devtool = 'hidden-source-map';
      config.devtool = false;
    }

    return config;
  },
};

export default nextConfig;
