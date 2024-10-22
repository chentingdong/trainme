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
  productionBrowserSourceMaps: true,

  webpack: (config) => {
    config.context = path.resolve(process.cwd());
    config.experiments = { ...config.experiments, topLevelAwait: true };

    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    });

    // Enable source maps for all environments and file types
    config.devtool =
      process.env.NODE_ENV === 'development' ? 'eval-source-map' : 'source-map';

    // Ensure source maps are generated for vendor chunks
    config.optimization.moduleIds = 'named';
    config.optimization.chunkIds = 'named';

    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dgalywyr863hv.cloudfront.net',
      },
    ],
  },
};

export default nextConfig;
