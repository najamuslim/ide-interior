/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["upcdn.io", "replicate.delivery"],
  },
  trailingSlash: false,
  async headers() {
    return [
      {
        source: "/api/midtrans-webhook",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "POST, OPTIONS",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
