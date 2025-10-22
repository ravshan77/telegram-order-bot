import { useContext } from 'react'
import { ItemMapContext } from '@/app/providers/ItemMapContext'

export const useItemMap = () => {
    const context = useContext(ItemMapContext)
    if (!context)
        throw new Error('useItemMap must be used within ItemMapProvider')
    return context
}

export default useItemMap
