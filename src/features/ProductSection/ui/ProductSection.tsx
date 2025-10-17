import React from 'react'
import { ChevronRight } from 'lucide-react'
import { ProductCard } from '@/widgets/ProductCard'
import { Alert, Button, Spinner } from '@/shared/ui/kit'
import { transformProductToView, useProducts } from '@/entities/product'
import { ProductFilters } from '@/entities/product/model/types'

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
        limit: 30,
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
