
"use client";

import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/cart';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '../lib/utils'; // Assuming utils exists or I define simple utility

export function CartDrawer() {
    const {
        items,
        isCartOpen,
        closeCart,
        removeFromCart,
        getCartTotal
    } = useCartStore();

    const [mounted, setMounted] = useState(false);

    // Hydration fix
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300",
                    isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={closeCart}
            />

            {/* Drawer */}
            <div className={cn(
                "fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col",
                isCartOpen ? "translate-x-0" : "translate-x-full"
            )}>

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-100">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Seu Carrinho <span className="text-gray-400 text-sm font-normal">({items.length})</span>
                    </h2>
                    <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Items List */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-400">
                            <ShoppingBag className="w-12 h-12 opacity-20" />
                            <p>Seu carrinho está vazio.</p>
                            <button onClick={closeCart} className="text-black underline text-sm font-medium">Continuar Comprando</button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.variantId} className="flex gap-4">
                                {/* Image Placeholder */}
                                <div className="w-20 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative border border-gray-100 shrink-0">
                                    <span className="text-xs text-gray-300 font-bold">{item.team?.charAt(0)}</span>
                                    {/* In real app: <Image src={item.image} fill className="object-cover" /> */}
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-medium text-sm text-gray-900 pr-4 line-clamp-2">{item.name}</h3>
                                            <p className="font-bold text-sm">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Tamanho: <span className="text-black font-medium">{item.size}</span></p>
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs text-gray-500">Qtd: {item.quantity}</span>
                                        <button
                                            onClick={() => removeFromCart(item.variantId)}
                                            className="text-xs text-red-500 flex items-center gap-1 hover:text-red-700 font-medium"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                            Remover
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t border-gray-100 p-5 bg-gray-50 space-y-4">
                        <div className="flex items-center justify-between text-base font-medium text-gray-900">
                            <p>Subtotal</p>
                            <p>R$ {getCartTotal().toFixed(2).replace('.', ',')}</p>
                        </div>
                        <p className="text-xs text-gray-500 text-center">Frete e taxas calculados no checkout.</p>

                        <Link
                            href="/checkout"
                            onClick={closeCart}
                            className="w-full bg-black text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                        >
                            Finalizar Compra
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
