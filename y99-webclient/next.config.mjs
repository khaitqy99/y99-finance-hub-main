/** @type {import('next').NextConfig} */
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, '..'),
  async redirects() {
    return [
      {
        source: "/disclaimer",
        destination: "/tuyen-bo-mien-tru-trach-nhiem",
        permanent: true,
      },
      {
        source: "/mien-tru-trach-nhiem",
        destination: "/tuyen-bo-mien-tru-trach-nhiem",
        permanent: true,
      },
      {
        source: "/tuyen-bo-mien-tru",
        destination: "/tuyen-bo-mien-tru-trach-nhiem",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
