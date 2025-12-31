
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding...')

    // 1. Create Brands
    const nike = await prisma.brand.upsert({
        where: { slug: 'nike' },
        update: {},
        create: {
            name: 'Nike',
            slug: 'nike',
            logoUrl: 'https://placeholder.com/nike.png',
        },
    })

    const adidas = await prisma.brand.upsert({
        where: { slug: 'adidas' },
        update: {},
        create: {
            name: 'Adidas',
            slug: 'adidas',
            logoUrl: 'https://placeholder.com/adidas.png',
        },
    })

    // 2. Create Teams
    const brazil = await prisma.team.upsert({
        where: { slug: 'brazil' },
        update: {},
        create: {
            name: 'Brazil National Team',
            slug: 'brazil',
            league: 'International',
            country: 'Brazil',
        },
    })

    const arsenal = await prisma.team.upsert({
        where: { slug: 'arsenal' },
        update: {},
        create: {
            name: 'Arsenal FC',
            slug: 'arsenal',
            league: 'Premier League',
            country: 'England',
        },
    })

    // 3. Create Products (Jerseys)

    // Brazil Home Kit
    const brazilHome = await prisma.product.upsert({
        where: { slug: 'brazil-home-2024' },
        update: {},
        create: {
            name: 'Brazil Home Jersey 2024',
            description: 'The classic yellow jersey of the Seleção.',
            slug: 'brazil-home-2024',
            basePrice: 129.99,
            season: '2024',
            type: "HOME",
            brandId: nike.id,
            teamId: brazil.id,
            variants: {
                create: [
                    { size: 'S', stock: 10, sku: 'BRA-H-24-S' },
                    { size: 'M', stock: 25, sku: 'BRA-H-24-M' },
                    { size: 'L', stock: 15, sku: 'BRA-H-24-L' },
                    { size: 'XL', stock: 5, sku: 'BRA-H-24-XL' },
                ],
            },
        },
    })

    // Arsenal Away Kit
    const arsenalAway = await prisma.product.upsert({
        where: { slug: 'arsenal-away-24-25' },
        update: {},
        create: {
            name: 'Arsenal Away Jersey 2024/25',
            description: 'Modern black design for the Gunners.',
            slug: 'arsenal-away-24-25',
            basePrice: 89.99,
            season: '2024/25',
            type: "AWAY",
            brandId: adidas.id,
            teamId: arsenal.id,
            variants: {
                create: [
                    { size: 'M', stock: 50, sku: 'ARS-A-25-M' },
                    { size: 'L', stock: 40, sku: 'ARS-A-25-L' },
                ],
            },
        },
    })

    console.log({ brazilHome, arsenalAway })
    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
