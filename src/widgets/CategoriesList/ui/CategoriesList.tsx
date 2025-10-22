import { Link } from 'react-router-dom'
import { getCategoryPath } from '@/shared/config'
import { useCategories } from '@/entities/category'
import { Alert, Button, Spinner } from '@/shared/ui/kit'
import { useHorizontalInfiniteScroll } from '@/shared/lib/hooks'
import { capitalizeFirstLetter } from '@/shared/ui/kit/utils/capitalize'

const APP_CDN = import.meta.env.VITE_APP_CDN

export const CategoriesList = () => {
    const {
        data,
        isLoading: isLoadingProducts,
        isError: isErrorProducts,
        error: productsError,
    } = useCategories()

    const { isDesktop } = useHorizontalInfiniteScroll({ onLoadMore: () => {} })

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

// {
//     "categories": [
//         {
//             "id": "68f27bd5e85a6c1cb893cd11",
//             "image": {
//                 "id": "68f28b75e85a6c1cb893cf80",
//                 "name": "bdc30ade0d0202f42a0aef35b9a808fe.jpg",
//                 "path": "6863d268683c613127a1e375\\68f27bd5e85a6c1cb893cd11\\68f28b75e85a6c1cb893cf80\\bdc30ade0d0202f42a0aef35b9a808fe.jpg"
//             },
//             "name": "юбилейное",
//             "organization_id": "6863d268683c613127a1e375",
//             "parent_id": "68f27bd4e85a6c1cb893ccc7"
//         }
//     ],
//     "categoriesTree": [
//         {
//             "childs": [],
//             "id": "68f27bd3e85a6c1cb893ccb5",
//             "image": null,
//             "name": "YOĜLAR",
//             "organization_id": "6863d268683c613127a1e375",
//             "parent_id": null
//         }
//     ],
//     "data": [
//         {
//             "branch_states": [
//                 {
//                     "code": "123ss",
//                     "created_at": "2025-07-10 17:47:43",
//                     "deleted_at": null,
//                     "id": "686fb66fc92b3bbc1b65d9f1",
//                     "is_deleted": false,
//                     "name": "magazin",
//                     "owner": {
//                         "id": "6863d268683c613127a1e375",
//                         "inn": null,
//                         "name": "DIYORBEK"
//                     },
//                     "roaming_address": null,
//                     "roaming_branch": {
//                         "address": null,
//                         "branch_name": "",
//                         "branch_number": "",
//                         "latitude": null,
//                         "longitude": null
//                     },
//                     "state": 0,
//                     "updated_at": "2025-07-10 17:47:43",
//                     "warehouses": []
//                 }
//             ],
//             "item": {
//                 "barcodes": [
//                     "49244397"
//                 ],
//                 "category": {
//                     "id": "68f27bd5e85a6c1cb893cd11",
//                     "name": "юбилейное"
//                 },
//                 "code": null,
//                 "description": "",
//                 "description_attributes": [],
//                 "id": "68f27bd6e85a6c1cb893cd20",
//                 "images": [],
//                 "is_favorite": true,
//                 "legal_type": 0,
//                 "measurement": 1,
//                 "name": "юбилейное трубочка кг",
//                 "organization_id": "6863d268683c613127a1e375",
//                 "package_measurements": [],
//                 "sku": "00032"
//             },
//             "price": {
//                 "bulk_price": {
//                     "amount": 0,
//                     "currency": {
//                         "global_currency_id": 831,
//                         "is_national": true,
//                         "name": "UZS"
//                     }
//                 },
//                 "common_price": {
//                     "amount": 39000,
//                     "currency": {
//                         "global_currency_id": 831,
//                         "is_national": true,
//                         "name": "UZS"
//                     }
//                 },
//                 "contractor": null
//             },
//             "warehouse_states": {
//                 "id": "68f27bd6e85a6c1cb893cd20",
//                 "name": "юбилейное трубочка кг",
//                 "organization_id": "6863d268683c613127a1e375",
//                 "warehouse_items": [
//                     {
//                         "alert_on": null,
//                         "id": 71,
//                         "name": "Склад 1234",
//                         "purchase_price": null,
//                         "state": 22
//                     }
//                 ]
//             }
//         }
//     ],
//     "filtered_count": 2,
//     "total_count": 1084
// }
