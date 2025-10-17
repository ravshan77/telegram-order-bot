import { Image } from '@/entities/product/model/types'

export interface Category {
    id: string
    name: string
    image: Image
    parent_id: string | null
    organization_id: string
}

export interface CategoryTree extends Category {
    childs: CategoryTree[]
}

export interface CategoryResponse extends Category {
    childs: CategoryTree[]
}

export interface CategoriesResponse {
    categories: Category[]
    categoriesTree: CategoryTree[]
}
