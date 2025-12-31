
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Starting catalog seed...');

    // 1. Create Brands
    console.log('Seeding Brands...');
    const nike = await prisma.brand.upsert({
        where: { slug: 'nike' },
        update: {},
        create: { name: 'Nike', slug: 'nike', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg' },
    });

    const adidas = await prisma.brand.upsert({
        where: { slug: 'adidas' },
        update: {},
        create: { name: 'Adidas', slug: 'adidas', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg' },
    });

    const puma = await prisma.brand.upsert({
        where: { slug: 'puma' },
        update: {},
        create: { name: 'Puma', slug: 'puma', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/88/Puma_Logo.png' },
    });

    // 2. Create Teams
    console.log('Seeding Teams...');
    const teamsData = [
        { name: 'Flamengo', slug: 'flamengo', league: 'Brasileirão', country: 'Brazil' },
        { name: 'Real Madrid', slug: 'real-madrid', league: 'La Liga', country: 'Spain' },
        { name: 'Manchester City', slug: 'man-city', league: 'Premier League', country: 'England' },
        { name: 'Arsenal', slug: 'arsenal', league: 'Premier League', country: 'England' },
        { name: 'Brazil National Team', slug: 'brazil', league: 'International', country: 'Brazil' },
    ];

    const teams = {};
    for (const t of teamsData) {
        teams[t.slug] = await prisma.team.upsert({
            where: { slug: t.slug },
            update: {},
            create: t,
        });
    }

    // 3. Create Products (Jerseys)
    console.log('Seeding Products...');

    const productsData = [
        {
            name: 'Flamengo Home 2024/25',
            description: 'The new sacred mantle of Mengão. Authentic red and black stripes.',
            basePrice: 349.90,
            season: '2024/25',
            type: 'HOME',
            brandId: adidas.id,
            teamId: teams['flamengo'].id,
            image: 'https://images.tcdn.com.br/img/img_prod/1066063/camisa_flamengo_i_2024_torcedor_adidas_masculina_8709_1_726d17e75f0a2007887754320980bd2e.jpg',
        },
        {
            name: 'Real Madrid Home 24/25',
            description: 'The classic white kit of the Kings of Europe. Gold accents.',
            basePrice: 499.90,
            season: '2024/25',
            type: 'HOME',
            brandId: adidas.id,
            teamId: teams['real-madrid'].id,
            image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/0e171b9bb967484a9238eb5a8052aeff_9366/Camisa_1_Real_Madrid_24-25_Branco_IT5182_01_laydown.jpg',
        },
        {
            name: 'Brazil Away 2024',
            description: 'Blue textured design representing the Brazilian beaches and waves.',
            basePrice: 399.90,
            season: '2024',
            type: 'AWAY',
            brandId: nike.id,
            teamId: teams['brazil'].id,
            image: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/a0bed157-1234-4530-9b36-42d8fa624388/camisa-nike-brasil-ii-2024-25-torcedor-pro-masculina.png',
        },
        {
            name: 'Manchester City Home 24/25',
            description: 'Sky blue kit with 0161 area code details on collar.',
            basePrice: 459.90,
            season: '2024/25',
            type: 'HOME',
            brandId: puma.id,
            teamId: teams['man-city'].id,
            image: 'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/775075/01/mod01/fnd/BRA/fmt/png/Camisa-Manchester-City-Home-24/25-Masculina',
        },
        {
            name: 'Arsenal Home 24/25',
            description: 'Classic red body with white sleeves. The cannon returns.',
            basePrice: 429.90,
            season: '2024/25',
            type: 'HOME',
            brandId: adidas.id,
            teamId: teams['arsenal'].id,
            image: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/20436d40082944b78996b79c379a5b3a_9366/Camisa_1_Arsenal_24-25_Vermelho_IT6141_01_laydown.jpg',
        },
    ];

    for (const p of productsData) {
        const slug = p.name.toLowerCase().replace(/ /g, '-').replace(/\//g, '-');

        // Create product
        const product = await prisma.product.upsert({
            where: { slug: slug },
            update: {},
            create: { ...p, slug: slug },
        });

        // Create variants (Sizes)
        const sizes = ['S', 'M', 'L', 'XL'];
        for (const size of sizes) {
            // Simple SKU gen
            const sku = `${slug.substring(0, 5).toUpperCase()}-${size}-001`;
            await prisma.productVariant.upsert({
                where: { sku: sku }, // Assuming SKU is unique per variant
                update: { stock: 10 }, // Reset stock to 10
                create: {
                    productId: product.id,
                    size: size,
                    stock: 10,
                    sku: sku
                }
            }).catch(() => { }); // Ignore duplicate SKU errors if logic fails slightly
        }
    }

    console.log('Seed completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
