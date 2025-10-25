import {
    ProductView,
    useProducts,
    Image as ImageType,
    transformProductToView,
} from '@/entities/product'
import { APP_CDN } from '@/shared/api'
import { ScrollBar } from '@/shared/ui/kit'
import { GoBack } from '@/shared/ui/kit-pro'
import { useNavigate } from 'react-router-dom'
import { getProductPath } from '@/shared/config'
import { useState, useEffect, useMemo } from 'react'
import { Search, X, Loader2, Image } from 'lucide-react'
import { useCartStore } from '@/shared/store/useCartStore'
import { numericFormat } from '@/shared/lib/numericFormat'
import useHeaderSearchStore from '@/shared/store/useHeaderSearch'

export const SearchProductPage = () => {
    const { searchItemName } = useHeaderSearchStore((store) => store)
    const [debouncedQuery, setDebouncedQuery] = useState('')
    const navigate = useNavigate()

    const { data: products, isLoading } = useProducts(
        { name: debouncedQuery, limit: 50 },
        {
            enabled: debouncedQuery.length > 0,
        },
    )

    const productViews = useMemo(() => {
        return (products?.data || []).map(transformProductToView)
    }, [products?.data])

    const { setSelectedProduct } = useCartStore()

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchItemName)
        }, 1000)

        return () => clearTimeout(timer)
    }, [searchItemName])

    const handleProductClick = (product: ProductView) => {
        setSelectedProduct(product)
        navigate(getProductPath(product.id))
    }

    const productImages = (images: ImageType[]) => {
        if (images.length > 0) {
            return `${APP_CDN}${images?.[0].path}`
        }
        return
    }

    return (
        <div className="">
            <div className="bg-white w-full flex justify-end">
                <GoBack text="" icon={<X />} />
            </div>
            <div className="">
                <div className="flex flex-col h-full">
                    {/* Content */}
                    <div className="flex-1 overflow-hidden">
                        <ScrollBar className="h-full">
                            <div className="p-4">
                                {isLoading && (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                    </div>
                                )}

                                {!searchItemName && !isLoading && (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <Search className="h-16 w-16 text-gray-300 mb-4" />
                                        <p className="text-gray-500 text-lg">
                                            Поиск продукта
                                        </p>
                                        <p className="text-gray-400 text-sm mt-2">
                                            Введите название продукта
                                        </p>
                                    </div>
                                )}

                                {searchItemName &&
                                    !isLoading &&
                                    productViews?.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <Search className="h-16 w-16 text-gray-300 mb-4" />
                                            <p className="text-gray-500 text-lg">
                                                Товары не найдены.
                                            </p>
                                            <p className="text-gray-400 text-sm mt-2">
                                                {searchItemName}
                                            </p>
                                        </div>
                                    )}

                                {productViews && productViews?.length > 0 && (
                                    <div className="space-y-2">
                                        {productViews?.map((product) => (
                                            <button
                                                key={product.id}
                                                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                                                onClick={() =>
                                                    handleProductClick(product)
                                                }
                                            >
                                                <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                                                    {product?.images?.length >
                                                    0 ? (
                                                        <img
                                                            src={productImages(
                                                                product?.images,
                                                            )}
                                                            alt={product.name}
                                                            className="object-cover border h-full w-full rounded-md"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <Image className="h-6 w-6" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 truncate">
                                                        {product.name}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="font-semibold text-primary">
                                                            {numericFormat(
                                                                product.price,
                                                            )}{' '}
                                                            {
                                                                product
                                                                    ?.currency
                                                                    ?.name
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </ScrollBar>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchProductPage
