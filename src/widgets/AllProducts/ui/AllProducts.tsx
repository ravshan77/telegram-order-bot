import { Alert } from '@/shared/ui/kit'
import { ProductCard } from '@/widgets/ProductCard'
import { useCallback, useMemo, useState } from 'react'
import { useVerticalInfiniteScroll } from '@/shared/lib/hooks'
import { transformProductToView, useProducts } from '@/entities/product'

const LIMIT_PAGINATION = 50

export const AllProducts = () => {
    const [limit, setLimit] = useState(LIMIT_PAGINATION)

    const {
        data: productsData,
        isLoading: isLoadingProducts,
        isError: isErrorProducts,
        error: productsError,
        isFetching,
    } = useProducts(
        { limit },
        { placeholderData: (previousData) => previousData },
    )

    const handleLoadMore = useCallback(
        async () => setLimit((prev) => prev + LIMIT_PAGINATION),
        [],
    )

    const { scrollContainerRef, sentinelRef, isDesktop } =
        useVerticalInfiniteScroll({
            onLoadMore: handleLoadMore,
            isLoading: isFetching,
            threshold: LIMIT_PAGINATION,
        })

    const productViews = useMemo(() => {
        return (productsData?.data || []).map(transformProductToView)
    }, [productsData?.data])

    if (isErrorProducts) {
        return (
            <div className="p-4">
                <Alert showIcon type="danger">
                    Ошибка загрузки продуктов: {productsError?.message}
                </Alert>
            </div>
        )
    }

    return (
        <div
            ref={scrollContainerRef}
            className={`py-4 overflow-y-auto ${isDesktop ? ' scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100' : ''}`}
            style={{ maxHeight: 'calc(100vh - 200px)' }}
        >
            {productViews.length === 0 && isLoadingProducts ? (
                <div className="h-96" />
            ) : productViews.length === 0 ? (
                <div className="flex justify-center items-center h-96 text-gray-500">
                    Товары не найдены
                </div>
            ) : (
                <div>
                    <div className="grid grid-cols-2 gap-2 mb-6">
                        {productViews.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    {isLoadingProducts || isFetching ? (
                        <h4 className="text-center h-4 w-full">
                            {' '}
                            Загрузка ...{' '}
                        </h4>
                    ) : null}
                    <div ref={sentinelRef} className="h-1" aria-hidden="true" />
                </div>
            )}
        </div>
    )
}

export default AllProducts
