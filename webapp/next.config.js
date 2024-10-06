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

    if (dev && !isServer) {
      config.module.rules.push({
        test: /\.js$/,
        enforce: 'pre',
        use: ['source-map-loader'],
        exclude: /node_modules/,
      });
      config.devtool = 'eval-source-map';
    }

    if (!dev && isServer) {
      config.devtool = 'hidden-source-map';
    }

    return config;
  },
};

export default nextConfig;
