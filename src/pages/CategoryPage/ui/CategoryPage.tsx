import React from 'react'
import { Button } from '@/shared/ui/kit'
import { products } from '@/entities/product'
import { useNavigate } from 'react-router-dom'
import { ProductCard } from '@/widgets/ProductCard'

export const CategoryPage: React.FC = () => {
    const temporarily_category = 'Электроника'

    const categoryProducts = products.filter(
        (p) => p.category === temporarily_category,
    )

    const navigate = useNavigate()

    return (
        <div className="pb-24">
            <div className="bg-white p-4 border-b sticky top-14 z-10">
                <Button
                    variant="plain"
                    type="button"
                    className="text-cyan-500 mb-2"
                    onClick={() => navigate(-1)}
                >
                    Назад
                </Button>
                <h2 className="text-xl font-semibold">
                    {temporarily_category}
                </h2>
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
