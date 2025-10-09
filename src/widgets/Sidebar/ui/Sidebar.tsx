import React, { useEffect, useState } from "react";
import { useCartStore } from "@/shared/store/useCartStore";
import { Menu, X, ShoppingCart, Tag, User, ChevronRight } from "lucide-react";
import { Button } from "@/shared/ui/kit";

export const Sidebar: React.FC = () => {
  const menuOpen = useCartStore((state) => state.menuOpen);
  const setMenuOpen = useCartStore((state) => state.setMenuOpen);
  const setPage = useCartStore((state) => state.setPage);

  const [isMounted, setIsMounted] = useState(false); // DOMda bormi yo‘qmi
  const [isAnimating, setIsAnimating] = useState(false); // animatsiya aktivmi

  useEffect(() => {
    if (menuOpen) {
      setIsMounted(true); // DOMga joylash
      // Keyingi frame’da animatsiyani faollashtirish
      requestAnimationFrame(() => setIsAnimating(true));
    } else {
      // Animatsiyani sekinlik bilan o‘chirish
      setIsAnimating(false);
      const timer = setTimeout(() => setIsMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [menuOpen]);

  if (!isMounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-gray-800/50 transition-opacity duration-300 ease-in-out ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
      onClick={() => setMenuOpen(false)}
    >
      <div
        className={`absolute top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isAnimating ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between">
          <div className="flex items-center justify-between mb-4">
            <Button
              shape="round"
              variant="plain"
              onClick={() => setMenuOpen(false)}
            >
              <X size={24} />
            </Button>
          </div>
          <div>
            <div className="text-xs text-gray-600">Время работы</div>
            <div className="text-sm font-medium text-gray-600">
              07:00 - 24:00
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="py-2">
          <Button
            variant="plain"
            onClick={() => {
              setPage("main");
              setMenuOpen(false);
            }}
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50"
          >
            <ShoppingCart size={20} />
            <span>Товары</span>
          </Button>
          <Button
            variant="plain"
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50"
          >
            <Tag size={20} />
            <span>Заказы</span>
          </Button>
          <Button
            variant="plain"
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50"
          >
            <Menu size={20} />
            <span>Продажи</span>
          </Button>
          <Button
            variant="plain"
            className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50"
          >
            <User size={20} />
            <span>Оплаты</span>
          </Button>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-2 m-4 rounded-md bg-gray-100">
          <div className="text-xs text-gray-500">Адрес доставки</div>
          <Button
            variant="plain"
            className="text-sm text-gray-700 flex items-center justify-between w-full mt-2"
          >
            <span>Правент точки Формопост мустакимли, 17 доки</span>
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

// import React from "react";
// import { useCartStore } from "@shared/store/useCartStore";
// import { Menu, X, ShoppingCart, Tag, User, ChevronRight } from "lucide-react";

// export const Sidebar: React.FC = () => {
//   const menuOpen = useCartStore((state) => state.menuOpen);
//   const setMenuOpen = useCartStore((state) => state.setMenuOpen);
//   const setPage = useCartStore((state) => state.setPage);

//   if (!menuOpen) return null;

//   return (
//     <div
//       className="p-2 fixed inset-0 z-50 bg-gray-800/50 bg-opacity-50"
//       onClick={() => setMenuOpen(false)}
//     >
//       <div
//         className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="p-4 border-b flex justify-between">
//           <div className="flex items-center justify-between mb-4">
//             <button onClick={() => setMenuOpen(false)}>
//               <X size={24} />
//             </button>
//           </div>
//           <div>
//             <div className="text-xs text-gray-600">Время работы</div>
//             <div className="text-sm font-medium text-gray-600">
//               07:00 - 24:00
//             </div>
//           </div>
//         </div>

//         <div className="py-2">
//           <button
//             onClick={() => {
//               setPage("main");
//               setMenuOpen(false);
//             }}
//             className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50"
//           >
//             <ShoppingCart size={20} />
//             <span>Товары</span>
//           </button>
//           <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50">
//             <Tag size={20} />
//             <span>Заказы</span>
//           </button>
//           <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50">
//             <Menu size={20} />
//             <span>Продажи</span>
//           </button>
//           <button className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50">
//             <User size={20} />
//             <span>Оплаты</span>
//           </button>
//         </div>

//         <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
//           <div className="text-xs text-gray-500">Admin dostupno</div>
//           <button className="text-sm text-gray-700 flex items-center justify-between w-full mt-2">
//             <span>Правент точки Формопост мустакимли, 17 доки</span>
//             <ChevronRight size={16} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
