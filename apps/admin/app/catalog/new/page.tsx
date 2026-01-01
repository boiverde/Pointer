
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { catalogService } from '../../../services/catalog.service';
import { Save, Loader2, Plus, Minus, ArrowLeft, UploadCloud } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface Team {
    id: string;
    name: string;
}

interface Brand {
    id: string;
    name: string;
}

const AVAILABLE_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export default function CreateProductPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [teams, setTeams] = useState<Team[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        basePrice: '',
        season: '2024/25',
        type: 'HOME', // Enum: HOME, AWAY, etc.
        teamId: '',
        brandId: '',
        image: ''
    });

    // Stock Grid State: Maps size -> quantity
    // e.g., { 'S': 0, 'M': 5 }
    const [stockGrid, setStockGrid] = useState<Record<string, number>>(
        AVAILABLE_SIZES.reduce((acc, size) => ({ ...acc, [size]: 0 }), {})
    );

    useEffect(() => {
        // Load dependencies
        catalogService.getTeams().then((data: any) => setTeams(data));
        catalogService.getBrands().then((data: any) => setBrands(data));
    }, []);

    const handleStockChange = (size: string, type: 'inc' | 'dec') => {
        setStockGrid(prev => ({
            ...prev,
            [size]: Math.max(0, (prev[size] || 0) + (type === 'inc' ? 1 : -1))
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const uploadImage = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('products')
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage.from('products').getPublicUrl(filePath);
        return data.publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // 1. Upload Image if exists
            let imageUrl = formData.image;
            if (imageFile) {
                imageUrl = await uploadImage(imageFile);
            }

            // 2. Transform Grid to Variants Array
            const variants = Object.entries(stockGrid)
                .filter(([_, qty]) => qty > 0) // Only send sizes with stock? Or create all with 0? Let's create all > 0 for now.
                .map(([size, quantity]) => ({
                    size,
                    stock: quantity,
                    sku: `${formData.name.substring(0, 3).toUpperCase()}-${size}-${Date.now().toString().slice(-4)}` // Auto-generate simple SKU
                }));

            if (variants.length === 0) {
                throw new Error("Por favor, adicione estoque para pelo menos um tamanho.");
            }

            // 3. Prepare Payload
            const payload = {
                ...formData,
                slug: formData.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
                images: imageUrl ? [imageUrl] : [],
                basePrice: parseFloat(formData.basePrice),
                variants
            };

            // Remove the singular 'image' property which is not in the DTO
            // @ts-ignore
            delete payload.image;

            // 4. Send
            await catalogService.createProduct(payload);

            // 5. Redirect
            router.push('/catalog');
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar produto. Verifique se preencheu tudo.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-100 text-gray-900 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-700">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="font-bold text-lg text-gray-900">Novo Produto</h1>
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800 disabled:opacity-50 transition-colors"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Salvar
                    </button>
                </div>
            </div>

            <main className="max-w-3xl mx-auto p-4 space-y-6">

                {/* Basic Info Card */}
                <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
                    <h2 className="font-semibold text-gray-900 border-b border-gray-100 pb-2">Detalhes Básicos</h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none text-black bg-white placeholder:text-gray-400"
                            placeholder="ex: Camisa Brasil Titular 2024"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Foto do Produto</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer relative bg-white">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="h-40 object-contain mb-2" />
                            ) : (
                                <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                            )}
                            <span className="text-sm text-gray-500">
                                {imagePreview ? 'Clique para alterar a imagem' : 'Clique para fazer upload da imagem'}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black focus:ring-2 focus:ring-black outline-none"
                                value={formData.teamId}
                                onChange={e => setFormData({ ...formData, teamId: e.target.value })}
                                required
                            >
                                <option value="" className="text-gray-500">Selecione o Time...</option>
                                {teams.map(t => <option key={t.id} value={t.id} className="text-black">{t.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-black focus:ring-2 focus:ring-black outline-none"
                                value={formData.brandId}
                                onChange={e => setFormData({ ...formData, brandId: e.target.value })}
                                required
                            >
                                <option value="" className="text-gray-500">Selecione a Marca...</option>
                                {brands.map(b => <option key={b.id} value={b.id} className="text-black">{b.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Preço (R$)</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none text-black bg-white placeholder:text-gray-400"
                                placeholder="0.00"
                                value={formData.basePrice}
                                onChange={e => setFormData({ ...formData, basePrice: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Temporada</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none text-black bg-white placeholder:text-gray-400"
                                value={formData.season}
                                onChange={e => setFormData({ ...formData, season: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                        <textarea
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none resize-none text-black bg-white placeholder:text-gray-400"
                            placeholder="Detalhes do produto..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                </section>

                {/* Stock Grid Card */}
                <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-4">
                        <h2 className="font-semibold text-gray-900">Estoque e Tamanhos</h2>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full border border-gray-200">Controle de Variantes</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {AVAILABLE_SIZES.map(size => (
                            <div key={size} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-sm text-gray-900">
                                        {size}
                                    </div>
                                    <span className="text-sm text-gray-700 font-medium">Quantidade</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleStockChange(size, 'dec')}
                                        className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-all text-gray-600"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-8 text-center font-mono font-medium text-gray-900">{stockGrid[size]}</span>
                                    <button
                                        type="button"
                                        onClick={() => handleStockChange(size, 'inc')}
                                        className="w-8 h-8 rounded-md bg-neutral-900 text-white flex items-center justify-center hover:bg-black active:scale-95 transition-all"
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
