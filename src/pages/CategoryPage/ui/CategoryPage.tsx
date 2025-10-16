import React, { useState } from 'react'
import { GoBack } from '@/shared/ui/kit-pro'
import { useParams } from 'react-router-dom'
import { useProducts } from '@/entities/product'
import TabNav from '@/shared/ui/kit/Tabs/TabNav'
import { useCategory } from '@/entities/category'
import TabList from '@/shared/ui/kit/Tabs/TabList'
import { ProductCard } from '@/widgets/ProductCard'
import { Alert, Spinner, Tabs } from '@/shared/ui/kit'
import TabContent from '@/shared/ui/kit/Tabs/TabContent'
import { transformProductToView } from '@/entities/product/model/types'

export const CategoryPage: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>()
    const [currentTab, setCurrentTab] = useState(categoryId)

    const {
        data: category,
        isLoading: isLoadingCategory,
        isError: isErrorCategory,
        error: categoryError,
    } = useCategory(categoryId!)

    const {
        data: products,
        isLoading: isLoadingProducts,
        isError: isErrorProducts,
        error: productsError,
    } = useProducts({
        limit: 20,
        skip: 1,
        category_id: currentTab,
    })

    if (isLoadingCategory || isLoadingProducts) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size={40} />
            </div>
        )
    }

    if (isErrorCategory || isErrorProducts) {
        return (
            <div className="p-4">
                <Alert showIcon type="danger">
                    {categoryError?.message}
                    {productsError?.message}
                </Alert>
            </div>
        )
    }

    const categoryChilds = category?.childs ?? []
    const productViews = products?.data.map(transformProductToView) || []

    console.log(productViews)

    return (
        <div className="pb-16">
            <div>
                <div className="bg-white w-full">
                    <GoBack text={category?.name} />
                </div>

                <div>
                    <Tabs
                        value={category?.id}
                        defaultValue={category?.id}
                        onChange={setCurrentTab}
                    >
                        <TabList>
                            <TabNav
                                key={category?.id}
                                value={String(category?.id)}
                                className="min-w-max"
                            >
                                Все товары
                            </TabNav>
                            {categoryChilds?.map((child) => {
                                return (
                                    <TabNav
                                        key={child.id}
                                        value={child.id}
                                        className="min-w-max"
                                    >
                                        {child.name}
                                    </TabNav>
                                )
                            })}
                        </TabList>
                        <div className="py-4">
                            {categoryChilds.map((child) => {
                                return (
                                    <TabContent key={child.id} value={child.id}>
                                        <div className="grid grid-cols-2 gap-3 mb-6">
                                            {productViews.map((product) => (
                                                <ProductCard
                                                    key={product.id}
                                                    product={product}
                                                />
                                            ))}
                                        </div>
                                    </TabContent>
                                )
                            })}
                        </div>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
