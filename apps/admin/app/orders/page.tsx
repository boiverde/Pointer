"use client";

import AdminLayout from '../../components/AdminLayout';

export default function OrdersPage() {
    return (
        <AdminLayout
            title="Gerenciamento de Pedidos"
            subtitle="Acompanhe e processe os pedidos da loja."
        >
            <div className="bg-neutral-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8 text-center">
                <p className="text-neutral-400">Funcionalidade de listagem de pedidos em desenvolvimento.</p>
            </div>
        </AdminLayout>
    );
}
