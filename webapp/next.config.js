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

    // Provide source maps for development
    if (dev && !isServer) {
      config.devtool = 'eval-source-map'; // Enables source maps for client-side development
    }

    // Use hidden-source-map for production for debugging
    if (!dev && !isServer) {
      config.devtool = 'hidden-source-map';
    }

    return config;
  },
};

export default nextConfig;
