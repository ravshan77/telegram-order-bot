import { Alert } from '@/shared/ui/kit'
import { useMemo, useState } from 'react'
import { ProductCard } from '@/widgets/ProductCard'
import { useVerticalInfiniteScroll } from '@/shared/lib/hooks'
import useHeaderSearchStore from '@/shared/store/useHeaderSearch'
import { transformProductToView, useProducts } from '@/entities/product'

const LIMIT_PAGINATION = 50

export const AllProducts = () => {
    const [limit, setLimit] = useState(LIMIT_PAGINATION)
    const searchItemName = useHeaderSearchStore((store) => store.searchItemName)

    const {
        data: productsData,
        isLoading: isLoadingProducts,
        isError: isErrorProducts,
        error: productsError,
        isPending,
        isFetching,
    } = useProducts(
        { limit, name: searchItemName },
        { placeholderData: (previousData) => previousData },
    )

    const handleLoadMore = async () => {
        if (
            productsData?.filtered_count &&
            productsData?.filtered_count >= limit
        ) {
            setLimit((prev) => prev + LIMIT_PAGINATION)
        }
    }

    const { scrollContainerRef, sentinelRef, isDesktop } =
        useVerticalInfiniteScroll({
            onLoadMore: handleLoadMore,
            isLoading: isFetching,
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
                <div className="h-96">
                    <p className="flex justify-center items-center text-center h-full w-full text-gray-500">
                        {' '}
                        Загрузка ...{' '}
                    </p>{' '}
                </div>
            ) : productViews.length === 0 ? (
                <div className="flex justify-center items-center h-96 text-gray-500">
                    Товары не найдены
                </div>
            ) : (
                <div>
                    <div className="grid grid-cols-2 gap-2">
                        {productViews.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                        <div
                            ref={sentinelRef}
                            className="h-2"
                            aria-hidden="true"
                        />
                    </div>
                    {isLoadingProducts || isFetching || isPending ? (
                        <p className="text-center h-4 w-full text-gray-500">
                            {' '}
                            Загрузка ...{' '}
                        </p>
                    ) : null}
                </div>
            )}
        </div>
    )
}

export default AllProducts
