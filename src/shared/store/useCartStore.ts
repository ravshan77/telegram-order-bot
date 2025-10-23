import { create } from 'zustand'
import { ProductView } from '@/entities/product/model/types'

interface CartStore {
    selectedProduct: ProductView | null
    setSelectedProduct: (product: ProductView | null) => void
}

export const useCartStore = create<CartStore>((set) => ({
    selectedProduct: null,
    setSelectedProduct: (product) => set({ selectedProduct: product }),
}))
