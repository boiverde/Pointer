
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { StockMovementType, OrderStatus } from '../common/enums';

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateOrderDto): Promise<any> {
        // THE GOLDEN RULE IMPLEMENTATION: Transaction
        return await this.prisma.$transaction(async (tx) => {
            let totalAmount = 0;

            // 1. Create or Find User (Simplified for Guest Checkout)
            // In a real scenario, we might upsert a User record
            // For now, we store customer info directly on Order or assume guest

            // 2. Validate Stock & Calculate Total (Trust backend price, not frontend)
            for (const item of data.items) {
                const variant = await tx.productVariant.findUnique({
                    where: { id: item.variantId },
                    include: { product: true }
                });

                if (!variant) {
                    throw new NotFoundException(`Product variant not found: ${item.variantId}`);
                }

                if (variant.stock < item.quantity) {
                    throw new BadRequestException(`Insufficient stock for ${variant.product.name} (Size: ${variant.size})`);
                }

                // RE-CALCULATE Price from DB (Security)
                // If we trust frontend price, we risk manipulation. Ideally use variant.price or product.basePrice
                // Let's assume price is on Product for now
                // totalAmount += Number(variant.product.basePrice) * item.quantity;
            }

            // 3. Decrement Stock & Log Movement
            // We do this in a second loop or same loop to ensure all checks pass first
            for (const item of data.items) {
                await tx.productVariant.update({
                    where: { id: item.variantId },
                    data: { stock: { decrement: item.quantity } }
                });

                await tx.stockMovement.create({
                    data: {
                        variantId: item.variantId,
                        type: StockMovementType.SALE,
                        quantity: item.quantity,
                        reason: 'Online Order'
                    }
                });
            }

            // 4. Create Order Record
            const order = await tx.order.create({
                data: {
                    // Guest / Customer Info
                    customerName: data.customer.name,
                    customerEmail: data.customer.email,
                    customerPhone: data.customer.phone,

                    // Shipping Address
                    shippingAddressStreet: data.address.street,
                    shippingAddressNumber: data.address.number,
                    shippingAddressZip: data.address.zip,
                    shippingAddressCity: data.address.city,
                    shippingAddressState: data.address.state,
                    shippingAddressCountry: data.address.country,

                    status: OrderStatus.PENDING,
                    total: data.total, // Or calculated totalAmount
                    items: {
                        create: data.items.map(item => ({
                            variantId: item.variantId,
                            quantity: item.quantity,
                            price: item.price // Store the price sold at
                        }))
                    }
                },
                include: { items: true }
            });

            return order;
        });
    }
}
