import React from "react";
import { Button } from "@/shared/ui/kit";
import { useCartStore } from "@/shared/store/useCartStore";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";

export const CartPage: React.FC = () => {
  const cart = useCartStore((state) => state.cart);
  const setPage = useCartStore((state) => state.setPage);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  return (
    <div className="pb-24">
      <div className="bg-white p-4 border-b sticky top-14 z-10">
        <Button
          variant="plain"
          onClick={() => setPage("main")}
          className="text-cyan-500 mb-2"
        >
          Закрыт
        </Button>
        <h2 className="text-xl font-semibold">Корзина</h2>
      </div>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96">
          <ShoppingCart size={64} className="text-gray-300 mb-4" />
          <p className="text-gray-500">Корзина пуста</p>
        </div>
      ) : (
        <>
          <div className="p-4 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white rounded-lg p-4 flex gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="text-sm font-medium mb-1">{item.name}</h3>
                  <p className="text-cyan-600 font-bold">
                    {item.price.toLocaleString()} сўм
                  </p>
                  <p className="text-xs text-gray-500">Цена продажи</p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <Button
                    variant="plain"
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400"
                  >
                    <Trash2 size={20} />
                  </Button>
                  <div className="flex items-center gap-2">
                    <button
                      // variant="plain"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center cursor-pointer"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      // variant="plain"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center cursor-pointer"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="fixed bottom-2 left-0 right-0 bg-white border-t p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600">Общая сумма:</span>
              <span className="text-2xl font-bold">
                {getTotalPrice().toLocaleString()} сўм
              </span>
            </div>
            <Button
              variant="plain"
              onClick={() => setPage("checkout")}
              className="w-full bg-cyan-500 text-white py-3 rounded-lg font-medium hover:bg-cyan-600"
            >
              Оформить заказ
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
