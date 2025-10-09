import React, { useRef } from 'react'
// import { Button } from '@/shared/ui/kit'
import { products } from '@/entities/product'
import { useNavigate } from 'react-router-dom'
import { ProductCard } from '@/widgets/ProductCard'

export const CategoryPage: React.FC = () => {
    const temporarily_category = 'Электроника'

    const categoryProducts = products.filter(
        (p) => p.category === temporarily_category,
    )

    const navigate = useNavigate()

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
                navigate(-1) // ortga qaytish
            }
        }

        // qiymatlarni tozalash
        touchStartX.current = null
        touchEndX.current = null
    }

    return (
        <div
            className="pb-24"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold">
                        {temporarily_category}
                    </h2>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                    {categoryProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    )
}
