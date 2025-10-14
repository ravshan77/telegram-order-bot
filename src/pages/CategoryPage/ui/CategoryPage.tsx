import { Tabs } from '@/shared/ui/kit'
import { GoBack } from '@/shared/ui/kit-pro'
import { products } from '@/entities/product'
import { useNavigate } from 'react-router-dom'
import React, { useRef, useState } from 'react'
import TabNav from '@/shared/ui/kit/Tabs/TabNav'
import TabList from '@/shared/ui/kit/Tabs/TabList'
import { ProductCard } from '@/widgets/ProductCard'
import TabContent from '@/shared/ui/kit/Tabs/TabContent'

export const CategoryPage: React.FC = () => {
    const temporarily_category = 'Электроника'
    const [currentTab, setCurrentTab] = useState(temporarily_category)

    const subCategoryTabFilter = () =>
        products.filter((p) => p.category === currentTab)

    const navigate = useNavigate()
    const goBack = () => navigate(-1)

    const touchStartX = useRef<number | null>(null)
    const touchEndX = useRef<number | null>(null)

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX
    }

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX
    }

    const handleTouchEnd = () => {
        if (touchStartX.current !== null && touchEndX.current !== null) {
            const diff = touchEndX.current - touchStartX.current

            // 👇 Faqat chapdan o‘ngga harakat bo‘lsa
            if (diff > 80) {
                goBack() // ortga qaytish
            }
        }

        // qiymatlarni tozalash
        touchStartX.current = null
        touchEndX.current = null
    }

    return (
        <div
            className="pb-16"
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            onTouchStart={handleTouchStart}
        >
            <div>
                <div className="bg-white w-full">
                    <GoBack text={temporarily_category} />
                </div>

                <div className="">
                    <Tabs value={currentTab} onChange={setCurrentTab}>
                        <TabList>
                            <TabNav value="Электроника" className="min-w-max">
                                Все товары
                            </TabNav>
                            <TabNav value="Смартфоны" className="min-w-max">
                                Смартфоны
                            </TabNav>
                            <TabNav value="Гаджеты" className="min-w-max">
                                Телевизор
                            </TabNav>
                            <TabNav value="Аксессуары" className="min-w-max">
                                Aксессуары
                            </TabNav>
                            <TabNav
                                value="Компьютерные аксессуары"
                                className="min-w-max"
                            >
                                Компьютерные аксессуары
                            </TabNav>
                            <TabNav value="Игры">Игры</TabNav>
                        </TabList>
                        <div className="py-4">
                            <TabContent value="Электроника">
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    {subCategoryTabFilter().map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                        />
                                    ))}
                                </div>
                            </TabContent>
                            <TabContent value="Смартфоны">
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    {subCategoryTabFilter().map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                        />
                                    ))}
                                </div>
                            </TabContent>
                            <TabContent value="Гаджеты">
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    {subCategoryTabFilter().map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                        />
                                    ))}
                                </div>
                            </TabContent>
                            <TabContent value="Аксессуары">
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    {subCategoryTabFilter().map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                        />
                                    ))}
                                </div>
                            </TabContent>
                            <TabContent value="Компьютерные аксессуары">
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    {subCategoryTabFilter().map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                        />
                                    ))}
                                </div>
                            </TabContent>
                            <TabContent value="Игры">
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    {subCategoryTabFilter().map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                        />
                                    ))}
                                </div>
                            </TabContent>
                        </div>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
