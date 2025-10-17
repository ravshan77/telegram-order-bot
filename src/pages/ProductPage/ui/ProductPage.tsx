import { Image } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '@/shared/ui/kit'
import { BoxSvg } from '@/shared/ui/svg'
import { useNavigate } from 'react-router-dom'
import { getBasketPath } from '@/shared/config'
import { GoBack, ImageGallery } from '@/shared/ui/kit-pro'
import { useCartStore } from '@/shared/store/useCartStore'
import { ProductSection } from '@/features/ProductSection'

const APP_CDN = import.meta.env.VITE_APP_CDN

export const ProductPage: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(-1)
    const selectedProduct = useCartStore((state) => state.selectedProduct)
    const addToCart = useCartStore((state) => state.addToCart)
    const navigate = useNavigate()

    const images = selectedProduct?.images.map((img) => `${APP_CDN}${img.path}`)

    if (!selectedProduct) return null

    return (
        <div className="pb-16">
            {/* Header */}
            <div className="bg-white w-full">
                <GoBack />
            </div>

            {/* Image gallery */}
            <div className="bg-white mt-4">
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
                                        className="rounded-xl h-96 object-cover border-red-500"
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
                                            className="rounded-xl h-96 w-80 object-cover border"
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    </ImageGallery>
                )}

                {/* Product info */}
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
                        <div className="flex gap-1">
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
                        </div>
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
                                {selectedProduct.measurement}
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
                            <span className="font-medium">
                                {selectedProduct?.package_measurements.length
                                    ? selectedProduct.package_measurements.join(
                                          ', ',
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
                        <div className="flex p-4 rounded-md justify-between bg-primary-subtle ">
                            <span className="text-gray-600">
                                Цена продажи:{' '}
                            </span>
                            <span className="text-base text-primary font-bold">
                                {selectedProduct.price.toLocaleString()} UZS
                            </span>
                        </div>
                    </div>

                    <hr />

                    <ProductSection title="Похожие товары" />
                </div>
            </div>

            {/* Bottom fixed bar */}
            <div className="fixed flex justify-between items-start bottom-0 h-20 left-0 right-0 py-2 px-4 bg-white border-t">
                <div>
                    <p className="text-primary font-bold">
                        {selectedProduct.price.toLocaleString()} UZS
                    </p>
                    <p className="text-xs font-light">Цена продажи</p>
                </div>
                <Button
                    variant="solid"
                    className="w-auto min-w-32 rounded-lg font-medium"
                    onClick={() => {
                        addToCart(selectedProduct)
                        navigate(getBasketPath())
                    }}
                >
                    в корзину
                </Button>
            </div>
        </div>
    )
}
