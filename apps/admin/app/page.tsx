"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    DollarSign,
    ShoppingBag,
    Users,
    AlertTriangle,
    Download,
    RefreshCw,
    TrendingUp,
    TrendingDown,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { authService } from '../services/auth.service';
import { useRouter } from 'next/navigation';
import AdminLayout from '../components/AdminLayout';

const COLORS = ['#34D399', '#3B82F6', '#F59E0B', '#EF4444'];

export default function AdminDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        lowStockCount: 0,
        recentOrders: [],
        chartData: [],
        teamData: [],
        sizeData: []
    });

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const token = authService.getToken();
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await fetch('http://localhost:3001/dashboard', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401) {
                authService.logout();
                return;
            }

            if (!response.ok) {
                console.error('Failed to fetch dashboard data');
                return;
            }

            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-emerald-500">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                    <p className="text-sm font-medium tracking-widest uppercase animate-pulse">Carregando dados...</p>
                </div>
            </div>
        );
    }

    const {
        totalRevenue,
        totalOrders,
        totalCustomers,
        lowStockCount,
        recentOrders,
        chartData,
        teamData,
        sizeData
    } = stats;

    const pageActions = (
        <>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 border border-white/10 rounded-xl text-sm font-medium hover:bg-neutral-800 transition-colors">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Exportar Relatório</span>
            </button>
            <button
                onClick={fetchDashboardData}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-black rounded-xl text-sm font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
            >
                <RefreshCw className="h-4 w-4" />
                <span>Atualizar</span>
            </button>
        </>
    );

    return (
        <AdminLayout
            title="Painel de Controle"
            subtitle="Visão geral do desempenho da sua loja hoje."
            actions={pageActions}
        >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Receita Total"
                    value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalRevenue)}
                    trend="+20.1% vs. mês anterior"
                    trendUp={true}
                    icon={DollarSign}
                    color="emerald"
                />
                <StatCard
                    title="Pedidos Realizados"
                    value={totalOrders}
                    trend="+180% vs. mês anterior"
                    trendUp={true}
                    icon={ShoppingBag}
                    color="blue"
                />
                <StatCard
                    title="Clientes Ativos"
                    value={totalCustomers}
                    trend="+19% vs. mês anterior"
                    trendUp={true}
                    icon={Users}
                    color="purple"
                />
                <StatCard
                    title="Estoque Crítico"
                    value={`${lowStockCount} Itens`}
                    trend={lowStockCount > 0 ? "Requer atenção imediata" : "Estoque saudável"}
                    trendUp={lowStockCount === 0}
                    icon={AlertTriangle}
                    color={lowStockCount > 0 ? "red" : "emerald"}
                    urgent={lowStockCount > 0}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Revenue Chart */}
                <div className="col-span-1 lg:col-span-2 bg-neutral-900/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-white">Evolução de Vendas</h3>
                            <p className="text-xs text-neutral-500">Receita diária nos últimos 7 dias</p>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData && chartData.length > 0 ? chartData : []}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis
                                    dataKey="name"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#737373' }}
                                    dy={10}
                                />
                                <YAxis
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `R$${value}`}
                                    tick={{ fill: '#737373' }}
                                    dx={-10}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#171717',
                                        borderColor: '#262626',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                    itemStyle={{ color: '#34D399' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#10B981"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorTotal)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Teams */}
                <div className="bg-neutral-900/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-1">Times Mais Vendidos</h3>
                    <p className="text-xs text-neutral-500 mb-6">Performance por clube nesta semana</p>

                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%" minHeight={200}>
                            <BarChart data={teamData} layout="vertical" barSize={34}>
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    width={100}
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#a3a3a3', fontWeight: 500 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{
                                        backgroundColor: '#171717',
                                        borderColor: '#262626',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                />
                                <Bar dataKey="sales" radius={[0, 6, 6, 0]}>
                                    {teamData && teamData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#34D399' : '#3f3f46'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Secondary Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Size Distribution */}
                <div className="bg-neutral-900/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-6">Distribuição por Tamanho</h3>
                    <div className="h-[200px] flex items-center justify-center relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={sizeData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {sizeData && sizeData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#171717',
                                        borderColor: '#262626',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-2xl font-bold text-white">
                                {sizeData ? sizeData.reduce((acc: any, cur: any) => acc + cur.value, 0) : 0}
                            </span>
                            <span className="text-xs text-neutral-500 uppercase tracking-widest">Total</span>
                        </div>
                    </div>
                    <div className="flex justify-center gap-6 text-xs text-neutral-400 mt-4">
                        {sizeData && sizeData.map((entry: any, index: number) => (
                            <div key={entry.name} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                {entry.name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity (Fake List) */}
                <div className="col-span-1 md:col-span-2 bg-neutral-900/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-white">Últimos Pedidos</h3>
                        <button className="text-xs text-emerald-400 hover:text-emerald-300 font-medium">Ver todos</button>
                    </div>

                    <div className="space-y-4">
                        {recentOrders.length === 0 ? (
                            <div className="text-center py-8 text-neutral-500 text-sm">Nenhum pedido recente.</div>
                        ) : (
                            recentOrders.map((order: any) => (
                                <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-neutral-800 flex items-center justify-center text-lg">
                                            🛒
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">
                                                {order.customerName || (order.user ? order.user.name : 'Cliente Visitante')}
                                            </p>
                                            <p className="text-xs text-neutral-500">
                                                {order.items ? `${order.items.length} itens • ` : ''}
                                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${order.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                    'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>
                                            {order.status === 'COMPLETED' ? 'Aprovado' : order.status === 'PENDING' ? 'Pendente' : order.status}
                                        </span>
                                        <p className="text-[10px] text-neutral-500 mt-1">
                                            {new Date(order.createdAt).toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

function StatCard({ title, value, trend, trendUp, icon: Icon, color, urgent }: any) {
    const colorClasses = {
        emerald: 'bg-emerald-500/10 text-emerald-500',
        blue: 'bg-blue-500/10 text-blue-500',
        purple: 'bg-indigo-500/10 text-indigo-500',
        red: 'bg-red-500/10 text-red-500',
    };

    return (
        <div className={`bg-neutral-900/50 backdrop-blur-sm p-6 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden group hover:border-white/10 transition-colors`}>
            {/* Glow Effect */}
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-0 group-hover:opacity-20 transition-opacity blur-2xl ${color === 'emerald' ? 'bg-emerald-500' :
                    color === 'blue' ? 'bg-blue-500' :
                        color === 'purple' ? 'bg-indigo-500' : 'bg-red-500'
                }`}></div>

            <div className="flex items-center justify-between mb-4 relative z-10">
                <h3 className="text-sm font-medium text-neutral-400">{title}</h3>
                <div className={`p-2.5 rounded-xl ${colorClasses[color as keyof typeof colorClasses]}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </div>

            <div className="relative z-10">
                <div className="text-2xl font-bold text-white mb-2">{value}</div>
                <div className="flex items-center gap-2">
                    {trendUp ? (
                        <TrendingUp className="w-3 h-3 text-emerald-400" />
                    ) : (
                        <TrendingDown className={`w-3 h-3 ${urgent ? 'text-red-500' : 'text-red-400'}`} />
                    )}
                    <p className={`text-xs ${urgent ? 'text-red-500 font-bold' : (trendUp ? 'text-emerald-400' : 'text-red-400')}`}>
                        {trend}
                    </p>
                </div>
            </div>
        </div>
    );
}
