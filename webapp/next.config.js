const isServer = typeof window === 'undefined';

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['knex'],
  },
  // webpack: (config) => {
  //   if (!isServer) {
  //     config.resolve.alias['@'] = __dirname;
  //   }
  //   return config;
  // },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
