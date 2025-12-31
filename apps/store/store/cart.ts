
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    productId: string;
    variantId: string;
    name: string;
    price: number;
    size: string;
    image: string;
    team: string;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isCartOpen: boolean;
    addToCart: (item: CartItem) => void;
    removeFromCart: (variantId: string) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getItemCount: () => number;
    openCart: () => void;
    closeCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isCartOpen: false,

            openCart: () => set({ isCartOpen: true }),
            closeCart: () => set({ isCartOpen: false }),

            addToCart: (newItem) => set((state) => {
                const existingItem = state.items.find(
                    item => item.variantId === newItem.variantId
                );

                // Auto-open cart on add
                const newState = { isCartOpen: true } as any;

                if (existingItem) {
                    newState.items = state.items.map(item =>
                        item.variantId === newItem.variantId
                            ? { ...item, quantity: item.quantity + newItem.quantity }
                            : item
                    );
                } else {
                    newState.items = [...state.items, newItem];
                }

                return newState;
            }),

            removeFromCart: (variantId) => set((state) => ({
                items: state.items.filter(item => item.variantId !== variantId)
            })),

            clearCart: () => set({ items: [] }),

            getCartTotal: () => {
                return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
            },

            getItemCount: () => {
                return get().items.reduce((count, item) => count + item.quantity, 0);
            }
        }),
        {
            name: 'jersey-store-cart', // key in localStorage
            partialize: (state) => ({ items: state.items }), // Don't persist UI state (isOpen)
        }
    )
);
