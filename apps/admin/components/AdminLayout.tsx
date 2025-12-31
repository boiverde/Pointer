"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Package,
    ClipboardList,
    Users,
    Settings,
    Search,
    Bell,
    Menu,
    LogOut,
    ShoppingBag
} from 'lucide-react';
import { authService } from '../services/auth.service';

export default function AdminLayout({ children, title, subtitle, actions }: { children: React.ReactNode, title: string, subtitle?: string, actions?: React.ReactNode }) {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Hydration fix / check auth
        const token = authService.getToken();
        if (token) {
            // Decode token or fetch profile if needed, for now just mock or rely on authService
            // user = authService.getUser() // if implemented
        }
    }, []);

    const navItems = [
        { icon: Home, label: 'Visão Geral', href: '/' },
        { icon: Package, label: 'Catálogo', href: '/catalog' },
        { icon: ClipboardList, label: 'Pedidos', href: '/orders' },
        { icon: Users, label: 'Clientes', href: '/customers' },
    ];

    const handleLogout = () => {
        authService.logout();
    };

    return (
        <div className="flex min-h-screen bg-neutral-950 text-white font-sans selection:bg-emerald-500/30">

            {/* Sidebar (Desktop) */}
            <aside className="hidden lg:flex w-64 flex-col border-r border-white/5 bg-neutral-900/50 backdrop-blur-xl fixed inset-y-0 z-50">
                <div className="p-6 border-b border-white/5">
                    <h1 className="text-xl font-bold tracking-tighter flex items-center gap-2">
                        POINTER<span className="text-emerald-400">.</span>
                    </h1>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">Admin Console</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${pathname === item.href
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${pathname === item.href ? 'text-emerald-400' : 'text-neutral-500 group-hover:text-white'}`} />
                            <span className="flex-1 text-left">{item.label}</span>
                        </Link>
                    ))}

                    <div className="pt-4 mt-4 border-t border-white/5">
                        <p className="px-4 text-[10px] font-bold text-neutral-600 uppercase tracking-wider mb-2">Sistema</p>
                        <Link
                            href="http://localhost:3005"
                            target="_blank"
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group text-neutral-400 hover:bg-white/5 hover:text-white"
                        >
                            <ShoppingBag className="w-5 h-5 text-neutral-500 group-hover:text-white" />
                            <span className="flex-1 text-left">Acessar Loja</span>
                        </Link>
                        <Link
                            href="/settings"
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${pathname === '/settings'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <Settings className="w-5 h-5 text-neutral-500 group-hover:text-white" />
                            <span className="flex-1 text-left">Configurações</span>
                        </Link>
                    </div>
                </nav>

                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 mb-2">
                        <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                            AD
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-bold text-white truncate">Administrador</p>
                            <p className="text-[10px] text-neutral-500 truncate">admin@jersey.store</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut className="w-3 h-3" />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 relative flex flex-col min-h-screen">
                {/* Header (Mobile & Desktop) */}
                <header className="sticky top-0 z-40 border-b border-white/5 bg-neutral-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
                    <div className="lg:hidden flex items-center gap-4">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
                            <Menu className="w-6 h-6" />
                        </button>
                        <h1 className="font-bold text-lg">POINTER<span className="text-emerald-400">.</span></h1>
                    </div>

                    <div className="hidden lg:block relative w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="w-full bg-neutral-900 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-neutral-300 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 placeholder:text-neutral-600"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-neutral-400 hover:text-white transition-colors hover:bg-white/5 rounded-full">
                            <Bell className="h-5 w-5" />
                            {/* Notification Dot Logic Here */}
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-6 md:p-10 space-y-8 max-w-[1600px] mx-auto w-full flex-1">
                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">{title}</h2>
                            {subtitle && <p className="text-neutral-400">{subtitle}</p>}
                        </div>
                        {actions && (
                            <div className="flex gap-3">
                                {actions}
                            </div>
                        )}
                    </div>

                    {children}
                </div>

                {/* Mobile Menu Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-50 bg-neutral-950/90 backdrop-blur-sm lg:hidden p-4">
                        <div className="flex justify-end mb-4">
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-white p-2">
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>
                        <nav className="space-y-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-4 rounded-xl text-lg font-medium ${pathname === item.href
                                        ? 'bg-emerald-500/10 text-emerald-400'
                                        : 'text-neutral-400'
                                        }`}
                                >
                                    <item.icon className="w-6 h-6" />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}

                {/* Mobile Bottom Nav (Optional, maybe redundant with Sidebar mobile menu, but kept for consistency if desired) 
                    - Only showing if not menu open? 
                    - Actually, usually one or the other. I'll stick to the Sidebar Overlay for mobile deep nav, 
                      or the Bottom Nav for quick access. Bottom Nav is better for app-feel.
                */}
                <div className="md:hidden sticky bottom-0 left-0 right-0 bg-neutral-900/90 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex justify-between items-center z-30">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 ${pathname === item.href ? 'text-emerald-400' : 'text-neutral-500'}`}
                        >
                            <item.icon className="w-6 h-6" />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
