import React, { useState } from 'react'
import { Button } from '@/shared/ui/kit'
import { BoxSvg } from '@/shared/ui/svg'
import { products } from '@/entities/product'
import { useNavigate } from 'react-router-dom'
import { getBasketPath } from '@/shared/config'
import { ProductCard } from '@/widgets/ProductCard'
import { GoBack, ImageGallery } from '@/shared/ui/kit-pro'
import { useCartStore } from '@/shared/store/useCartStore'

export const ProductPage: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(-1)
    const selectedProduct = useCartStore((state) => state.selectedProduct)
    const addToCart = useCartStore((state) => state.addToCart)
    const navigate = useNavigate()

    if (!selectedProduct) return null

    const slides = [
        {
            src: selectedProduct.image,
        },
    ]

    const isSingle = slides.length === 1

    return (
        <div className="pb-16">
            {/* Header */}
            <div className="bg-white w-full">
                <GoBack />
            </div>

            {/* Image gallery */}
            <div className="bg-white mt-4">
                <ImageGallery
                    index={currentIndex}
                    slides={slides.map((img) => ({ src: img.src }))}
                    onClose={() => setCurrentIndex(-1)}
                >
                    {isSingle ? (
                        <div className="w-full flex justify-center">
                            <img
                                src={slides[0].src}
                                alt="product"
                                className={`rounded-xl h-96 object-cover cursor-pointer 
                                    w-full sm:w-80 transition-all duration-300`}
                                onClick={() => setCurrentIndex(0)}
                            />
                        </div>
                    ) : (
                        <div className="flex overflow-x-auto gap-3">
                            {slides.map((img, index) => (
                                <div
                                    key={`${img.src}-${index}`}
                                    className="flex-shrink-0 cursor-pointer"
                                    onClick={() => setCurrentIndex(index)}
                                >
                                    <img
                                        src={img.src}
                                        alt={`product-${index}`}
                                        className="rounded-xl h-96 w-80 object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </ImageGallery>

                {/* Product info */}
                <div className="py-4">
                    <h1 className="text-base font-semibold mb-2">
                        {selectedProduct.name}
                    </h1>
                    <div className="flex gap-2 mb-4">
                        <div className="w-14 border flex justify-between items-center rounded-xl py-0 px-2">
                            <BoxSvg width={18} height={18} />
                            <span className="text-xs text-gray-500">24</span>
                        </div>
                        <div className="w-12 max-w-16 py-0 px-2 flex justify-between items-center rounded-xl bg-red-100 text-red-600">
                            <span className="text-xs">
                                -{selectedProduct.discount}%
                            </span>
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
                                Складовый учёт товара:
                            </span>
                            <span className="font-medium">Нет</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">
                                Единица измерения:
                            </span>
                            <span className="font-medium">Килограм</span>
                        </div>
                        {selectedProduct.article && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Артикул:</span>
                                <span className="font-medium">
                                    {selectedProduct.article}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-gray-600">Код:</span>
                            <span className="font-medium">#859086</span>
                        </div>
                        {selectedProduct.package && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Упаковка</span>
                                <span className="font-medium">
                                    {selectedProduct.package}
                                </span>
                            </div>
                        )}
                        {selectedProduct.barcode && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    Штрих-код:
                                </span>
                                <span className="font-medium">
                                    {selectedProduct.barcode}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-gray-600">
                                Единица измерения:
                            </span>
                            <span className="font-medium">194765</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">ИКПУ:</span>
                            <span className="font-medium">
                                пачка=1000 грамм
                            </span>
                        </div>
                        {selectedProduct.nds && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">НДС:</span>
                                <span className="font-medium">
                                    {selectedProduct.nds}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-gray-600">Описание: </span>
                            <span className="font-medium">Не указано</span>
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

                    <h3 className="text-black font-semibold text-base my-4">
                        Похожие товары
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {products
                            .filter((p) => p.id !== selectedProduct.id)
                            .slice(0, 2)
                            .map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                    </div>
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
