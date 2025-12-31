/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@repo/database"],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'assets.adidas.com',
            },
            {
                protocol: 'https',
                hostname: 'static.nike.com',
            },
            {
                protocol: 'https',
                hostname: 'images.puma.com',
            },
            {
                protocol: 'https',
                hostname: 'images.tcdn.com.br',
            },
        ],
    },
};

module.exports = nextConfig;
