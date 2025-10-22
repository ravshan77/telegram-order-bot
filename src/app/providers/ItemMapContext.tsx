import { Items, useProducts } from '@/entities/product'
import React, { createContext, useEffect, useState } from 'react'

interface ItemMapContextType {
    itemMap: Map<string, Items>
    getItemById: (id: string) => Items | undefined
}

// eslint-disable-next-line react-refresh/only-export-components
export const ItemMapContext = createContext<ItemMapContextType | null>(null)

export const ItemMapProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [itemMap, setItemMap] = useState<Map<string, Items>>(new Map())
    const { data } = useProducts()

    useEffect(() => {
        if (!data?.data) return

        const dd = data.data
        const map = new Map(dd.map((obj: Items) => [obj.item.id, obj]))
        setItemMap(map)
    }, [data])

    const getItemById = (id: string) => itemMap.get(id)

    return (
        <ItemMapContext.Provider value={{ itemMap, getItemById }}>
            {children}
        </ItemMapContext.Provider>
    )
}
