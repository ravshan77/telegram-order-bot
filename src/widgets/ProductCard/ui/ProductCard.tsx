import React from 'react'
import { Button } from '@/shared/ui/kit'
import type { Product } from '@/entities/product'
import { useCartStore } from '@/shared/store/useCartStore'
import { BoxSvg } from '@/shared/ui/svg'

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
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-xl text-xs font-bold">
                        -{product.discount}%
                    </div>
                )}
            </div>
            <div className="p-3">
                <div className="text-cyan-500 font-bold text-sm">
                    {product.price.toLocaleString()} сўм
                </div>
                {/* {product.oldPrice && (
                    <div className="text-gray-400 line-through text-sm">
                        {product.oldPrice.toLocaleString()} сўм
                    </div>
                )} */}
                <div className="text-sm text-black mt-2 line-clamp-2">
                    {product.name}
                </div>
                <div className="flex gap-2">
                    <div className="w-14 max-w-16 py-0 px-2 mt-2 flex justify-between items-center rounded-xl bg-red-100 text-red-600">
                        <span>-{product.discount}%</span>
                    </div>
                    <div className="w-14 mt-2 border flex justify-between items-center rounded-xl py-0 px-2">
                        <BoxSvg width={18} height={18} />
                        <span>24</span>
                    </div>
                </div>
                <Button
                    variant="plain"
                    className="mt-3 w-full bg-cyan-100 text-cyan-500 py-2 rounded-lg text-base font-medium hover:bg-cyan-200"
                    onClick={(e) => {
                        e.stopPropagation()
                        addToCart(product)
                    }}
                >
                    в корзину
                </Button>
            </div>
        </div>
    )
}
