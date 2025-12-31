
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from '../prisma/prisma.module'; // Import the shared DB module

@Module({
    imports: [PrismaModule],
    controllers: [ProductsController],
    providers: [ProductsService],
})
export class ProductsModule { }
