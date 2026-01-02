
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }

    async getStats(): Promise<any> {
        // 1. Total Revenue
        const totalRevenueResult = await this.prisma.order.aggregate({
            _sum: {
                total: true,
            },
            where: {
                status: { not: 'CANCELLED' } // Assume cancelled orders don't count
            }
        });
        const totalRevenue = Number(totalRevenueResult._sum.total) || 0;

        // 2. Total Orders
        const totalOrders = await this.prisma.order.count({
            where: {
                status: { not: 'CANCELLED' }
            }
        });

        // 3. Active Customers (Unique Emails in Orders + Registered Users)
        // Simplification: Count Users + Guest Emails from Orders? 
        // Let's just count Users for now to be fast, or count unique order emails.
        const totalCustomers = await this.prisma.user.count();

        // 4. Low Stock Items (Stock < 5)
        const lowStockCount = await this.prisma.productVariant.count({
            where: {
                stock: {
                    lt: 5
                }
            }
        });

        // 5. Recent Orders (Last 5)
        const recentOrders = await this.prisma.order.findMany({
            take: 5,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                // We don't need full details for the dashboard list usually, but user is nice
                user: {
                    select: { name: true, email: true }
                }
            }
        });

        // 6. Revenue Chart Data (Last 7 days)
        // Complex query. For MVP, let's just group by day in JS or do a raw query.
        // Prisma raw query is easier for dates.
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // This is a simplified approach. In production, use a proper date table or db-specific date function.
        const ordersLast7Days = await this.prisma.order.findMany({
            where: {
                createdAt: {
                    gte: sevenDaysAgo
                },
                status: { not: 'CANCELLED' }
            },
            select: {
                createdAt: true,
                total: true
            }
        });

        const chartData = this.processChartData(ordersLast7Days);

        // 7. Top Teams (by Sales)
        // Group by Team Name. 
        // Logic: OrderItem -> Product -> Team
        // We need to sum up OrderItem.quantity or calculate value. Usually "sales" means volume or revenue. Let's do volume (count) for now.
        // Prisma doesn't support deep groupBy nicely, so we fetch OrderItems with Product.Team and aggregate in JS.
        // For performance in large scale, use raw SQL. For now, JS is fine.

        const orderItemsForTeams = await this.prisma.orderItem.findMany({
            where: {
                order: { status: { not: 'CANCELLED' } }
            },
            include: {
                variant: {
                    include: {
                        product: {
                            include: { team: true }
                        }
                    }
                }
            }
        });

        const teamSalesMap = new Map<string, number>();
        orderItemsForTeams.forEach(item => {
            const teamName = item.variant?.product?.team?.name || 'Outros';
            const current = teamSalesMap.get(teamName) || 0;
            teamSalesMap.set(teamName, current + item.quantity);
        });

        const teamData = Array.from(teamSalesMap.entries())
            .map(([name, sales]) => ({ name, sales }))
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5); // Top 5

        // 8. Size Distribution
        // Logic: OrderItem -> Variant.size
        const orderItemsForSizes = await this.prisma.orderItem.findMany({
            where: {
                order: { status: { not: 'CANCELLED' } }
            },
            include: {
                variant: true
            }
        });

        const sizeMap = new Map<string, number>();
        orderItemsForSizes.forEach(item => {
            const size = item.variant?.size || 'N/A';
            const current = sizeMap.get(size) || 0;
            sizeMap.set(size, current + item.quantity);
        });

        const sizeData = Array.from(sizeMap.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        return {
            totalRevenue,
            totalOrders,
            totalCustomers,
            lowStockCount,
            recentOrders,
            chartData,
            teamData,
            sizeData
        };
    }

    private processChartData(orders: { createdAt: Date, total: any }[]) {
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
        const dataMap = new Map<string, number>();

        // Key by date string to handle week boundaries correctly
        const result = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dayName = days[d.getDay()];
            const dateStr = d.toDateString();
            result.push({ name: dayName, total: 0, dateStr });
        }

        orders.forEach(order => {
            const dateStr = order.createdAt.toDateString();
            const item = result.find(r => r.dateStr === dateStr);
            if (item) {
                item.total += Number(order.total);
            }
        });

        return result.map(r => ({ name: r.name, total: r.total }));
    }
}
