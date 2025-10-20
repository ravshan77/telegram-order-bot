// import React, { useState, useCallback } from 'react'
// import { ChevronRight } from 'lucide-react'
// import { ProductCard } from '@/widgets/ProductCard'
// import { Alert, Button, Spinner } from '@/shared/ui/kit'
// import { ProductFilters } from '@/entities/product/model/types'
// import { transformProductToView, useProducts } from '@/entities/product'

// interface ProductSectionProps {
//     title: string
//     filters?: ProductFilters
// }

// export const ProductSection: React.FC<ProductSectionProps> = ({
//     title,
//     filters,
// }) => {
//     const [limit, setLimit] = useState(50)
//     const [isEndReached, setIsEndReached] = useState(false)

//     const {
//         data,
//         isLoading,
//         isError,
//         error,
//         isFetching,
//     } = useProducts({ limit, ...filters }, { keepPreviousData: true })

//     const products = data?.data || []
//     const productViews = products.map(transformProductToView)

//     // scroll X yo‘nalishda oxiriga yetganini aniqlash
//     const handleScrollX = useCallback(
//         (e: React.UIEvent<HTMLDivElement>) => {
//             const target = e.currentTarget

//             const isAtEnd =
//                 target.scrollLeft + target.clientWidth >=
//                 target.scrollWidth - 20 // 20px buffer

//             if (isAtEnd && !isFetching && !isEndReached) {
//                 setIsEndReached(true)
//                 setLimit((prev) => prev + 50)

//                 // 0.5 soniyada "end reached" holatini qayta faollashtirish
//                 setTimeout(() => setIsEndReached(false), 500)
//             }
//         },
//         [isFetching, isEndReached]
//     )

//     // Boshlang‘ich yuklanish holati
//     if (isLoading && limit === 50) {
//         return (
//             <div className="flex justify-center items-center h-[300px]">
//                 <Spinner size={40} />
//             </div>
//         )
//     }

//     // Xatolik holati
//     if (isError) {
//         return (
//             <div className="p-4">
//                 <Alert showIcon type="danger">
//                     Mahsulotlarni yuklashda xatolik: {error?.message}
//                 </Alert>
//             </div>
//         )
//     }

//     return (
//         <div className="mb-6">
//             {/* Header */}
//             <div className="flex items-center justify-between mb-3">
//                 <h3 className="text-base font-semibold">{title}</h3>
//                 <Button
//                     variant="plain"
//                     className="text-sm text-gray-600 flex items-center gap-1"
//                 >
//                     Всё <ChevronRight size={16} />
//                 </Button>
//             </div>

//             {/* Productlar ro‘yxati */}
//             <div
//                 onScroll={handleScrollX}
//                 className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide"
//                 style={{
//                     scrollBehavior: 'smooth',
//                     whiteSpace: 'nowrap',
//                 }}
//             >
//                 {productViews.map((product) => (
//                     <div key={product.id} className="inline-block">
//                         <ProductCard product={product} />
//                     </div>
//                 ))}

//                 {/* Faqat oxirida loader */}
//                 {isFetching && (
//                     <div className="flex justify-center items-center min-w-[100px]">
//                         <Spinner size={24} />
//                     </div>
//                 )}
//             </div>
//         </div>
//     )
// }

// export default ProductSection

import React from 'react'
import { ChevronRight } from 'lucide-react'
import { ProductCard } from '@/widgets/ProductCard'
import { Alert, Button, Spinner } from '@/shared/ui/kit'
import { ProductFilters } from '@/entities/product/model/types'
import { transformProductToView, useProducts } from '@/entities/product'

interface ProductSectionProps {
    title: string
    filters?: ProductFilters
}

export const ProductSection: React.FC<ProductSectionProps> = ({
    title,
    filters,
}) => {
    // Fetch products
    const {
        data,
        isLoading: isLoadingProducts,
        isError: isErrorProducts,
        error: productsError,
    } = useProducts({
        limit: 50,
        // skip: 1,
        ...filters,
    })

    // Loading state
    if (isLoadingProducts) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size={40} />
            </div>
        )
    }

    // Error state
    if (isErrorProducts) {
        return (
            <div className="p-4">
                <Alert showIcon type="danger">
                    Mahsulotlarni yuklashda xatolik: {productsError?.message}
                </Alert>
            </div>
        )
    }

    const products = data?.data
    // Transform products to view format

    const productViews = products?.map(transformProductToView) || []

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold">{title}</h3>
                <Button
                    variant="plain"
                    className="text-sm text-gray-600 flex items-center gap-1"
                >
                    Всё <ChevronRight size={16} />
                </Button>
            </div>
            <div className="flex gap-3 overflow-x-auto">
                {productViews.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    )
}

export default ProductSection
