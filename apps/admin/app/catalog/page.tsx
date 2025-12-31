"use client";

import AdminLayout from '../../components/AdminLayout';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function CatalogPage() {
    return (
        <AdminLayout
            title="Catálogo de Produtos"
            subtitle="Gerencie seus produtos, preços e estoque."
            actions={
                <Link href="/catalog/new">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-black rounded-xl text-sm font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20">
                        <Plus className="h-4 w-4" />
                        <span>Novo Produto</span>
                    </button>
                </Link>
            }
        >
            <div className="bg-neutral-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8 text-center">
                <p className="text-neutral-400">Funcionalidade de listagem de produtos em desenvolvimento.</p>
            </div>
        </AdminLayout>
    );
}
