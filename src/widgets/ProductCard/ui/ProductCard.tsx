import {
    useAddOrderItem,
    useRegisterOrder,
    useUpdateOrderItem,
    useDeleteOrderItem,
    useNotApprovedOrder,
} from '@/entities/order'
import { APP_CDN } from '@/shared/api'
import { Button } from '@/shared/ui/kit'
import { Pagination } from 'swiper/modules'
import { useNavigate } from 'react-router-dom'
import React, { useRef, useState } from 'react'
import { ProductView } from '@/entities/product'
import { useFlyToCart } from '@/shared/lib/hooks'
import { Image, Minus, Plus } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { BasketSvg, BoxSvg } from '@/shared/ui/svg'
import { useCartStore } from '@/shared/store/useCartStore'
import { numericFormat } from '@/shared/lib/numericFormat'
import { getProductPath, MeasurementType } from '@/shared/config'
import { UpdateQuantityDrawer } from '@/widgets/UpdateQuantityDrawer'

interface ProductCardProps {
    product: ProductView
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const [isOpenSheet, setIsOpenSheet] = useState(false)
    const navigate = useNavigate()
    const setSelectedProduct = useCartStore((state) => state.setSelectedProduct)
    const { data: order, isPending } = useNotApprovedOrder()

    const registerOrder = useRegisterOrder()
    const addItem = useAddOrderItem()
    const updateItem = useUpdateOrderItem()
    const deleteItem = useDeleteOrderItem()

    const cardRef = useRef<HTMLDivElement>(null)
    const flyToCart = useFlyToCart('#cart-icon', { duration: 0.8, scale: 0.2 })

    const cartItem = order?.items
        ?.filter((item) => !item?.is_deleted)
        ?.find((item) => item?.item?.id === product?.id)

    const goShowProduct = () => {
        setSelectedProduct(product)
        navigate(getProductPath(product?.id))
    }

    const handleAddToCart = async (
        e:
            | React.MouseEvent<HTMLButtonElement, MouseEvent>
            | React.MouseEvent<HTMLDivElement, MouseEvent>,
        quantity?: number,
    ) => {
        e.stopPropagation()

        try {
            if (!order) {
                // 1-product savatga qo'shilganda yangi order ochish uchun register qilinadi
                await registerOrder.mutateAsync({
                    items: [
                        {
                            item_id: product.id,
                            quantity: quantity ? quantity : 1,
                        },
                    ],
                })
            } else {
                // order bo'lsa savatga yangi product qo'shiladi
                await addItem.mutateAsync({
                    id: order.id,
                    item: {
                        item_id: product.id,
                        quantity: quantity ? quantity : 1,
                    },
                })
            }

            // animatsiya sabvtga
            if (cardRef.current) {
                flyToCart(cardRef.current)
            }
        } catch (err: any) {
            console.log(err)
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
        } catch (err: any) {
            console.log(err)
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
            console.log(err)
        }
    }

    // const handlePackageQuantity = useCallback(
    //     (
    //         e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    //         pkg_quantity: number,
    //     ) => {
    //         const is_cart = cartItem?.quantity ? cartItem?.quantity : 0
    //         if (cartItem) {
    //             handleUpdateQuantity(is_cart + pkg_quantity)
    //         } else {
    //             handleAddToCart(e, pkg_quantity)
    //         }
    //     },
    //     [product],
    // )

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
                <>
                    {isOpenSheet && (
                        <UpdateQuantityDrawer
                            isOpen={isOpenSheet}
                            quantity={cartItem?.quantity}
                            setIsOpen={setIsOpenSheet}
                            updateQuantity={handleUpdateQuantity}
                            package_measurements={
                                product?.package_measurements ?? []
                            }
                            measurement={product?.measurement || 0}
                        />
                    )}
                    <div className="flex items-center justify-between h-10 rounded border overflow-hidden">
                        <Button
                            variant="plain"
                            className="w-12 h-full flex items-center justify-center border-none outline-none"
                            icon={<Minus size={20} className="text-gray-700" />}
                            onClick={(e) => {
                                e.stopPropagation()
                                handleUpdateQuantity(cartItem.quantity - 1)
                            }}
                        />
                        <span
                            className="text-base font-medium w-8 text-center"
                            onClick={() => setIsOpenSheet(true)}
                        >
                            {cartItem.quantity}
                        </span>
                        <Button
                            variant="plain"
                            className="w-12 h-full flex items-center justify-center border-none outline-none"
                            icon={<Plus size={20} className="text-gray-700" />}
                            onClick={(e) => {
                                e.stopPropagation()
                                handleUpdateQuantity(cartItem.quantity + 1)
                            }}
                        />
                    </div>
                </>
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

    const images = product?.images?.map((img) => `${APP_CDN}${img?.path}`)

    return (
        <div
            ref={cardRef}
            className="max-w-44 rounded-lg overflow-hidden cursor-pointer border inset-shadow-2xs"
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
                {product?.discount && (
                    <div className="absolute bottom-0 left-0 bg-red-500 text-white px-2 py-1 rounded-se-lg text-xs font-bold">
                        -{product?.discount}%
                    </div>
                )}
            </div>

            <div className="p-3">
                <div className="text-primary font-bold text-sm">
                    {numericFormat(product.price)} {product.currency.name}
                </div>
                <div
                    className="text-sm text-black mt-2 line-clamp-2 h-11"
                    onClick={goShowProduct}
                >
                    {product.name}
                </div>
                <div className="flex gap-1 items-center">
                    <BoxSvg width={16} height={16} /> Остаток: {product?.stock}{' '}
                    {product?.measurement
                        ? MeasurementType[product?.measurement]?.label
                        : null}
                </div>
                {/* {!(product?.stock === 0) ? (
                    <div className="flex gap-1 h-7 border">
                        {product.package_measurements?.map((pkg) => (
                            <div
                                key={pkg.name}
                                className="w-14 border flex justify-between items-center rounded-xl py-0 px-2"
                                onClick={(e) =>
                                    handlePackageQuantity(e, pkg.quantity)
                                }
                            >
                                <BoxSvg width={18} height={18} />
                                <span className="text-xs">{pkg.quantity}</span>
                            </div>
                        ))}
                    </div>
                ) : null} */}
                <div className="mt-3">{renderActionButton()}</div>
            </div>
        </div>
    )
}
