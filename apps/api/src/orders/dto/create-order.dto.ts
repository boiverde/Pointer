
import { IsNotEmpty, IsString, IsNumber, ValidateNested, IsEmail, IsArray, Min } from 'class-validator';
import { Type } from 'class-transformer';

class CustomerDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    phone: string;
}

class AddressDto {
    @IsString()
    street: string;
    @IsString()
    number: string;
    @IsString()
    zip: string;
    @IsString()
    city: string;
    @IsString()
    state: string;
    @IsString()
    country: string;
}

class OrderItemDto {
    @IsString()
    variantId: string;

    @IsNumber()
    @Min(1)
    quantity: number;

    @IsNumber()
    price: number;
}

export class CreateOrderDto {
    @ValidateNested()
    @Type(() => CustomerDto)
    customer: CustomerDto;

    @ValidateNested()
    @Type(() => AddressDto)
    address: AddressDto;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @IsNumber()
    total: number;
}
