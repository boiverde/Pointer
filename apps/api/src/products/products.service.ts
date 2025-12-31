
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Assuming we have a Db module or similar, or we'll mock it for now
import { CreateProductDto } from './dto/create-product.dto';

// Temporary mock PrismaService if not yet exported from @repo/database
// In a real monorepo we would import { PrismaService } from '@repo/database'
import { Product } from '@repo/database';

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    async create(createProductDto: CreateProductDto): Promise<any> {
        const { variants, ...productData } = createProductDto;

        return this.prisma.product.create({
            data: {
                ...productData,
                variants: {
                    create: variants,
                },
            },
            include: {
                variants: true,
                brand: true,
                team: true,
            },
        });
    }

    async findAll(): Promise<Product[]> {
        return this.prisma.product.findMany({
            include: {
                variants: true,
                brand: true,
                team: true,
            },
        });
    }

    async findOne(id: string): Promise<Product | null> {
        return this.prisma.product.findUnique({
            where: { id },
            include: {
                variants: true,
            },
        });
    }
}
