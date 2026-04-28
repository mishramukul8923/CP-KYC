/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cp-bucket.del1.vultrobjects.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
