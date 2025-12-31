"use client";

import AdminLayout from '../../components/AdminLayout';

export default function CustomersPage() {
    return (
        <AdminLayout
            title="Base de Clientes"
            subtitle="Visualize e gerencie seus clientes registrados."
        >
            <div className="bg-neutral-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8 text-center">
                <p className="text-neutral-400">Funcionalidade de listagem de clientes em desenvolvimento.</p>
            </div>
        </AdminLayout>
    );
}
