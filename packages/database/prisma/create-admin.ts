
import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    console.log('Creating Admin User...')

    const password = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@jersey.store' },
        update: {},
        create: {
            email: 'admin@jersey.store',
            name: 'Admin User',
            password: password,
            role: 'ADMIN',
        },
    })

    console.log({ admin })
    console.log('Admin user created successfully.')
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
