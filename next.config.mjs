/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects(){
    return [
      {
        source: "/artisans",
        destination: "/artisans/inscription",
        permanent: true
      }
    ]
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
