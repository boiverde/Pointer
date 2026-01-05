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
            // Novos dominios adicionados para evitar quebra de imagens
            {
                protocol: 'https',
                hostname: 'placehold.co',
            },
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
            },
            {
                protocol: 'https',
                hostname: 'i.imgur.com',
            },
            {
                protocol: 'https',
                hostname: 'shop.manchestercity.com',
            },
            {
                protocol: 'https',
                hostname: 'images.footballfanatics.com',
            },
            {
                protocol: 'https',
                hostname: 'store.psg.fr',
            },
            {
                protocol: 'https',
                hostname: 'down-br.img.susercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'acdn.mitiendanube.com',
            },
            {
                protocol: 'https',
                hostname: '*.supabase.co',
            },
        ],
    },
};

module.exports = nextConfig;
