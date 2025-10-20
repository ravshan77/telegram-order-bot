import React, { useRef } from 'react'
import toast from 'react-hot-toast'
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
import {
    useNotApprovedOrder,
    useRegisterOrder,
    useAddOrderItem,
    useUpdateOrderItem,
    useDeleteOrderItem,
} from '@/entities/order'

interface ProductCardProps {
    product: ProductView
}

const APP_CDN = import.meta.env.VITE_APP_CDN

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const navigate = useNavigate()
    const setSelectedProduct = useCartStore((state) => state.setSelectedProduct)

    const { data: order, isPending } = useNotApprovedOrder()

    const registerOrder = useRegisterOrder()
    const addItem = useAddOrderItem()
    const updateItem = useUpdateOrderItem()
    const deleteItem = useDeleteOrderItem()

    const cardRef = useRef<HTMLDivElement>(null)
    const flyToCart = useFlyToCart('#cart-icon', { duration: 0.8, scale: 0.2 })

    const cartItem = order?.items?.find((item) => item.item.id === product.id)

    const goShowProduct = () => {
        setSelectedProduct(product)
        navigate(getProductPath(product.id))
    }

    const handleAddToCart = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        e.stopPropagation()

        try {
            if (!order) {
                // 1-product savatga qo'shilganda yangi order ochish uchun register qilinadi
                await registerOrder.mutateAsync({
                    items: [{ item_id: product.id, quantity: 1 }],
                })
            } else {
                // order bo'lsa savatga yangi product qo'shiladi
                await addItem.mutateAsync({
                    id: order.id,
                    item: { item_id: product.id, quantity: 1 },
                })
            }

            // animatsiya sabvtga
            if (cardRef.current) {
                flyToCart(cardRef.current)
            }

            toast.success('Товар добавлен в корзину')
        } catch (err: any) {
            toast.error(err.message || 'Ошибка при добавлении в корзину')
        }
    }

    const handleRemove = async (positionId: string) => {
        if (!order) return

        const confirmed = confirm(
            'Вы действительно собираетесь удалить этот продукт?',
        )

        if (!confirmed) return

        try {
            await deleteItem.mutateAsync({
                id: order.id,
                position_id: positionId,
            })
            toast.success('Товар удален из корзины')
        } catch (err: any) {
            toast.error(err.message || 'Ошибка при удалении товара')
        }
    }

    const handleUpdateQuantity = async (newQuantity: number) => {
        if (!order || !cartItem) return

        if (newQuantity === 0) {
            handleRemove(cartItem.id)
            return
        }

        try {
            await updateItem.mutateAsync({
                id: order.id,
                position_id: cartItem.id,
                item: {
                    item_id: product.id,
                    quantity: newQuantity,
                },
            })
        } catch (err: any) {
            toast.error(err.message || 'Ошибка при обновлении количества')
        }
    }

    const renderActionButton = () => {
        const isLoading =
            isPending ||
            registerOrder.isPending ||
            addItem.isPending ||
            updateItem.isPending

        // astatkalar 0 bo'lsa
        if (product?.stock === 0) {
            return (
                <p className="w-full justify-center flex items-center h-10 text-red-400 text-xs italic">
                    Товар нет в наличии
                </p>
            )
        }

        // +/- buttonlar
        if (cartItem) {
            return (
                <div className="flex items-center justify-between h-10 rounded border overflow-hidden">
                    <Button
                        variant="plain"
                        className="w-12 h-full flex items-center justify-center border-none outline-none"
                        icon={<Minus size={20} className="text-gray-700" />}
                        disabled={isLoading}
                        // loading={isLoading}
                        onClick={(e) => {
                            e.stopPropagation()
                            handleUpdateQuantity(cartItem.quantity - 1)
                        }}
                    />
                    <span className="text-base font-medium w-8 text-center">
                        {cartItem.quantity}
                    </span>
                    <Button
                        variant="plain"
                        className="w-12 h-full flex items-center justify-center border-none outline-none"
                        icon={<Plus size={20} className="text-gray-700" />}
                        disabled={isLoading}
                        onClick={(e) => {
                            e.stopPropagation()
                            handleUpdateQuantity(cartItem.quantity + 1)
                        }}
                    />
                </div>
            )
        }

        // yangi tavar qo'shish
        return (
            <Button
                variant="primary"
                type="button"
                className="w-full h-10 flex items-center justify-center rounded border"
                disabled={isLoading}
                onClick={handleAddToCart}
                // loading={isLoading}
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
            className=" max-w-44 rounded-lg overflow-hidden cursor-pointer border inset-shadow-2xs"
        >
            <div className="relative">
                <Swiper
                    modules={[Pagination]}
                    pagination={images.length > 1 ? { clickable: true } : false}
                    loop={images.length > 1}
                    className="product-card-swiper"
                    onClick={(_, event) => {
                        event.stopPropagation()
                    }}
                >
                    {images.length === 0 ? (
                        <SwiperSlide key={'0'}>
                            <div className="w-full h-48 flex items-center justify-center bg-gray-100">
                                <Image size={40} />
                            </div>
                        </SwiperSlide>
                    ) : images.length === 1 ? (
                        <SwiperSlide key={'0'}>
                            <img
                                src={images[0]}
                                loading="lazy"
                                alt={`${product.name}-1`}
                                className="w-full h-48 object-cover"
                            />
                        </SwiperSlide>
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
                <div className="flex gap-1 h-7">
                    {product.package_measurements?.map((pkg) => (
                        <div
                            key={pkg.name}
                            className="w-14 border flex justify-between items-center rounded-xl py-0 px-2"
                        >
                            <BoxSvg width={18} height={18} />
                            <span className="text-xs">{pkg.quantity}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-3">{renderActionButton()}</div>
            </div>
        </div>
    )
}
