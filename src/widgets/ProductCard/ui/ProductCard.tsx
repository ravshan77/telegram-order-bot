import { Button } from '@/shared/ui/kit'
import { Minus, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getProductPath } from '@/shared/config'
import type { Product } from '@/entities/product'
import { useFlyToCart } from '@/shared/lib/hooks'
import React, { useCallback, useRef } from 'react'
import { BasketSvg, BoxSvg } from '@/shared/ui/svg'
import { useCartStore } from '@/shared/store/useCartStore'

interface ProductCardProps {
    product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const navigate = useNavigate()
    const addToCart = useCartStore((state) => state.addToCart)
    const setSelectedProduct = useCartStore((state) => state.setSelectedProduct)
    const updateQuantity = useCartStore((state) => state.updateQuantity)
    const isExistInCart = useCartStore((state) =>
        state.cart.find((item) => item.id === product.id),
    )

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
            e.stopPropagation()
            addToCart(product)
        }
    }

    const take = () => {
        // Товар нет в наличии
        if (product?.not_available) {
            return (
                <p className="w-full justify-center flex items-center h-10 text-red-400 text-xs italic">
                    Товар нет в наличии
                </p>
            )
        }
        // В корзине или нет
        if (isExistInCart) {
            return (
                <div className="flex items-center justify-between gap-3 border rounded">
                    <Button
                        className="w-12 h-10 rounded-lg flex items-center p-0 justify-center border-none"
                        onClick={(e) => {
                            e.stopPropagation()
                            updateQuantity(
                                isExistInCart.id,
                                isExistInCart.quantity - 1,
                            )
                        }}
                    >
                        <Minus size={16} className="text-gray-700" />
                    </Button>
                    <span className="text-base font-medium w-8 text-center">
                        {isExistInCart.quantity}
                    </span>
                    <Button
                        className="w-12 h-10 rounded-lg flex items-center p-0 justify-center border-none"
                        onClick={(e) => {
                            e.stopPropagation()
                            updateQuantity(
                                isExistInCart.id,
                                isExistInCart.quantity + 1,
                            )
                        }}
                    >
                        <Plus size={16} className="text-gray-700" />
                    </Button>
                </div>
            )
        }
        // В корзину
        return (
            <Button
                variant="primary"
                type="button"
                className="w-full p-2 h-10 rounded"
                onClick={handleAddToCart}
            >
                <div className="flex items-center justify-center text-base font-medium p-0 m-0">
                    в корзину &nbsp; <BasketSvg width={20} height={20} />
                </div>
            </Button>
        )
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
                <div className="text-sm text-black mt-2 line-clamp-2">
                    {product.name}
                </div>
                <div className="w-14 mt-2 border flex justify-between items-center rounded-xl py-0 px-2">
                    <BoxSvg width={18} height={18} />
                    <span>24</span>
                </div>
                <div className="mt-3">{take()}</div>
            </div>
        </div>
    )
}
