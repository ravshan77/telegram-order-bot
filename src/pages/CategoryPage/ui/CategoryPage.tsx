import React from 'react'
import { Button } from '@/shared/ui/kit'
import { products } from '@/entities/product'
import { ProductCard } from '@/widgets/ProductCard'
import { useCartStore } from '@/shared/store/useCartStore'

export const CategoryPage: React.FC = () => {
    const selectedCategory = useCartStore((state) => state.selectedCategory)
    const setPage = useCartStore((state) => state.setPage)
    const categoryProducts = products.filter(
        (p) => p.category === selectedCategory,
    )

    return (
        <div className="pb-24">
            <div className="bg-white p-4 border-b sticky top-14 z-10">
                <Button
                    variant="plain"
                    onClick={() => setPage('main')}
                    className="text-cyan-500 mb-2"
                >
                    Назад
                </Button>
                <h2 className="text-xl font-semibold">{selectedCategory}</h2>
            </div>

            <div className="px-4 py-4">
                <div className="grid grid-cols-2 gap-3">
                    {categoryProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    )
}
