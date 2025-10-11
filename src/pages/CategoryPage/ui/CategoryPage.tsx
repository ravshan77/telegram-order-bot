import React, { useRef } from 'react'
import { Button } from '@/shared/ui/kit'
import { ChevronLeft } from 'lucide-react'
import { products } from '@/entities/product'
import { useNavigate } from 'react-router-dom'
import { ProductCard } from '@/widgets/ProductCard'

export const CategoryPage: React.FC = () => {
    const temporarily_category = 'Электроника'

    const categoryProducts = products.filter(
        (p) => p.category === temporarily_category,
    )

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
            className="pb-24"
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            onTouchStart={handleTouchStart}
        >
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="flex justify-center items-center text-lg font-semibold">
                        <Button
                            variant="plain"
                            icon={<ChevronLeft />}
                            onClick={goBack}
                        />
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
