/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
