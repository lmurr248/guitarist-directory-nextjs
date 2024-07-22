/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    domains: ["res.cloudinary.com"],
  },
};

module.exports = nextConfig;
