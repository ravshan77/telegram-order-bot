export interface Category {
    id: string
    name: string
    image: string | null
    parent_id: string | null
    organization_id: string
    is_deleted: boolean
    created_at: string
    updated_at: string
    deleted_at: string | null
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
