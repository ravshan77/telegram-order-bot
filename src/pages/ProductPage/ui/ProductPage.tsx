import React, { useState } from 'react'
import { Button } from '@/shared/ui/kit'
import { products } from '@/entities/product'
import { ProductCard } from '@/widgets/ProductCard'
import { useCartStore } from '@/shared/store/useCartStore'
import { ImageGallery } from '@/shared/ui/kit-pro'
import { useNavigate } from 'react-router-dom'

export const ProductPage: React.FC = () => {
    const selectedProduct = useCartStore((state) => state.selectedProduct)
    const setPage = useCartStore((state) => state.setPage)
    const addToCart = useCartStore((state) => state.addToCart)
    const naviagte = useNavigate()

    if (!selectedProduct) return null
    //! shu yerda rasmlarni quyishda tuxtadim
    const slides = [
        {
            src: 'https://picsum.photos/id/1018/1000/600/',
            title: 'test',
            thumbnail: 'https://picsum.photos/id/1018/250/150/',
        },
        {
            src: 'https://picsum.photos/id/1015/1000/600/',
            title: 'test',
            thumbnail: 'https://picsum.photos/id/1015/250/150/',
        },
        {
            src: 'https://picsum.photos/id/1019/1000/600/',
            title: 'test',
            thumbnail: 'https://picsum.photos/id/1019/250/150/',
        },
    ]

    const [currentIndex, setCurrentIndex] = useState(-1)

    return (
        <div className="pb-24">
            <div className="bg-white p-4 border-b sticky top-14 z-10">
                <Button
                    variant="plain"
                    className="text-cyan-500"
                    onClick={() => naviagte(-1)}
                >
                    Назад
                </Button>
            </div>

            <div className="bg-white">
                {/* <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-80 object-cover"
                /> */}
                <ImageGallery
                    index={currentIndex}
                    slides={
                        slides?.map((img) => {
                            return {
                                src: img.src,
                            }
                        }) || []
                    }
                    onClose={() => setCurrentIndex(-1)}
                >
                    <div className="grid grid-cols-3 gap-2">
                        {slides?.map((img, index) => (
                            <div
                                key={img.title}
                                data-src={img.src}
                                className="cursor-pointer overflow-auto flex gap-4"
                                role="button"
                                onClick={() => setCurrentIndex(index)}
                            >
                                <img
                                    className="rounded-xl h-96 min-w-80"
                                    src={img.src}
                                />
                            </div>
                        ))}
                    </div>
                </ImageGallery>
                <div className="p-4">
                    <h1 className="text-lg font-semibold mb-4">
                        {selectedProduct.name}
                    </h1>

                    <div className="space-y-3 mb-6">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Особенность</span>
                            <span className="font-medium">Нет</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">
                                Единица измерения
                            </span>
                            <span className="font-medium">Килограм</span>
                        </div>
                        {selectedProduct.article && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Артикул</span>
                                <span className="font-medium">
                                    {selectedProduct.article}
                                </span>
                            </div>
                        )}
                        {selectedProduct.color && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">Цвет</span>
                                <span className="font-medium">
                                    {selectedProduct.color}
                                </span>
                            </div>
                        )}
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
                                <span className="text-gray-600">Штрихкод</span>
                                <span className="font-medium">
                                    {selectedProduct.barcode}
                                </span>
                            </div>
                        )}
                        {selectedProduct.nds && (
                            <div className="flex justify-between">
                                <span className="text-gray-600">НДС</span>
                                <span className="font-medium">
                                    {selectedProduct.nds}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-gray-600">Описание</span>
                            <span className="font-medium">Не указано</span>
                        </div>
                    </div>

                    <div className="text-cyan-600 font-bold text-2xl mb-2">
                        {selectedProduct.price.toLocaleString()} сўм
                    </div>
                    <div className="text-sm text-gray-500 mb-1">
                        Цена продажи
                    </div>

                    <h3 className="text-base font-semibold mt-6 mb-3">
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

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold">
                        {selectedProduct.price.toLocaleString()} сўм
                    </span>
                </div>
                <Button
                    variant="plain"
                    onClick={() => {
                        addToCart(selectedProduct)
                        setPage('cart')
                    }}
                    className="w-full bg-cyan-500 text-white py-3 rounded-lg font-medium"
                >
                    в корзину
                </Button>
            </div>
        </div>
    )
}
