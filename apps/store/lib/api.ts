const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'; // Backend API Endpoint

export async function getProducts(params = {}) {
    // Simulate API delay and fetch
    // In real app, build query string from params: ?team=brazil&sort=price_asc
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout

        const res = await fetch(`${API_URL}/products`, {
            cache: 'no-store', // For testing
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
            console.warn('API fetch failed, returning mock data');
            return MOCK_PRODUCTS;
        }

        return res.json();
    } catch (error) {
        console.warn('API connection failed or timed out, returning mock data');
        return MOCK_PRODUCTS;
    }
}

export async function getProductById(id: string) {
    try {
        const res = await fetch(`${API_URL}/products/${id}`, { cache: 'no-store' });
        if (!res.ok) {
            // Check if it's one of our mock IDs
            const mock = MOCK_PRODUCTS.find(p => p.id === id);
            if (mock) return mock;
            return null;
        }
        return res.json();
    } catch (error) {
        const mock = MOCK_PRODUCTS.find(p => p.id === id);
        if (mock) return mock;
        return null;
    }
}

// Fallback Mock Data
const MOCK_PRODUCTS = [
    {
        id: '1',
        name: 'Brasil I 2024/25',
        description: 'A camisa oficial da Seleção Brasileira. Feita para performance e estilo, apresentando o clássico amarelo e verde com detalhes modernos.',
        basePrice: 349.90,
        team: { name: 'Seleção Brasileira' },
        brand: { name: 'Nike' },
        season: '2024/25',
        images: ['/placeholder-jersey.png'],
        variants: [
            { id: 'v1', size: 'P', stock: 5 },
            { id: 'v2', size: 'M', stock: 0 },
            { id: 'v3', size: 'G', stock: 2 },
            { id: 'v4', size: 'GG', stock: 10 }
        ]
    },
    {
        id: '2',
        name: 'Arsenal II 2024/25',
        description: 'O segundo uniforme do Arsenal retorna ao amarelo. Uma escolha clássica para os Gunners.',
        basePrice: 299.90,
        team: { name: 'Arsenal' },
        brand: { name: 'Adidas' },
        season: '2024/25',
        images: ['/placeholder-jersey.png'],
        variants: [{ id: 'v5', size: 'M', stock: 2 }, { id: 'v6', size: 'G', stock: 4 }]
    },
    {
        id: '3',
        name: 'Flamengo III 2023',
        description: 'O manto alternativo do Rubro-Negro Carioca.',
        basePrice: 199.90,
        team: { name: 'Flamengo' },
        brand: { name: 'Adidas' },
        season: '2023/24',
        images: ['/placeholder-jersey.png'],
        variants: [{ id: 'v7', size: 'G', stock: 0 }] // Out of stock
    }
];

export async function createOrder(orderData: any) {
    try {
        const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || 'Order failed');
        }

        return res.json();
    } catch (error) {
        throw error;
    }
}
