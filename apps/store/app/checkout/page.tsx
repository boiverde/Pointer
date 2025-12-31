
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../store/cart';
import { createOrder } from '../../lib/api';
import { Loader2, ShieldCheck, Lock } from 'lucide-react';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, getCartTotal, clearCart } = useCartStore();
    const [isProcessing, setIsProcessing] = useState(false);

    // Hydration check
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        zip: '',
        street: '',
        number: '',
        city: '',
        state: '',
        country: 'Brazil'
    });

    const subtotal = getCartTotal();
    const shipping = 0; // Free for MVP
    const total = subtotal + shipping;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            // 1. Prepare Payload
            const payload = {
                customer: {
                    name: formData.fullName,
                    email: formData.email,
                    phone: formData.phone
                },
                address: {
                    street: formData.street,
                    number: formData.number,
                    zip: formData.zip,
                    city: formData.city,
                    state: formData.state,
                    country: formData.country
                },
                items: items.map(item => ({
                    variantId: item.variantId,
                    quantity: item.quantity,
                    price: item.price // Snapshot price at time of purchase
                })),
                total: total
            };

            // 2. Send to API
            const order = await createOrder(payload);

            // 3. Success Handler
            clearCart();
            router.replace('/order/success?id=' + order.id);

        } catch (error: any) {
            alert(`Falha no checkout: ${error.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!mounted) return null;

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
                <button onClick={() => router.push('/')} className="text-blue-600 hover:underline">
                    Return to Shop
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-3xl font-bold mb-8 text-black">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* LEFT COLUMN - FORMS */}
                    <div className="lg:col-span-7 space-y-8">

                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
                            {/* Customer Info */}
                            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center">1</span>
                                    Contact Info
                                </h2>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-black outline-none"
                                            value={formData.fullName}
                                            onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input
                                                required
                                                type="email"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-black outline-none"
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                            <input
                                                required
                                                type="tel"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-black outline-none"
                                                placeholder="(11) 99999-9999"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Shipping Address */}
                            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center">2</span>
                                    Shipping Address
                                </h2>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-black outline-none"
                                                value={formData.zip}
                                                onChange={e => setFormData({ ...formData, zip: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-black outline-none"
                                                value={formData.state}
                                                onChange={e => setFormData({ ...formData, state: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[3fr,1fr] gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-black outline-none"
                                                value={formData.street}
                                                onChange={e => setFormData({ ...formData, street: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Number</label>
                                            <input
                                                required
                                                type="text"
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-black outline-none"
                                                value={formData.number}
                                                onChange={e => setFormData({ ...formData, number: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-black outline-none"
                                            value={formData.city}
                                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Payment Info (Mocked) */}
                            <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center">3</span>
                                    Payment
                                </h2>
                                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg flex items-center gap-3 opacity-70">
                                    <Lock className="w-5 h-5 text-gray-500" />
                                    <span className="text-sm text-gray-600">Secure Payment Gateway (Mocked for Demo)</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-2 ml-1">You will not be charged. This is a simulation.</p>
                            </section>
                        </form>
                    </div>

                    {/* RIGHT COLUMN - SUMMARY */}
                    <div className="lg:col-span-5">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-lg lg:sticky lg:top-24">
                            <h3 className="text-lg font-bold mb-4">Order Summary</h3>

                            <div className="divide-y divide-gray-100 max-h-[300px] overflow-y-auto mb-4">
                                {items.map(item => (
                                    <div key={item.variantId} className="flex gap-4 py-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-md shrink-0 flex items-center justify-center font-bold text-gray-300 border">
                                            {item.team?.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</p>
                                                <p className="text-sm font-bold">R$ {(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Size: {item.size} | Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-4 border-t border-gray-100 mb-6">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span>R$ {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
                                    <span>Total</span>
                                    <span>R$ {total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={isProcessing}
                                className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <ShieldCheck className="w-5 h-5" />
                                        Pay R$ {total.toFixed(2)}
                                    </>
                                )}
                            </button>

                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                                <Lock className="w-3 h-3" />
                                <span>256-bit SSL Secured Transaction</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
