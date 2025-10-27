import { APP_CDN } from '@/shared/api'
import { Link } from 'react-router-dom'
import { Alert, Button } from '@/shared/ui/kit'
import { getCategoryPath } from '@/shared/config'
import { useCategories } from '@/entities/category'
import { useHorizontalInfiniteScroll } from '@/shared/lib/hooks'
import { capitalizeFirstLetter } from '@/shared/ui/kit/utils/capitalize'

export const CategoriesList = () => {
    const {
        data,
        isError: isErrorProducts,
        error: productsError,
    } = useCategories()

    const { isDesktop } = useHorizontalInfiniteScroll({ onLoadMore: () => {} })

    const categoriesTree = data?.categoriesTree ?? []

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
        <div
            className={`flex gap-2 overflow-x-auto ${isDesktop ? ' scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100' : ''}`}
        >
            {categoriesTree?.map((cat) => (
                <Link key={cat?.id} to={getCategoryPath(cat.id)}>
                    <Button
                        variant="plain"
                        className="flex items-center gap-2 px-3 mb-3 bg-white rounded-2xl border border-gray-200 whitespace-nowrap hover:border-primary shadow-md"
                    >
                        {cat?.image ? (
                            <div className="w-5 h-5">
                                <img
                                    src={`${APP_CDN}${cat?.image?.path}`}
                                    className="w-full h-full rounded"
                                />
                            </div>
                        ) : null}
                        <span className="text-sm text-center min-w-20">
                            {capitalizeFirstLetter(cat?.name)}
                        </span>
                    </Button>
                </Link>
            ))}
        </div>
    )
}

export default CategoriesList
