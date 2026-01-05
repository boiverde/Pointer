
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
                    <h1 className="text-2xl font-bold text-white mb-1">Pedido Confirmado!</h1>
                    <p className="text-emerald-100 text-sm">Obrigado por sua compra.</p>
                </div>

                <div className="p-8 space-y-6">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-1">ID do Pedido</p>
                        <p className="text-xl font-mono font-bold text-gray-900 mb-6">{orderId || 'PENDENTE'}</p>

                        <div className="bg-white p-4 rounded-xl border-2 border-dashed border-emerald-500/30 inline-block mb-4">
                            {/* QR Code Pattern Mock */}
                            <div className="w-48 h-48 bg-gray-900 p-1 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-white p-2">
                                    <div className="w-full h-full bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ExamplePayment')] bg-contain bg-center bg-no-repeat opacity-90" />
                                </div>
                                {/* Scan Line Animation */}
                                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.5)] animate-scan-y" />
                            </div>
                        </div>
                        <p className="text-sm font-bold text-emerald-700">Pagamento via PIX</p>
                        <p className="text-xs text-gray-400 mt-1">Escaneie para finalizar (Demonstração)</p>
                    </div>

                    <p className="text-sm text-gray-600 text-center leading-relaxed">
                        Enviamos um e-mail de confirmação para você. Em breve seu manto estará com você.
                    </p>

                    <div className="space-y-3">
                        <Link
                            href="/collections/all"
                            className="block w-full bg-black text-white py-3 rounded-lg font-bold text-center hover:bg-gray-800 transition-colors"
                        >
                            Continuar Comprando
                        </Link>
                        <Link
                            href="/" // In real app, /account/orders
                            className="block w-full bg-white text-gray-700 border border-gray-200 py-3 rounded-lg font-bold text-center hover:bg-gray-50 transition-colors"
                        >
                            Ver Detalhes do Pedido
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
