import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { ArrowRight, Trophy, Star, TrendingUp, Sparkles } from "lucide-react";
import { getProducts } from "../lib/api";
import { ProductCard } from "../components/ui/product-card";
import { Skeleton } from "../components/ui/skeleton";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col bg-background text-foreground bg-noise overflow-x-hidden">
            {/* Hero Section - Immersive & Premium */}
            <section className="relative min-h-[90dvh] md:h-screen w-full flex flex-col justify-center items-center overflow-hidden">
                {/* Background - In production use a <video> or high-res optimized image */}
                {/* Background - Optimized Video/Image */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800/20 via-background to-background z-10" />
                    <Image
                        src="https://images.unsplash.com/photo-1511886929837-354d827aae26?q=80&w=2564&auto=format&fit=crop"
                        alt="Hero Background"
                        fill
                        priority
                        className="object-cover object-center opacity-40"
                        quality={90}
                    />
                    <div className="absolute inset-0 bg-background/60 backdrop-blur-[1px] z-0" />
                </div>

                {/* Content */}
                <div className="relative z-20 container mx-auto px-6 text-center mt-10 md:mt-20">
                    <div className="inline-flex items-center gap-2 mb-6 md:mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] md:text-xs font-black tracking-[0.3em] text-primary uppercase backdrop-blur-md shadow-2xl">
                            Nova Coleção 24/25
                        </span>
                    </div>

                    <h1 className="text-5xl sm:text-7xl md:text-9xl lg:text-[11rem] font-black tracking-tight leading-[0.9] mb-6 md:mb-8 mix-blend-screen opacity-90 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        VISTA A <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-500">GLÓRIA.</span>
                    </h1>

                    <p className="text-base md:text-2xl text-neutral-400 max-w-2xl mx-auto mb-8 md:mb-12 font-medium leading-relaxed tracking-tight animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        Engenharia de elite. Design atemporal. <br className="hidden md:block" />
                        Os uniformes que definem a história do futebol.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <Link
                            href="/collections/all"
                            className="group relative inline-flex h-14 md:h-16 w-full md:w-auto items-center justify-center overflow-hidden rounded-full bg-white px-8 md:px-12 text-sm font-black uppercase tracking-widest text-black transition-all hover:bg-neutral-200 hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Comprar Agora <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        </Link>
                        <Link
                            href="/sale"
                            className="group inline-flex h-14 md:h-16 w-full md:w-auto items-center justify-center px-8 md:px-12 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all hover:scale-105"
                        >
                            Ver Ofertas
                        </Link>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50 hidden md:block">
                    <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white to-transparent" />
                </div>
            </section>

            {/* Collections Grid - Bento Style */}
            <section className="py-16 md:py-32 bg-background border-t border-white/5 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="flex items-end justify-between mb-10 md:mb-16 px-2">
                        <div>
                            <span className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block">Departamentos</span>
                            <h2 className="text-3xl md:text-6xl font-black text-white tracking-tighter">COLEÇÕES</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 h-auto md:h-[600px]">
                        {/* Major Item */}
                        <div className="md:col-span-8 md:row-span-2 relative group overflow-hidden rounded-3xl border border-white/10 bg-neutral-900 h-[300px] md:h-auto">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522770179533-24471fcdba45?q=80&w=2600&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-40" />
                            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
                                <Trophy className="w-8 h-8 md:w-12 md:h-12 text-yellow-500 mb-4 md:mb-6 drop-shadow-lg" />
                                <h3 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-2">Seleções</h3>
                                <p className="text-neutral-300 font-medium max-w-md text-sm md:text-lg">Os mantos sagrados das maiores potências do futebol mundial.</p>
                                <Link href="/collections/national-teams" className="absolute inset-0" />
                            </div>
                        </div>

                        {/* Secondary Item 1: Europa (Champions League Style) */}
                        <div className="md:col-span-4 md:row-span-1 relative group overflow-hidden rounded-3xl border border-white/10 bg-[#0e1628] h-[250px] md:h-auto">
                            {/* Champions League Starball Pattern Background */}
                            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
                                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    <path d="M50 0 L61 35 L98 35 L68 57 L79 91 L50 69 L21 91 L32 57 L2 35 L39 35 Z" fill="white" transform="translate(-20, -20) scale(0.5)" />
                                    <path d="M50 0 L61 35 L98 35 L68 57 L79 91 L50 69 L21 91 L32 57 L2 35 L39 35 Z" fill="white" transform="translate(80, 20) scale(0.6)" />
                                    <path d="M50 0 L61 35 L98 35 L68 57 L79 91 L50 69 L21 91 L32 57 L2 35 L39 35 Z" fill="white" transform="translate(20, 80) scale(0.4)" />
                                </svg>
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-tr from-[#0a0f1c] via-[#101935]/80 to-blue-900/40 mix-blend-multiply" />

                            <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8 z-10">
                                <div>
                                    <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-blue-600/20 border border-blue-500/30 mb-4 backdrop-blur-md group-hover:scale-110 transition-transform duration-300">
                                        <Star className="w-5 h-5 md:w-6 md:h-6 text-blue-400 fill-blue-400/20" />
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-white mb-1 drop-shadow-lg">
                                        Europa
                                    </h3>
                                    <p className="text-blue-200/60 font-medium text-xs md:text-sm tracking-wide">Champions League Elite</p>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="h-1 w-12 bg-blue-500 rounded-full group-hover:w-24 transition-all duration-300" />
                                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 -rotate-45 group-hover:rotate-0 transition-transform text-white/50 group-hover:text-blue-400" />
                                </div>
                                <Link href="/collections/clubs" className="absolute inset-0" />
                            </div>
                        </div>

                        {/* Secondary Item 2: Brasileirão (CBF Style) */}
                        <div className="md:col-span-4 md:row-span-1 relative group overflow-hidden rounded-3xl border border-white/10 bg-[#0e2815] h-[250px] md:h-auto">
                            {/* Dynamic Green/Yellow/Blue Gradient Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#1a4d25] via-[#0e2815] to-[#0a1a0f] opacity-100" />
                            <div className="absolute -right-20 -top-20 w-64 h-64 bg-yellow-500/10 blur-[80px] rounded-full group-hover:bg-yellow-500/20 transition-all duration-500" />
                            <div className="absolute -left-10 bottom-0 w-48 h-48 bg-blue-600/10 blur-[60px] rounded-full group-hover:bg-blue-600/20 transition-all duration-500" />

                            <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8 z-10">
                                <div>
                                    {/* CBF-inspired Shield Icon */}
                                    <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-yellow-400/10 border border-yellow-400/30 mb-4 backdrop-blur-md group-hover:scale-110 transition-transform duration-300">
                                        {/* Abstract Shield Shape */}
                                        <svg viewBox="0 0 24 24" className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 fill-yellow-400/20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter text-white mb-1 drop-shadow-lg">
                                        Brasileirão
                                    </h3>
                                    <p className="text-emerald-200/60 font-medium text-xs md:text-sm tracking-wide">O País do Futebol</p>
                                </div>

                                <div className="flex justify-between items-end">
                                    <div className="flex gap-1">
                                        <div className="h-1 w-4 bg-green-500 rounded-full group-hover:h-2 transition-all duration-300" />
                                        <div className="h-1 w-4 bg-yellow-400 rounded-full group-hover:h-3 transition-all duration-300 delay-75" />
                                        <div className="h-1 w-4 bg-blue-500 rounded-full group-hover:h-2 transition-all duration-300 delay-100" />
                                    </div>
                                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 -rotate-45 group-hover:rotate-0 transition-transform text-white/50 group-hover:text-yellow-400" />
                                </div>
                                <Link href="/collections/brasileirao" className="absolute inset-0" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Auto-Playing Statement Banner */}
            <div className="w-full bg-primary py-3 md:py-4 overflow-hidden flex whitespace-nowrap">
                <div className="animate-marquee inline-flex gap-8 items-center text-black font-black uppercase tracking-widest text-[10px] md:text-sm">
                    {Array(10).fill("Free Shipping Worldwide • Premium Quality • Official Licensed Products • ").map((text, i) => (
                        <span key={i}>{text}</span>
                    ))}
                </div>
            </div>

            {/* Featured Jerseys Section w/ Suspense */}
            <section className="py-16 md:py-32 px-6 relative bg-background">
                <div className="container mx-auto">
                    <div className="flex flex-col md:flex-row items-end justify-between gap-4 mb-10 md:mb-16">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <span className="text-primary font-bold tracking-widest text-xs uppercase">Destaques</span>
                            </div>
                            <h2 className="text-3xl md:text-6xl font-black text-white tracking-tighter">LATEST DROPS</h2>
                        </div>
                        <Link href="/collections/all" className="group flex items-center gap-2 text-white font-bold uppercase tracking-widest text-xs hover:text-primary transition-colors border-b border-transparent hover:border-primary pb-1">
                            Ver Coleção
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <Suspense fallback={<ProductGridSkeleton />}>
                        <FeaturedProducts />
                    </Suspense>
                </div>
            </section>
        </main>
    );
}

// Server Component for fetching products
async function FeaturedProducts() {
    const products = await getProducts();
    const featuredProducts = products.slice(0, 4);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {featuredProducts.map((product: any, idx: number) => (
                <div key={product.id} className="animate-reveal" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    );
}

function ProductGridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                    <Skeleton className="h-[400px] w-full rounded-xl bg-neutral-900/50" />
                    <Skeleton className="h-4 w-2/3 bg-neutral-900/50" />
                    <Skeleton className="h-4 w-1/3 bg-neutral-900/50" />
                </div>
            ))}
        </div>
    );
}
