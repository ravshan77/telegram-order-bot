import React from 'react'
import { Button } from '@/shared/ui/kit'
import type { Product } from '@/entities/product'
import { useCartStore } from '@/shared/store/useCartStore'

interface ProductCardProps {
    product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const setSelectedProduct = useCartStore((state) => state.setSelectedProduct)
    const setPage = useCartStore((state) => state.setPage)
    const addToCart = useCartStore((state) => state.addToCart)

    return (
        <div
            className="bg-white rounded-lg overflow-hidden cursor-pointer"
            onClick={() => {
                setSelectedProduct(product)
                setPage('product')
            }}
        >
            <div className="relative">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                />
                {product.discount && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        -{product.discount}%
                    </div>
                )}
            </div>
            <div className="p-3">
                <div className="text-cyan-600 font-bold text-lg">
                    {product.price.toLocaleString()} сўм
                </div>
                {product.oldPrice && (
                    <div className="text-gray-400 line-through text-sm">
                        {product.oldPrice.toLocaleString()} сўм
                    </div>
                )}
                <div className="text-sm text-gray-700 mt-2 line-clamp-2">
                    {product.name}
                </div>
                <Button
                    variant="plain"
                    onClick={(e) => {
                        e.stopPropagation()
                        addToCart(product)
                    }}
                    className="mt-3 w-full bg-cyan-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-cyan-600"
                >
                    в корзину
                </Button>
            </div>
        </div>
    )
}
