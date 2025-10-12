import React from 'react'
import { Button } from '@/shared/ui/kit'
import { useCartStore } from '@/shared/store/useCartStore'
import { Home, Tag, ShoppingCart, User } from 'lucide-react'

export const BottomNav: React.FC = () => {
    const page = useCartStore((state) => state.page)
    const setPage = useCartStore((state) => state.setPage)
    const totalItems = useCartStore((state) =>
        state.cart.reduce((sum, item) => sum + item.quantity, 0),
    )

    return (
        <div className="flex justify-center">
            <div className="p-2 fixed bottom-0 left-0 right-0 bg-white border-t flex items-center justify-around py-2">
                <Button
                    variant="plain"
                    className={`flex flex-col items-center gap-1 py-2 px-4 ${
                        page === 'main' ? 'text-cyan-500' : 'text-gray-400'
                    }`}
                    onClick={() => setPage('main')}
                >
                    <Home size={24} />
                    <span className="text-xs">Главная</span>
                </Button>
                <Button
                    variant="plain"
                    className="flex flex-col items-center gap-1 py-2 px-4 text-gray-400"
                    onClick={() => setPage('main')}
                >
                    <Tag size={24} />
                    <span className="text-xs">Заказы</span>
                </Button>
                <Button
                    variant="plain"
                    className={`flex flex-col items-center gap-1 py-2 px-4 relative ${
                        page === 'cart' ? 'text-cyan-500' : 'text-gray-400'
                    }`}
                    onClick={() => setPage('cart')}
                >
                    <ShoppingCart size={24} />
                    {totalItems > 0 && (
                        <span className="absolute top-1 right-2 bg-cyan-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {totalItems}
                        </span>
                    )}
                    <span className="text-xs">Корзина</span>
                </Button>
                <Button
                    variant="plain"
                    className="flex flex-col items-center gap-1 py-2 px-4 text-gray-400"
                >
                    <User size={24} />
                    <span className="text-xs">Профиль</span>
                </Button>
            </div>
        </div>
    )
}
