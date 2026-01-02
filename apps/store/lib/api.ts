// Backend API Endpoint
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getProducts(params = {}) {
    try {
        const queryParams = new URLSearchParams(params as any).toString();
        const res = await fetch(`${API_URL}/products?${queryParams}`, {
            cache: 'no-store',
        });

        if (!res.ok) {
            throw new Error('Failed to fetch products');
        }

        return res.json();
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
}

export async function getProductById(id: string) {
    try {
        const res = await fetch(`${API_URL}/products/${id}`, { cache: 'no-store' });
        if (!res.ok) {
            return null;
        }
        return res.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}

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

