import { FC } from 'react'
import { ProductSection } from '@/widgets/ProductSection'
import { CategoriesList } from '@/widgets/CategoriesList'
// import useHeaderSearchStore from '@/shared/store/useHeaderSearch'

export const MainPage: FC = () => {
    // const { searchItemName } = useHeaderSearchStore((store) => store)
    return (
        <div className="pb-0">
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold">Товары</h2>
                </div>
                <CategoriesList />
                <ProductSection
                    title="Рекомендуем"
                    filters={{ is_favorite: true }}
                />
                <ProductSection title="Скидки на смартфоны" />
            </div>
        </div>
    )
}

export default MainPage
