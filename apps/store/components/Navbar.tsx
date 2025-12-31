
'use client';

import Link from "next/link";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import { useCartStore } from "../store/cart";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";

export function Navbar() {
    const { openCart, getItemCount } = useCartStore() as any;
    const count = getItemCount ? getItemCount() : 0;
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    const isHome = pathname === '/';

    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out border-b",
                    scrolled
                        ? "glass py-4 border-white/10"
                        : isHome
                            ? "bg-transparent border-transparent py-8"
                            : "glass py-4 border-white/10"
                )}
            >
                <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">

                    {/* Left: Mobile Menu Trigger & Desktop Search */}
                    <div className="flex items-center gap-6 flex-1">
                        <button
                            className="md:hidden text-white hover:text-primary transition-colors p-2 -ml-2"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <button className="hidden md:flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
                            <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold uppercase tracking-widest hidden lg:block group-hover:text-primary transition-colors">Buscar</span>
                        </button>
                    </div>

                    {/* Center: Logo */}
                    <div className="flex-1 flex justify-center">
                        <Link href="/" className="group flex items-center gap-2 relative">
                            <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <span className="text-2xl md:text-3xl font-black tracking-tighter text-white uppercase italic relative z-10 flex items-center gap-1">
                                POINTER<span className="text-emerald-400 text-4xl leading-none">.</span>
                            </span>
                        </Link>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center justify-end gap-6 flex-1">

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-8 mr-6">
                            <Link href="/collections/all" className="relative text-xs font-bold uppercase tracking-widest text-white hover:text-primary transition-colors after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-primary after:transition-all hover:after:w-full">
                                Loja
                            </Link>
                            <Link href="/about" className="relative text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors">
                                Sobre
                            </Link>
                        </div>

                        <div className="flex items-center gap-6">
                            <Link href="/login" className="hidden md:block text-white/70 hover:text-white transition-colors hover:scale-110 duration-300">
                                <User className="w-5 h-5" />
                            </Link>
                            <button
                                onClick={openCart}
                                className="text-white hover:text-primary transition-colors relative group p-1"
                            >
                                <ShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                                {count > 0 && (
                                    <span className="absolute -top-1 -right-2 bg-primary text-black text-[9px] font-black h-4 w-4 rounded-full flex items-center justify-center ring-2 ring-black animate-in zoom-in spin-in-12 duration-300">
                                        {count}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={cn(
                "fixed inset-0 z-[60] bg-black transition-transform duration-300 transform",
                mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-12">
                        <span className="text-2xl font-black uppercase italic tracking-tighter">Menu</span>
                        <button onClick={() => setMobileMenuOpen(false)} className="text-white/50 hover:text-white">
                            <X className="w-8 h-8" />
                        </button>
                    </div>

                    <div className="flex flex-col gap-8 text-3xl font-black uppercase tracking-tight">
                        <Link href="/" className="text-white hover:text-primary transition-colors">Início</Link>
                        <Link href="/collections/all" className="text-white hover:text-primary transition-colors">Loja Completa</Link>
                        <Link href="/collections/leagues" className="text-white/50 hover:text-white transition-colors">Ligas</Link>
                        <Link href="/sale" className="text-accent hover:text-white transition-colors">Ofertas</Link>
                    </div>

                    <div className="mt-auto border-t border-white/10 pt-8 flex flex-col gap-4">
                        <Link href="/login" className="flex items-center gap-4 text-white/60">
                            <User className="w-5 h-5" /> Entrar / Cadastrar
                        </Link>
                        <Link href="/support" className="text-sm text-white/40">Ajuda e Suporte</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
