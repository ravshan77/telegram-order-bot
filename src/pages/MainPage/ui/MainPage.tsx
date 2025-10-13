import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/shared/ui/kit'
import { ChevronRight } from 'lucide-react'
import { products } from '@/entities/product'
import { categories } from '@/entities/category'
import { getCategoryPath } from '@/shared/config'
import { ProductCard } from '@/widgets/ProductCard'

export const MainPage: React.FC = () => {
    console.log('MainPage')

    return (
        <div className="pb-16">
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold">Товары</h2>
                </div>

                <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                    {categories.map((cat) => (
                        <Link key={cat?.id} to={getCategoryPath(cat.id)}>
                            <Button
                                variant="plain"
                                className="flex items-center gap-2 px-3 mb-3 bg-white rounded-2xl border border-gray-200 whitespace-nowrap hover:border-primary shadow-md"
                            >
                                <span>{cat.icon}</span>
                                <span className="text-sm">{cat.name}</span>
                            </Button>
                        </Link>
                    ))}
                </div>

                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold">Рекомендуем</h3>
                    <Button
                        variant="plain"
                        className="text-sm text-gray-600 flex items-center gap-1"
                    >
                        Всё <ChevronRight size={16} />
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                    {products.slice(0, 2).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold">
                        Скидки на смартфоны
                    </h3>
                    <Button
                        variant="plain"
                        className="text-sm text-gray-600 flex items-center gap-1"
                    >
                        Всё <ChevronRight size={16} />
                    </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {products.slice(2).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    )
}
