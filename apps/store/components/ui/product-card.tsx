
import Image from 'next/image';
import Link from 'next/link';
import { Shirt } from 'lucide-react';
// import { cn } from '../../lib/utils'; // Assuming cn exists or reusing class strings

export function ProductCard({ product }: { product: any }) {
    const totalStock = product.variants?.reduce((acc: number, v: any) => acc + v.stock, 0) || 0;
    const isOutOfStock = totalStock === 0;

    return (
        <Link href={`/product/${product.id}`} className="group relative flex flex-col overflow-hidden rounded-xl bg-neutral-900 border border-white/5 transition-all duration-300 hover:border-white/20 hover:shadow-2xl hover:shadow-black/50">
            {/* Image Container - Dominate card height */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-800">

                {/* Badges - Top Right or Left (Left chosen for clear scanning) */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
                    {/* New Badge */}
                    {!isOutOfStock && product.season === '2024/25' && (
                        <div className="bg-white text-black text-[10px] font-black px-2 py-1 uppercase tracking-widest leading-none shadow-lg">
                            Novo
                        </div>
                    )}
                    {/* Sold Out Badge */}
                    {isOutOfStock && (
                        <div className="bg-neutral-900 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest leading-none border border-white/20">
                            Esgotado
                        </div>
                    )}
                </div>

                {/* Main Image */}
                <div className="relative h-full w-full transition-transform duration-700 group-hover:scale-105 group-hover:brightness-110">
                    {product.image || (product.images && product.images.length > 0) ? (
                        <div className="relative w-full h-full">
                            <Image
                                src={product.image || product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover object-center"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                    ) : (
                        /* Fallback Placeholder (Professional Icon) */
                        <div className="w-full h-full bg-neutral-900 flex flex-col items-center justify-center relative p-12">
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-50" />
                            <Shirt className="w-full h-full text-neutral-800 stroke-[0.5]" />
                            <div className="absolute bottom-8 opacity-40">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">Sem Foto</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Info Section - Clearly separated at bottom */}
            <div className="flex flex-col gap-2 p-5 bg-neutral-900 border-t border-white/5 relative z-10 h-full justify-between">
                <div>
                    {/* Subtitle: Team • Brand */}
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
                            {product.team?.name}
                        </p>
                        <span className="text-[10px] text-neutral-600 font-medium uppercase">{product.brand?.name}</span>
                    </div>

                    {/* Product Name */}
                    <h3 className="text-base font-bold text-white leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                    </h3>
                </div>

                {/* Price Section */}
                <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-lg font-bold text-white tracking-tight">
                        R$ {Number(product.basePrice).toFixed(2).replace('.', ',')}
                    </span>
                    {/* Installments (Subtle) */}
                    <span className="text-[10px] text-neutral-500 font-medium">
                        3x R$ {(Number(product.basePrice) / 3).toFixed(2).replace('.', ',')}
                    </span>
                </div>
            </div>
        </Link>
    );
}
