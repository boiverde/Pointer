
'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import { useCartStore } from '../../../store/cart';
import { getProductById } from '../../../lib/api';
import { ArrowLeft, Check, Lock, ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [product, setProduct] = useState<any>(null);
    const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const { addToCart, openCart } = useCartStore();
    const router = useRouter();

    useEffect(() => {
        getProductById(id).then(data => {
            setProduct(data);
            setLoading(false);
        }).catch(err => {
            // Handle error (e.g., product not found)
            setLoading(false);
        });
    }, [id]);

    if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Carregando...</div>;
    if (!product) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Produto não encontrado</div>;

    const currentVariant = product.variants.find((v: any) => v.id === selectedVariant);
    const isOutOfStock = (variant: any) => variant.stock === 0;

    const handleAddToCart = () => {
        if (!selectedVariant) return;
        setIsAdding(true);
        addToCart({
            variantId: selectedVariant,
            productId: product.id,
            name: product.name,
            price: Number(product.basePrice),
            image: product.image,
            size: currentVariant.size, // Assuming size is on variant
            team: product.team.name,
            quantity: 1
        });
        openCart();
        setTimeout(() => setIsAdding(false), 500);
    };

    return (
        <main className="min-h-screen bg-black text-white pt-24 pb-12">
            <div className="container mx-auto px-6 max-w-6xl">

                {/* Breadcrumb / Back Navigation */}
                <div className="mb-8">
                    <Link href="/collections/all" className="inline-flex items-center text-sm text-neutral-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar para Loja
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

                    {/* Left Column: Image Area */}
                    <div className="space-y-6">
                        <div className="relative aspect-[4/5] w-full bg-neutral-900 rounded-2xl overflow-hidden border border-white/5">
                            {/* Badge */}
                            {product.season === '2024/25' && (
                                <div className="absolute top-4 left-4 z-20 bg-white text-black text-xs font-black px-3 py-1.5 uppercase tracking-widest shadow-lg">
                                    Nova Temporada
                                </div>
                            )}

                            {/* Image Placeholder */}
                            <div className="w-full h-full flex flex-col items-center justify-center relative bg-gradient-to-b from-neutral-800 to-neutral-900">
                                <span className="text-[120px] md:text-[180px] font-black text-white/5 uppercase select-none leading-none">
                                    {product.team.name.substring(0, 3)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Product Details */}
                    <div className="flex flex-col justify-center">

                        {/* Brand & Team */}
                        <div className="mb-2 flex items-center gap-3">
                            <span className="text-primary font-bold tracking-widest uppercase text-xs">{product.brand.name}</span>
                            <span className="w-1 h-1 rounded-full bg-neutral-600"></span>
                            <span className="text-neutral-400 font-bold tracking-widest uppercase text-xs">{product.team.name}</span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[0.9] mb-4">
                            {product.name}
                        </h1>

                        {/* Price */}
                        <div className="mb-8 flex items-baseline gap-4">
                            <span className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                                R$ {Number(product.basePrice).toFixed(2).replace('.', ',')}
                            </span>
                            <div className="text-sm text-neutral-400">
                                <p>ou 3x de <span className="text-white">R$ {(Number(product.basePrice) / 3).toFixed(2).replace('.', ',')}</span> sem juros</p>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px w-full bg-white/10 mb-8"></div>

                        {/* Size Selector */}
                        <div className="mb-8">
                            <div className="flex justify-between items-end mb-4">
                                <label className="text-sm font-bold text-white uppercase tracking-wider">Selecione o Tamanho</label>
                                <button className="text-xs text-neutral-400 underline decoration-1 underline-offset-4 hover:text-white">Guia de Medidas</button>
                            </div>

                            <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
                                {product.variants.map((variant: any) => {
                                    const outOfStock = isOutOfStock(variant);
                                    const isSelected = selectedVariant === variant.id;

                                    return (
                                        <button
                                            key={variant.id}
                                            disabled={outOfStock}
                                            onClick={() => setSelectedVariant(variant.id)}
                                            className={`
                                                relative h-14 rounded-lg font-bold text-sm border transition-all duration-200
                                                uppercase flex items-center justify-center
                                                ${isSelected
                                                    ? 'bg-white text-black border-white ring-2 ring-primary ring-offset-2 ring-offset-black'
                                                    : outOfStock
                                                        ? 'bg-neutral-900 text-neutral-700 border-neutral-800 cursor-not-allowed decoration-neutral-700 line-through'
                                                        : 'bg-transparent text-white border-white/20 hover:border-white hover:bg-white/5'
                                                }
                                            `}
                                        >
                                            {variant.size}
                                        </button>
                                    );
                                })}
                            </div>
                            {selectedVariant && (
                                <p className="mt-3 text-xs text-green-400 flex items-center">
                                    <Check className="w-3 h-3 mr-1.5" />
                                    Em Estoque - Envio Imediato
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="space-y-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={!selectedVariant || isAdding}
                                className={`
                                    w-full h-16 rounded-full font-black text-lg uppercase tracking-wider transition-all duration-200
                                    flex items-center justify-center gap-3
                                    ${!selectedVariant
                                        ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                                        : 'bg-primary text-black hover:bg-primary/90 hover:scale-[1.01] shadow-xl shadow-primary/10'
                                    }
                                `}
                            >
                                {isAdding ? 'Adicionando...' : 'Adicionar ao Carrinho'}
                            </button>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 gap-4 pt-6">
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                                    <ShieldCheck className="w-5 h-5 text-neutral-400" />
                                    <div className="text-xs text-neutral-300">
                                        <span className="block font-bold text-white">Produto Autêntico</span>
                                        100% Licenciado Oficial
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                                    <Lock className="w-5 h-5 text-neutral-400" />
                                    <div className="text-xs text-neutral-300">
                                        <span className="block font-bold text-white">Compra Segura</span>
                                        Pagamento Criptografado
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
