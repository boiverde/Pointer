
"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { Suspense } from 'react';

function ConfirmationContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('id');

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-emerald-500 p-8 flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg animate-bounce-slow">
                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">Order Confirmed!</h1>
                    <p className="text-emerald-100 text-sm">Thank you for your purchase.</p>
                </div>

                <div className="p-8 space-y-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">Order ID</p>
                        <p className="text-xl font-mono font-bold text-gray-900">{orderId || 'PENDING'}</p>
                    </div>

                    <p className="text-sm text-gray-600 text-center leading-relaxed">
                        We have sent a confirmation email to your inbox. Your jersey will be with you shortly.
                    </p>

                    <div className="space-y-3">
                        <Link
                            href="/collections/all"
                            className="block w-full bg-black text-white py-3 rounded-lg font-bold text-center hover:bg-gray-800 transition-colors"
                        >
                            Continue Shopping
                        </Link>
                        <Link
                            href="/" // In real app, /account/orders
                            className="block w-full bg-white text-gray-700 border border-gray-200 py-3 rounded-lg font-bold text-center hover:bg-gray-50 transition-colors"
                        >
                            View Order Details
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ConfirmationContent />
        </Suspense>
    );
}
