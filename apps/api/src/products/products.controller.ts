
import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    create(@Body() createProductDto: CreateProductDto): Promise<any> {
        return this.productsService.create(createProductDto);
    }

    @Get()
    findAll(): Promise<any> {
        return this.productsService.findAll();
    }

    @Get('brands')
    findAllBrands() {
        return this.productsService.findAllBrands();
    }

    @Get('teams')
    findAllTeams() {
        return this.productsService.findAllTeams();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<any> {
        return this.productsService.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<any> {
        return this.productsService.remove(id);
    }
}
