/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    formats: ['image/avif', 'image/webp'],
  },
  // Optimize webpack for faster rebuilds
  webpack: (config, { isServer, dev }) => {
    if (dev) {
      // Exclude data files and other non-source files from watching
      config.watchOptions = {
        ignored: [
          '**/data/**',
          '**/node_modules/**',
          '**/.next/**',
          '**/public/**',
          '**/content/**',
        ],
        poll: false, // Disable polling for better performance
      };
    }
    
    // Fix for next-mdx-remote ESM compatibility
    // Ensure it's bundled rather than treated as external
    if (isServer) {
      config.externals = config.externals || [];
      // Remove next-mdx-remote from externals if it's there
      if (Array.isArray(config.externals)) {
        config.externals = config.externals.filter(
          (ext) => ext !== 'next-mdx-remote'
        );
      }
    }
    
    return config;
  },
  // Enable experimental features for faster dev server
  experimental: {
    optimizePackageImports: ['recharts', 'date-fns'],
  },
  // Transpile next-mdx-remote to handle ESM properly
  transpilePackages: ['next-mdx-remote'],
};

export default nextConfig;


