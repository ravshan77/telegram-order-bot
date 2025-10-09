import React from 'react'
import { Button } from '@/shared/ui/kit'
import { ChevronRight } from 'lucide-react'
import { products } from '@/entities/product'
import { categories } from '@/entities/category'
import { ProductCard } from '@/widgets/ProductCard'
import { useCartStore } from '@/shared/store/useCartStore'

export const MainPage: React.FC = () => {
    const setSelectedCategory = useCartStore(
        (state) => state.setSelectedCategory,
    )
    const setPage = useCartStore((state) => state.setPage)

    return (
        <div className="pb-24">
            {/* <div className="bg-white p-4 sticky top-14 z-10">
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                    <Search size={20} className="text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Поиск"
                        className="h-full bg-transparent flex-1 outline-none focus:outline-none focus:ring-0"
                    />
                </div>
            </div> */}

            <div className="px-0 py-0">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Товары</h2>
                </div>

                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {categories.map((cat) => (
                        <Button
                            variant="plain"
                            key={cat.id}
                            onClick={() => {
                                setSelectedCategory(cat.name)
                                setPage('category')
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 whitespace-nowrap hover:border-cyan-500"
                        >
                            <span>{cat.icon}</span>
                            <span className="text-sm">{cat.name}</span>
                        </Button>
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
