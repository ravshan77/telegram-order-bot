import React from "react";
import { Button } from "@/shared/ui/kit";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/shared/store/useCartStore";

export const Header: React.FC = () => {
  const menuOpen = useCartStore((state) => state.menuOpen);
  const setMenuOpen = useCartStore((state) => state.setMenuOpen);
  const setPage = useCartStore((state) => state.setPage);
  const getTotalItems = useCartStore((state) => state.getTotalItems);

  return (
    <div className="p-2 sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3">
        {/* <button onClick={() => setMenuOpen(!menuOpen)} className="p-2"> */}
        <Button
          shape="circle"
          // style={{ background: "red" }}
          size="xs"
          active
          variant="plain"
          onClick={() => setMenuOpen(!menuOpen)}
          className="bg-gray-300"
          icon={menuOpen ? <X size={24} /> : <Menu size={24} />}
        />
        {/* </button> */}
        <h1 className="text-lg font-semibold">Hippo magazin</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="plain"
            className="p-2 relative"
            onClick={() => setPage("cart")}
          >
            <ShoppingCart size={24} />
            {getTotalItems() > 0 && (
              <span className="absolute top-0 right-0 bg-cyan-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </Button>
          <div className="w-8 h-8 rounded-full bg-gray-300"></div>
        </div>
      </div>
    </div>
  );
};
