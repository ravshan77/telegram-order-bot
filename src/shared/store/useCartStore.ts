import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product } from '@/entities/product'

export interface CartItem extends Product {
    quantity: number
}

export type PageType = 'main' | 'category' | 'product' | 'cart' | 'checkout'

interface CartStore {
    // State
    cart: CartItem[]
    page: PageType
    selectedCategory: string | null
    selectedProduct: Product | null
    menuOpen: boolean

    // Actions
    setPage: (page: PageType) => void
    setSelectedCategory: (category: string | null) => void
    setSelectedProduct: (product: Product | null) => void
    setMenuOpen: (open: boolean) => void
    addToCart: (product: Product) => void
    removeFromCart: (id: number) => void
    updateQuantity: (id: number, quantity: number) => void
    clearCart: () => void
    getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            // Initial State
            cart: [],
            page: 'main',
            selectedCategory: null,
            selectedProduct: null,
            menuOpen: false,

            // Actions
            setPage: (page) => set({ page }),

            setSelectedCategory: (category) =>
                set({ selectedCategory: category }),

            setSelectedProduct: (product) => set({ selectedProduct: product }),

            setMenuOpen: (open) => set({ menuOpen: open }),

            addToCart: (product) =>
                set((state) => {
                    const existingItem = state.cart.find(
                        (item) => item.id === product.id,
                    )

                    if (existingItem) {
                        return {
                            cart: state.cart.map((item) =>
                                item.id === product.id
                                    ? { ...item, quantity: item.quantity + 1 }
                                    : item,
                            ),
                        }
                    }

                    return {
                        cart: [...state.cart, { ...product, quantity: 1 }],
                    }
                }),

            removeFromCart: (id) =>
                set((state) => ({
                    cart: state.cart.filter((item) => item.id !== id),
                })),

            updateQuantity: (id, quantity) =>
                set((state) => {
                    if (quantity <= 0) {
                        return {
                            cart: state.cart.filter((item) => item.id !== id),
                        }
                    }

                    return {
                        cart: state.cart.map((item) =>
                            item.id === id ? { ...item, quantity } : item,
                        ),
                    }
                }),

            clearCart: () => set({ cart: [] }),

            getTotalPrice: () => {
                const state = get()
                return state.cart.reduce(
                    (sum, item) => sum + item.price * item.quantity,
                    0,
                )
            },
        }),
        {
            name: 'telegram-ecommerce-storage',
            partialize: (state) => ({ cart: state.cart }),
        },
    ),
)
