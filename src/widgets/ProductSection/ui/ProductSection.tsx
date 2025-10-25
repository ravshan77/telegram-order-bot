import {
    useProducts,
    ProductFilters,
    transformProductToView,
} from '@/entities/product'
import { ChevronRight } from 'lucide-react'
import { Alert, Button } from '@/shared/ui/kit'
import { ProductCard } from '@/widgets/ProductCard'
import React, { useState, useCallback, useMemo } from 'react'
import { useHorizontalInfiniteScroll } from '@/shared/lib/hooks'

interface ProductSectionProps {
    title: string
    filters?: ProductFilters
}

const LIMIT_PAGINATION = 50

export const ProductSection: React.FC<ProductSectionProps> = ({
    title,
    filters,
}) => {
    const [limit, setLimit] = useState(LIMIT_PAGINATION)

    const {
        data,
        isLoading: isLoadingProducts,
        isError: isErrorProducts,
        error: productsError,
        isFetching,
    } = useProducts(
        {
            limit,
            ...filters,
        },
        {
            placeholderData: (previousData) => previousData,
        },
    )

    const handleLoadMore = useCallback(async () => {
        setLimit((prev) => prev + LIMIT_PAGINATION)
    }, [])

    const { scrollContainerRef, handleScroll, isDesktop } =
        useHorizontalInfiniteScroll({
            onLoadMore: handleLoadMore,
            isLoading: isFetching,
            threshold: 70,
        })

    const productViews = useMemo(() => {
        return (data?.data || []).map(transformProductToView)
    }, [data?.data])

    if (isLoadingProducts && !data) {
        return <div className="h-[200px]" />
    }

    if (isErrorProducts) {
        return (
            <div className="p-4">
                <Alert showIcon type="danger">
                    {productsError?.message}
                </Alert>
            </div>
        )
    }

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

            <div
                ref={scrollContainerRef}
                className={`flex gap-3 overflow-x-auto pb-3 ${isDesktop ? ' scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100' : ''}`}
                onScroll={handleScroll}
            >
                {productViews.length > 0 ? (
                    productViews.map((product) => (
                        <div
                            key={product.id}
                            className="inline-block flex-shrink-0"
                        >
                            <ProductCard product={product} />
                        </div>
                    ))
                ) : (
                    <div className="w-full flex items-center justify-center h-48 text-gray-500">
                        Товары не найдены
                    </div>
                )}
                {isLoadingProducts || isFetching ? (
                    <p className="min-w-44 flex items-center justify-center h-72 text-gray-500">
                        {' '}
                        Загрузка ...{' '}
                    </p>
                ) : null}
            </div>
        </div>
    )
}

export default ProductSection
