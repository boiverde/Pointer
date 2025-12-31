
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { catalogService } from '../../services/catalog.service';
import { Save, Loader2, Plus, Minus, ArrowLeft } from 'lucide-react';

const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function CreateProductPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [teams, setTeams] = useState([]);
    const [brands, setBrands] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        basePrice: '',
        season: '2024/25',
        type: 'HOME', // Enum: HOME, AWAY, etc.
        teamId: '',
        brandId: '',
    });

    // Stock Grid State: Maps size -> quantity
    // e.g., { 'S': 0, 'M': 5 }
    const [stockGrid, setStockGrid] = useState(
        AVAILABLE_SIZES.reduce((acc, size) => ({ ...acc, [size]: 0 }), {})
    );

    useEffect(() => {
        // Load dependencies
        catalogService.getTeams().then(setTeams);
        catalogService.getBrands().then(setBrands);
    }, []);

    const handleStockChange = (size, type) => {
        setStockGrid(prev => ({
            ...prev,
            [size]: Math.max(0, prev[size] + (type === 'inc' ? 1 : -1))
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 1. Transform Grid to Variants Array
            const variants = Object.entries(stockGrid)
                .filter(([_, qty]) => qty > 0) // Only send sizes with stock? Or create all with 0? Let's create all > 0 for now.
                .map(([size, quantity]) => ({
                    size,
                    stock: quantity,
                    sku: `${formData.name.substring(0, 3).toUpperCase()}-${size}-${Date.now().toString().slice(-4)}` // Auto-generate simple SKU
                }));

            if (variants.length === 0) {
                throw new Error("Please add stock for at least one size.");
            }

            // 2. Prepare Payload
            const payload = {
                ...formData,
                basePrice: parseFloat(formData.basePrice),
                variants
            };

            // 3. Send
            await catalogService.createProduct(payload);

            // 4. Redirect
            router.push('/catalog'); // Assuming this exists or will exist. Redirect to home for now if catalog is missing.
        } catch (error) {
            alert(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-100 rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="font-bold text-lg">New Product</h1>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800 disabled:opacity-50"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save
                    </button>
                </div>
            </div>

            <main className="max-w-3xl mx-auto p-4 space-y-6">

                {/* Basic Info Card */}
                <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
                    <h2 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">Basic Details</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-black outline-none"
                            placeholder="e.g. Brazil Home Kit 2024"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                            <select
                                className="w-full px-3 py-2 border rounded-lg bg-white"
                                value={formData.teamId}
                                onChange={e => setFormData({ ...formData, teamId: e.target.value })}
                                required
                            >
                                <option value="">Select Team...</option>
                                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                            <select
                                className="w-full px-3 py-2 border rounded-lg bg-white"
                                value={formData.brandId}
                                onChange={e => setFormData({ ...formData, brandId: e.target.value })}
                                required
                            >
                                <option value="">Select Brand...</option>
                                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-black outline-none"
                                placeholder="0.00"
                                value={formData.basePrice}
                                onChange={e => setFormData({ ...formData, basePrice: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Season</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-black outline-none"
                                value={formData.season}
                                onChange={e => setFormData({ ...formData, season: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            rows={3}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-black outline-none resize-none"
                            placeholder="Product details..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </section>

                {/* Stock Grid Card */}
                <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-4">
                        <h2 className="font-semibold text-gray-900">Inventory & Sizes</h2>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Variant Control</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {AVAILABLE_SIZES.map(size => (
                            <div key={size} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-sm">
                                        {size}
                                    </div>
                                    <span className="text-sm text-gray-600 font-medium">Stock Level</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleStockChange(size, 'dec')}
                                        className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-all text-gray-600"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-8 text-center font-mono font-medium">{stockGrid[size]}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleStockChange(size, 'inc')}
                                        className="w-8 h-8 rounded-md bg-black text-white flex items-center justify-center hover:bg-gray-800 active:scale-95 transition-all"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </main>
        </div>
    );
}
