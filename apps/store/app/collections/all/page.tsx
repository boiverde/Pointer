
import { getProducts } from '../../../lib/api';
import { ProductCard } from '../../../components/ui/product-card';
import { Filter, ChevronDown } from 'lucide-react';

export default async function CatalogPage() {
    const products = await getProducts(); // In a real app, pass searchParams for filtering

    return (
        <main className="min-h-screen bg-black pt-28 pb-20">
            <div className="container mx-auto px-6">

                {/* Header Section */}
                <div className="mb-16 border-b border-white/10 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <span className="text-primary text-xs font-bold tracking-widest uppercase">
                            Coleção
                        </span>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9]">
                            TODAS AS CAMISAS
                        </h1>
                        <p className="text-neutral-400 max-w-lg text-sm md:text-base leading-relaxed">
                            Descubra os últimos kits dos maiores clubes do mundo.
                            Produtos oficiais, qualidade autêntica e designs lendários.
                        </p>
                    </div>

                    {/* Filters Toolbar */}
                    <div className="flex flex-wrap items-center gap-3">
                        <button className="group flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-white text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all">
                            <Filter className="w-3 h-3 group-hover:text-black" />
                            Filtros
                        </button>
                        <div className="h-6 w-[1px] bg-white/10 hidden md:block"></div>
                        <button className="flex items-center gap-2 px-4 py-2 text-neutral-400 hover:text-white transition-colors text-xs font-medium uppercase tracking-wider">
                            Ordernar por: <span className="text-white">Mais Recentes</span>
                            <ChevronDown className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                {/* Product Grid */}
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16">
                        {products.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="py-32 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-2xl bg-white/[0.02]">
                        <p className="text-white/40 font-medium">Nenhum produto encontrado.</p>
                        <button className="mt-4 text-primary text-sm underline decoration-1 underline-offset-4">Limpar filtros</button>
                    </div>
                )}

                {/* Pagination / Load More (Visual only for now) */}
                <div className="mt-20 flex justify-center">
                    <div className="text-neutral-500 text-xs tracking-widest uppercase font-medium">
                        Mostrando {products.length} produtos
                    </div>
                </div>

            </div>
        </main>
    );
}
