/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingIncludes: {
    '/api/**/*': ['./docs/**/*'],
  },
};

export default nextConfig;