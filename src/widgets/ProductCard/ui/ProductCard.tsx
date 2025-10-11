import { Button } from '@/shared/ui/kit'
import React, { useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProductPath } from '@/shared/config'
import type { Product } from '@/entities/product'
import { BasketSvg, BoxSvg } from '@/shared/ui/svg'
import { useCartStore } from '@/shared/store/useCartStore'
import { useFlyToCart } from '@/shared/lib/hooks'

interface ProductCardProps {
    product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const navigate = useNavigate()
    const addToCart = useCartStore((state) => state.addToCart)
    const setSelectedProduct = useCartStore((state) => state.setSelectedProduct)

    const cardRef = useRef<HTMLDivElement>(null)
    const flyToCart = useFlyToCart('#cart-icon', { duration: 0.8, scale: 0.2 })

    const goShowProduct = useCallback(() => {
        setSelectedProduct(product)
        navigate(getProductPath(product.id))
    }, [navigate, product.id])

    const handleAddToCart = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        if (cardRef.current) {
            flyToCart(cardRef.current)
            // bu yerda savatchaga +1 qilish logikasi
            e.stopPropagation()
            addToCart(product)
            console.log(`${product.name} added to cart!`)
        }
    }

    return (
        <div
            ref={cardRef}
            className="rounded-lg overflow-hidden cursor-pointer border inset-shadow-2xs"
            onClick={goShowProduct}
        >
            <div className="relative">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                />
                {product.discount && (
                    <div className="absolute bottom-0 left-0 bg-red-500 text-white px-2 py-1 rounded-se-lg text-xs font-bold">
                        -{product.discount}%
                    </div>
                )}
            </div>
            <div className="p-3">
                <div className="text-primary font-bold text-sm">
                    {product.price.toLocaleString()} UZS
                </div>
                {/* {product.oldPrice && (
                    <div className="text-gray-400 line-through text-sm">
                        {product.oldPrice.toLocaleString()} сўм
                    </div>
                )} */}
                <div className="text-sm text-black mt-2 line-clamp-2">
                    {product.name}
                </div>
                {/* <div className="flex gap-2"> */}
                {/* <div className="w-14 max-w-16 py-0 px-2 mt-2 flex justify-between items-center rounded-xl bg-red-100 text-red-600">
                        <span>-{product.discount}%</span>
                    </div> */}
                <div className="w-14 mt-2 border flex justify-between items-center rounded-xl py-0 px-2">
                    <BoxSvg width={18} height={18} />
                    <span>24</span>
                </div>
                {/* </div> */}
                <Button
                    variant="primary"
                    type="button"
                    className="mt-3 w-full p-2 "
                    onClick={handleAddToCart}
                >
                    <div className="flex items-center justify-center text-base font-medium p-0 m-0">
                        в корзину &nbsp; <BasketSvg width={20} height={20} />
                    </div>
                </Button>
            </div>
        </div>
    )
}
