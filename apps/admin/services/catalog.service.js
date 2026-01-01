
import { authService } from './auth.service';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const catalogService = {
    // Temporary mock until we build the Teams/Brands API endpoints
    async getTeams() {
        // In real app: return authService.fetch('/teams');
        return [
            { id: 'team_brazil_uuid_from_seed', name: 'Brazil National Team' },
            { id: 'team_arsenal_uuid_from_seed', name: 'Arsenal FC' },
            { id: 'team_flamengo_uuid', name: 'Flamengo' },
        ];
    },

    async getBrands() {
        // In real app: return authService.fetch('/brands');
        return [
            { id: 'brand_nike_uuid', name: 'Nike' },
            { id: 'brand_adidas_uuid', name: 'Adidas' },
            { id: 'brand_puma_uuid', name: 'Puma' },
        ];
    },

    async getProducts() {
        const token = authService.getToken();
        const response = await fetch(`${API_URL}/products`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        return response.json();
    },

    async createProduct(productData) {
        const token = authService.getToken();
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create product');
        }

        return response.json();
    }
};
