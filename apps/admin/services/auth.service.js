
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:3001'; // In prod, use env variable
const TOKEN_KEY = 'admin_access_token';

export const authService = {
    async login(email, password) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }

            const data = await response.json();
            if (data.access_token) {
                Cookies.set(TOKEN_KEY, data.access_token, { expires: 1, secure: true, sameSite: 'strict' });
                return data.user;
            }
        } catch (error) {
            throw error;
        }
    },

    setAuthToken(token) {
        Cookies.set(TOKEN_KEY, token, { expires: 1, secure: true, sameSite: 'strict' });
    },

    logout() {
        Cookies.remove(TOKEN_KEY);
        window.location.href = '/login';
    },

    getToken() {
        return Cookies.get(TOKEN_KEY);
    },

    isAuthenticated() {
        return !!this.getToken();
    }
};
