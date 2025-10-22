import { FC } from 'react'
import { ProductSection } from '@/features/ProductSection'
import CategoriesList from '@/widgets/CategoriesList/ui/CategoriesList'

export const MainPage: FC = () => {
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
                <ProductSection title="Скидки на смартфоны." />
            </div>
        </div>
    )
}

export default MainPage
