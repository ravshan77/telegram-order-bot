import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ProductView } from '@/entities/product/model/types'

export interface CartItem extends ProductView {
    quantity: number
}

interface CartStore {
    // State
    cart: CartItem[]
    selectedProduct: ProductView | null
    setSelectedProduct: (product: ProductView | null) => void
    addToCart: (product: ProductView) => void
    removeFromCart: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            // Initial State
            cart: [],
            selectedProduct: null,
            setSelectedProduct: (product) => set({ selectedProduct: product }),
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
