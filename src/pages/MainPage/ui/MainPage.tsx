import { FC } from 'react'
import { AllProducts } from '@/widgets/AllProducts'
import { CategoriesList } from '@/widgets/CategoriesList'
import { Input } from '@/shared/ui/kit'
import { Search } from 'lucide-react'
import useHeaderSearchStore from '@/shared/store/useHeaderSearch'

export const MainPage: FC = () => {
    const { setSearchItemName, searchItemName } = useHeaderSearchStore(
        (store) => store,
    )

    return (
        <div className="pb-0">
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold">Товары</h2>
                    <div
                        className={`flex w-60 items-center gap-2 bg-gray-100 rounded-md px-3`}
                    >
                        <Search size={20} className="text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Поиск"
                            value={searchItemName}
                            className="h-full bg-transparent border-none focus:outline-none focus:ring-0"
                            onChange={(e) => setSearchItemName(e.target.value)}
                        />
                    </div>
                </div>
                <CategoriesList />
                <AllProducts />
                {/* <ProductSection title="Рекомендуем" filters={{ is_favorite: true }} /> */}
                {/* <ProductSection title="Скидки на смартфоны" /> */}
            </div>
        </div>
    )
}

export default MainPage
