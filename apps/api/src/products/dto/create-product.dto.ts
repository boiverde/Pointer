
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';


class CreateProductVariantDto {
    @IsString()
    @IsNotEmpty()
    size: string;

    @IsString()
    @IsNotEmpty()
    sku: string;

    @IsNumber()
    stock: number;
}

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    slug: string;

    @IsNumber()
    basePrice: number;

    @IsString()
    @IsNotEmpty()
    season: string;

    @IsString()
    type: string;

    @IsString()
    @IsNotEmpty()
    brandId: string;

    @IsString()
    @IsNotEmpty()
    teamId: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateProductVariantDto)
    variants: CreateProductVariantDto[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];

    @IsOptional()
    isFeatured?: boolean;

    @IsOptional()
    @IsString()
    category?: string;
}
