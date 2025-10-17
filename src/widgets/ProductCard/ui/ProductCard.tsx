import React, { useRef } from 'react'
import { Button } from '@/shared/ui/kit'
import { Pagination } from 'swiper/modules'
import { useNavigate } from 'react-router-dom'
import { getProductPath } from '@/shared/config'
import { useFlyToCart } from '@/shared/lib/hooks'
import { Image, Minus, Plus } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { BasketSvg, BoxSvg } from '@/shared/ui/svg'
import { useCartStore } from '@/shared/store/useCartStore'
import { ProductView } from '@/entities/product/model/types'

interface ProductCardProps {
    product: ProductView
}
const APP_CDN = import.meta.env.VITE_APP_CDN

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const navigate = useNavigate()
    const addToCart = useCartStore((state) => state.addToCart)
    const setSelectedProduct = useCartStore((state) => state.setSelectedProduct)
    const updateQuantity = useCartStore((state) => state.updateQuantity)
    const isExistInCart = useCartStore((state) =>
        state.cart?.find((item) => item?.id === product?.id),
    )

    const cardRef = useRef<HTMLDivElement>(null)
    const flyToCart = useFlyToCart('#cart-icon', { duration: 0.8, scale: 0.2 })

    const goShowProduct = () => {
        setSelectedProduct(product)
        navigate(getProductPath(product.id))
    }

    const handleAddToCart = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        if (cardRef.current) {
            flyToCart(cardRef.current)
            e.stopPropagation()
            addToCart(product)
        }
    }

    const renderActionButton = () => {
        // Товар нет в наличии
        if (product?.stock === 0) {
            return (
                <p className="w-full justify-center flex items-center h-10 text-red-400 text-xs italic">
                    Товар нет в наличии
                </p>
            )
        }
        // В корзине или нет
        if (isExistInCart) {
            return (
                <div className="flex items-center justify-between h-10 rounded border overflow-hidden">
                    <Button
                        variant="plain"
                        className="w-12 h-full flex items-center justify-center border-none outline-none"
                        icon={<Minus size={20} className="text-gray-700" />}
                        onClick={(e) => {
                            e.stopPropagation()
                            updateQuantity(
                                isExistInCart.id,
                                isExistInCart.quantity - 1,
                            )
                        }}
                    />
                    <span className="text-base font-medium w-8 text-center">
                        {isExistInCart.quantity}
                    </span>
                    <Button
                        variant="plain"
                        className="w-12 h-full flex items-center justify-center border-none outline-none"
                        icon={<Plus size={20} className="text-gray-700" />}
                        onClick={(e) => {
                            e.stopPropagation()
                            updateQuantity(
                                isExistInCart.id,
                                isExistInCart.quantity + 1,
                            )
                        }}
                    />
                </div>
            )
        }
        // В корзину
        return (
            <Button
                variant="primary"
                type="button"
                className="w-full h-10 flex items-center justify-center rounded border"
                onClick={handleAddToCart}
            >
                <span className="text-base font-medium flex items-center gap-2">
                    в корзину <BasketSvg width={20} height={20} />
                </span>
            </Button>
        )
    }

    const images = product.images.map((img) => `${APP_CDN}${img.path}`)

    return (
        <div
            ref={cardRef}
            className="min-w-48 rounded-lg overflow-hidden cursor-pointer border inset-shadow-2xs"
        >
            <div className="relative">
                {images.length > 0 ? (
                    <Swiper
                        modules={[Pagination]}
                        pagination={
                            images.length > 1 ? { clickable: true } : false
                        }
                        loop={images.length > 1}
                        className="product-card-swiper"
                        onClick={(_, event) => {
                            event.stopPropagation()
                        }}
                    >
                        {images.length === 1 ? (
                            <img
                                src={images[0]}
                                loading="lazy"
                                alt={`${product.name}-1`}
                                className="w-full h-48 object-cover"
                            />
                        ) : (
                            images.map((image, index) => (
                                <SwiperSlide key={index}>
                                    <img
                                        src={image}
                                        loading="lazy"
                                        alt={`${product.name} - ${index + 1}`}
                                        className="w-full h-48 object-cover"
                                    />
                                </SwiperSlide>
                            ))
                        )}
                    </Swiper>
                ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gray-100">
                        <Image size={40} className="text-gray-400" />
                    </div>
                )}
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
                <div
                    className="text-sm text-black mt-2 line-clamp-2 h-11"
                    onClick={goShowProduct}
                >
                    {product.name}
                </div>
                <div className="flex gap-1">
                    {product.package_measurements?.map((pkg) => (
                        <div
                            key={pkg.name}
                            className="w-14 mt-2 border flex justify-between items-center rounded-xl py-0 px-2"
                        >
                            <BoxSvg width={18} height={18} />
                            <span>{pkg.quantity}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-3">{renderActionButton()}</div>
            </div>
        </div>
    )
}
