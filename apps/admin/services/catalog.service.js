
import { authService } from './auth.service';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const catalogService = {
    // Temporary mock until we build the Teams/Brands API endpoints
    async getTeams() {
        const token = authService.getToken();
        const response = await fetch(`${API_URL}/products/teams`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch teams');
        }

        return response.json();
    },

    async getBrands() {
        const token = authService.getToken();
        const response = await fetch(`${API_URL}/products/brands`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch brands');
        }

        return response.json();
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
    },

    async deleteProduct(id) {
        const token = authService.getToken();
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete product');
        }

        return response.json();
    }
};
