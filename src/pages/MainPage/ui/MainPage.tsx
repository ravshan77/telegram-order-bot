import React from 'react'
import { Link } from 'react-router-dom'
import { Alert, Button, Spinner } from '@/shared/ui/kit'
import { ChevronRight } from 'lucide-react'
// import { products } from '@/entities/product'
import { categories } from '@/entities/category'
import { getCategoryPath } from '@/shared/config'
import { ProductCard } from '@/widgets/ProductCard'
import { useProducts } from '@/entities/product'
import { transformProductToView } from '@/entities/product/model/types'

export const MainPage: React.FC = () => {
    // Fetch products
    const {
        data: products,
        isLoading: isLoadingProducts,
        isError: isErrorProducts,
        error: productsError,
    } = useProducts()

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

    // Transform products to view format
    const productViews = products?.map(transformProductToView) || []

    return (
        <div className="pb-0">
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold">Товары</h2>
                </div>

                <div className="flex gap-2 overflow-x-auto">
                    {categories.map((cat) => (
                        <Link key={cat?.id} to={getCategoryPath(cat.id)}>
                            <Button
                                variant="plain"
                                className="flex items-center gap-2 px-3 mb-3 bg-white rounded-2xl border border-gray-200 whitespace-nowrap hover:border-primary shadow-md"
                            >
                                <span>{cat.icon}</span>
                                <span className="text-sm">{cat.name}</span>
                            </Button>
                        </Link>
                    ))}
                </div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold">Рекомендуем</h3>
                    <Button
                        variant="plain"
                        className="text-sm text-gray-600 flex items-center gap-1"
                    >
                        Всё <ChevronRight size={16} />
                    </Button>
                </div>
                <div className="flex gap-3 mb-6 overflow-x-auto">
                    {productViews.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold">
                        Скидки на смартфоны
                    </h3>
                    <Button
                        variant="plain"
                        className="text-sm text-gray-600 flex items-center gap-1"
                    >
                        Всё <ChevronRight size={16} />
                    </Button>
                </div>
                <div className="flex gap-3 mb-6 overflow-x-auto">
                    {productViews.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-base font-semibold">
                        Скидки на смартфоны
                    </h3>
                    <Button
                        variant="plain"
                        className="text-sm text-gray-600 flex items-center gap-1"
                    >
                        Всё <ChevronRight size={16} />
                    </Button>
                </div>
                <div className="flex gap-3 mb-6 overflow-x-auto">
                    {productViews
                        .sort(() => Math.random() - 0.5)
                        .map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                </div>
            </div>
        </div>
    )
}
