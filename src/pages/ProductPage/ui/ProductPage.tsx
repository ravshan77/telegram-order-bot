import {
    useAddOrderItem,
    useRegisterOrder,
    useNotApprovedOrder,
    useUpdateOrderItem,
    useDeleteOrderItem,
} from '@/entities/order'
import { APP_CDN } from '@/shared/api'
import { Button } from '@/shared/ui/kit'
import { Image, Minus, Plus } from 'lucide-react'
import { useFlyToCart } from '@/shared/lib/hooks'
import { MeasurementType } from '@/shared/config'
import { BasketSvg, BoxSvg } from '@/shared/ui/svg'
import { ProductSection } from '@/widgets/ProductSection'
import { GoBack, ImageGallery } from '@/shared/ui/kit-pro'
import { useCartStore } from '@/shared/store/useCartStore'
import { numericFormat } from '@/shared/lib/numericFormat'
import React, { useEffect, useRef, useState } from 'react'
import { UpdateQuantityDrawer } from '@/widgets/UpdateQuantityDrawer'
import useBotConfigStore from '@/shared/store/useBotConfigStore'

export const ProductPage: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(-1)
    const selectedProduct = useCartStore((state) => state.selectedProduct)
    const [isOpenSheet, setIsOpenSheet] = useState(false)
    const { botConfigs } = useBotConfigStore()

    const { data: order } = useNotApprovedOrder()
    const registerOrder = useRegisterOrder()
    const addItem = useAddOrderItem()
    const updateItem = useUpdateOrderItem()
    const deleteItem = useDeleteOrderItem()

    if (!selectedProduct) return null

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        })
    }, [selectedProduct?.id])

    const cardRef = useRef<HTMLDivElement>(null)
    const flyToCart = useFlyToCart('#cart-icon', { duration: 0.8, scale: 0.2 })

    const handleAddToCart = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        e.stopPropagation()

        try {
            if (!order) {
                // 1-product savatga qo'shilganda yangi order ochish uchun register qilinadi
                await registerOrder.mutateAsync({
                    items: [{ item_id: selectedProduct.id, quantity: 1 }],
                })
            } else {
                // order bo'lsa savatga yangi product qo'shiladi
                await addItem.mutateAsync({
                    id: order.id,
                    item: { item_id: selectedProduct.id, quantity: 1 },
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
                    item_id: selectedProduct.id,
                    quantity: newQuantity,
                },
            })
        } catch (err: any) {
            console.log(err)
        }
    }

    const images = selectedProduct?.images?.map(
        (img) => `${APP_CDN}${img?.path}`,
    )

    const cartItem = order?.items
        ?.filter((item) => !item?.is_deleted)
        ?.find((item) => item.item.id === selectedProduct.id)

    const renderActionButton = () => {
        const isLoading =
            registerOrder.isPending || addItem.isPending || updateItem.isPending

        // astatkalar 0 bo'lsa
        if (botConfigs?.enable_order_with_available_items) {
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
                                selectedProduct?.package_measurements ?? []
                            }
                            measurement={selectedProduct?.measurement || 0}
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

    return (
        <div className="pb-16">
            <div className="bg-white w-full">
                <GoBack />
            </div>
            <div ref={cardRef} className="bg-white mt-4">
                {images?.length === 0 ? (
                    <div className="w-full flex justify-center">
                        <Image
                            size={40}
                            className="h-96 object-cover rounded-xl cursor-pointer 
                                    w-full sm:w-80 transition-all duration-300 border"
                        />
                    </div>
                ) : (
                    <ImageGallery
                        index={currentIndex}
                        onClose={() => setCurrentIndex(-1)}
                    >
                        <div className="flex overflow-x-auto gap-3">
                            {images?.length === 1 ? (
                                <div
                                    key={`${images[0]}-0`}
                                    className="flex-shrink-0 cursor-pointer w-full flex justify-center"
                                    onClick={() => setCurrentIndex(0)}
                                >
                                    <img
                                        src={images[0]}
                                        alt={`product-0`}
                                        className="rounded-xl h-96 object-cover overflow-hidden border border-gray-400"
                                    />
                                </div>
                            ) : (
                                images?.map((img, index) => (
                                    <div
                                        key={`${img}-${index}`}
                                        className="flex-shrink-0 cursor-pointer"
                                        onClick={() => setCurrentIndex(index)}
                                    >
                                        <img
                                            src={img}
                                            alt={`product-${index}`}
                                            className="rounded-xl h-96 w-80 object-cover border border-gray-400"
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    </ImageGallery>
                )}

                <div className="py-4">
                    <h1 className="text-base font-semibold mb-2">
                        {selectedProduct.name}
                    </h1>
                    <div className="flex gap-2 mb-4">
                        {selectedProduct.discount && (
                            <div className="w-12 max-w-16 py-0 px-2 flex justify-between items-center rounded-xl bg-red-100 text-red-600">
                                <span className="text-xs">
                                    -{selectedProduct.discount}%
                                </span>
                            </div>
                        )}
                        {botConfigs?.display_item_warehouse_states ? (
                            <div className="flex gap-1 items-center">
                                <BoxSvg width={16} height={16} /> Остаток:{' '}
                                {selectedProduct?.stock}{' '}
                                {selectedProduct?.measurement
                                    ? MeasurementType[
                                          selectedProduct?.measurement
                                      ]?.label
                                    : null}
                            </div>
                        ) : null}
                        {/* <div className="flex gap-1">
                            {selectedProduct.package_measurements?.map(
                                (pkg) => (
                                    <div
                                        key={pkg?.name}
                                        className="w-14 border flex justify-between items-center rounded-xl py-0 px-2"
                                    >
                                        <BoxSvg width={18} height={18} />
                                        <span className="text-xs text-gray-500">
                                            {pkg?.quantity}
                                        </span>
                                    </div>
                                ),
                            )}
                        </div> */}
                    </div>

                    <hr />

                    <div className="space-y-3 my-4">
                        <div className="flex justify-between">
                            <span className="text-black font-semibold text-base">
                                Особенность
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">
                                Единица измерения:
                            </span>
                            <span className="font-medium">
                                {
                                    MeasurementType[
                                        selectedProduct?.measurement
                                    ]?.label
                                }
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Артикул:</span>
                            <span className="font-medium">
                                {selectedProduct.sku
                                    ? selectedProduct.sku
                                    : 'Нет'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Код:</span>
                            <span className="font-medium">
                                {selectedProduct?.code
                                    ? selectedProduct?.code
                                    : 'Нет'}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-600">Упаковка</span>
                            <span className="font-medium space-x-2">
                                {selectedProduct?.package_measurements.length
                                    ? selectedProduct.package_measurements.map(
                                          (pkg, ind) => (
                                              <span key={`${pkg}-${ind}`}>
                                                  {`${pkg.name}=${pkg.quantity}`}
                                                  .{' '}
                                              </span>
                                          ),
                                      )
                                    : 'Нет'}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-600">Штрих-код:</span>
                            <span className="font-medium">
                                {selectedProduct?.barcodes.length === 0
                                    ? selectedProduct?.barcodes.join(', ')
                                    : 'Нет'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Описание: </span>
                            <span className="font-medium whitespace-pre-line pl-2">
                                {selectedProduct.description
                                    ? selectedProduct.description
                                    : 'Нет'}
                            </span>
                        </div>
                        {botConfigs?.display_item_prices ? (
                            <div className="flex p-4 rounded-md justify-between bg-primary-subtle ">
                                <span className="text-gray-600">
                                    Цена продажи:{' '}
                                </span>
                                <span className="text-base text-primary font-bold">
                                    {numericFormat(selectedProduct.price)} UZS
                                </span>
                            </div>
                        ) : null}
                    </div>

                    <hr />

                    <ProductSection title="Похожие товары" />
                </div>
            </div>

            {/* Bottom fixed bar */}
            <div className="fixed z-10 flex justify-between items-start bottom-0 h-20 left-0 right-0 py-2 px-4 bg-white border-t">
                {botConfigs?.display_item_prices ? (
                    <div>
                        <p className="text-primary font-bold ">
                            {numericFormat(selectedProduct.price)} UZS
                        </p>
                        <p className="text-xs font-light">Цена продажи</p>
                    </div>
                ) : null}
                <div>{renderActionButton()}</div>
            </div>
        </div>
    )
}
