import { Link } from 'react-router-dom'
import { getCategoryPath } from '@/shared/config'
import { useCategories } from '@/entities/category'
import { Alert, Button, Spinner } from '@/shared/ui/kit'

export const CategoriesList = () => {
    const {
        data,
        isLoading: isLoadingProducts,
        isError: isErrorProducts,
        error: productsError,
    } = useCategories()

    const categoriesTree = data?.categoriesTree ?? []

    if (isLoadingProducts) {
        return (
            <div className="flex justify-center items-center">
                <Spinner size={40} />
            </div>
        )
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
        <div className="flex gap-2 overflow-x-auto">
            {categoriesTree?.map((cat) => (
                <Link key={cat?.id} to={getCategoryPath(cat.id)}>
                    <Button
                        variant="plain"
                        className="flex items-center gap-2 px-3 mb-3 bg-white rounded-2xl border border-gray-200 whitespace-nowrap hover:border-primary shadow-md"
                    >
                        <span className="text-sm">{cat.name}</span>
                    </Button>
                </Link>
            ))}
        </div>
    )
}

export default CategoriesList
