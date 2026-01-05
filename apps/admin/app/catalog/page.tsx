"use client";

import { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { catalogService } from '../../services/catalog.service';

export default function CatalogPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await catalogService.getProducts();
            setProducts(data);
        } catch (error) {
            console.error('Failed to load products', error);
        } finally {
            setIsLoading(false);
        }
    };

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
            {isLoading ? (
                <div className="text-center py-10 text-neutral-400">Carregando produtos...</div>
            ) : products.length === 0 ? (
                <div className="bg-neutral-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8 text-center text-neutral-400">
                    Nenhum produto encontrado. Clique em "Novo Produto" para começar.
                </div>
            ) : (
                <div className="bg-neutral-900/50 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden">
                    <table className="w-full text-left text-sm text-neutral-400">
                        <thead className="bg-white/5 text-neutral-200 font-medium">
                            <tr>
                                <th className="p-4">Produto</th>
                                <th className="p-4">Preço</th>
                                <th className="p-4">Temporada</th>
                                <th className="p-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-white">{product.name}</div>
                                        <div className="text-xs">{product.id}</div>
                                    </td>
                                    <td className="p-4">R$ {Number(product.basePrice).toFixed(2)}</td>
                                    <td className="p-4">{product.season}</td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <button className="text-emerald-400 hover:text-emerald-300">Editar</button>
                                        <button
                                            onClick={async () => {
                                                if (confirm('Tem certeza que deseja excluir este produto?')) {
                                                    try {
                                                        await catalogService.deleteProduct(product.id);
                                                        loadProducts();
                                                    } catch (e) {
                                                        alert('Erro ao excluir produto');
                                                    }
                                                }
                                            }}
                                            className="text-red-400 hover:text-red-300 px-3"
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
}
