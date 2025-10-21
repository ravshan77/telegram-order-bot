import { GoBack } from '@/shared/ui/kit-pro'
import { useNavigate, useParams } from 'react-router-dom'
import { Alert, Tabs } from '@/shared/ui/kit'
import TabNav from '@/shared/ui/kit/Tabs/TabNav'
import { useCategory } from '@/entities/category'
import TabList from '@/shared/ui/kit/Tabs/TabList'
import { ProductCard } from '@/widgets/ProductCard'
import TabContent from '@/shared/ui/kit/Tabs/TabContent'
import React, { useState, useCallback, useMemo } from 'react'
import { useVerticalInfiniteScroll } from '@/shared/lib/hooks'
import { transformProductToView, useProducts } from '@/entities/product'
import { getCategoryPath } from '@/shared/config'

export const CategoryPage: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>()
    const navigate = useNavigate()
    const [currentTab, setCurrentTab] = useState<string>(categoryId || '')
    const [limit, setLimit] = useState(20)

    const {
        data: category,
        isLoading: isLoadingCategory,
        isError: isErrorCategory,
        error: categoryError,
    } = useCategory(categoryId!)

    const {
        data: productsData,
        isLoading: isLoadingProducts,
        isError: isErrorProducts,
        error: productsError,
        isFetching,
    } = useProducts(
        {
            limit,
            skip: 1,
            category_id: currentTab,
        },
        {
            enabled: !!currentTab,
            placeholderData: (previousData) => previousData,
        },
    )

    const handleLoadMore = useCallback(async () => {
        setLimit((prev) => prev + 20)
    }, [])

    const { scrollContainerRef, sentinelRef, isDesktop } =
        useVerticalInfiniteScroll({
            onLoadMore: handleLoadMore,
            isLoading: isFetching,
            threshold: 20,
        })

    const handleTabChange = (tabValue: string) => {
        const dd = category?.childs.find((child) => child?.id === tabValue)

        if (dd?.childs) {
            navigate(getCategoryPath(dd.id))
        }

        setCurrentTab(tabValue)
        setLimit(20)
    }

    const productViews = useMemo(() => {
        return (productsData?.data || []).map(transformProductToView)
    }, [productsData?.data])

    if (isLoadingCategory) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-pulse text-gray-400">Загрузка...</div>
            </div>
        )
    }

    if (isErrorCategory) {
        return (
            <div className="p-4">
                <Alert showIcon type="danger">
                    {categoryError?.message}
                </Alert>
            </div>
        )
    }

    const categoryChilds = category?.childs ?? []

    return (
        <div className="pb-16">
            <div className="bg-white w-full sticky top-0 z-10">
                <GoBack text={category?.name} />
            </div>

            <Tabs value={currentTab} onChange={handleTabChange}>
                <TabList>
                    <TabNav
                        key={category?.id}
                        value={category?.id || ''}
                        className="min-w-max"
                    >
                        Все товары
                    </TabNav>
                    {categoryChilds.map((child) => (
                        <TabNav
                            key={child.id}
                            value={child.id}
                            className="min-w-max"
                        >
                            {child.name}
                        </TabNav>
                    ))}
                </TabList>

                <div
                    ref={scrollContainerRef}
                    className={`py-4 overflow-y-auto scroll-smooth ${isDesktop ? 'scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100' : ''}`}
                    style={{ maxHeight: 'calc(100vh - 200px)' }}
                >
                    {isErrorProducts ? (
                        <Alert showIcon type="danger">
                            {productsError?.message}
                        </Alert>
                    ) : productViews.length === 0 && isLoadingProducts ? (
                        <div className="h-96" />
                    ) : productViews.length === 0 ? (
                        <div className="flex justify-center items-center h-96 text-gray-500">
                            Товары не найдены
                        </div>
                    ) : (
                        <TabContent value={currentTab}>
                            <div className="grid grid-cols-2 gap-2 mb-6">
                                {productViews.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                            </div>
                            <div
                                ref={sentinelRef}
                                className="h-1"
                                aria-hidden="true"
                            />
                        </TabContent>
                    )}
                </div>
            </Tabs>
        </div>
    )
}
