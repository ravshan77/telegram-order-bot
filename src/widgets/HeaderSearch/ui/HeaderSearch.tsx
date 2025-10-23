import { useState, useEffect, useRef } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
// import {
//     Drawer,
//     DrawerContent,
//     DrawerHeader,
//     DrawerTitle,
// } from '@/components/ui/drawer'
// import { Input } from '@/components/ui/input';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { useProducts } from '@/hooks/useProducts';
// import { useProductPage } from '@/store/ProductPage';
// import Image from 'next/image';
import {
    Drawer,
    DrawerTitle,
    DrawerHeader,
    DrawerContent,
} from '@/shared/ui/kit/Sheet'
import { Input, ScrollBar } from '@/shared/ui/kit'
import { ProductItem, useProducts } from '@/entities/product'
// import { useCartStore } from '@/shared/store/useCartStore'

interface HeaderSearchSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function HeaderSearchSheet({
    open,
    onOpenChange,
}: HeaderSearchSheetProps) {
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedQuery, setDebouncedQuery] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    const { data: products, isLoading } = useProducts(
        { name: debouncedQuery },
        {
            enabled: debouncedQuery.length > 0,
        },
    )

    // const { setSelectedProduct } = useCartStore()

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery)
        }, 300)

        return () => clearTimeout(timer)
    }, [searchQuery])

    // Focus input when drawer opens
    useEffect(() => {
        if (open) {
            setTimeout(() => {
                inputRef.current?.focus()
            }, 100)
        } else {
            setSearchQuery('')
            setDebouncedQuery('')
        }
    }, [open])

    const handleProductClick = (product: ProductItem) => {
        // setSelectedProduct(product)
        console.log(product)

        onOpenChange(false)
    }

    const handleClear = () => {
        setSearchQuery('')
        setDebouncedQuery('')
        inputRef.current?.focus()
    }

    return (
        <Drawer
            open={true}
            dismissible={true}
            shouldScaleBackground={false}
            onOpenChange={onOpenChange}
        >
            <DrawerContent
                className="h-[100vh] absolute top-0 left-0 max-h-[100vh] rounded-none border-none outline-none focus:outline-none bg-white"
                style={{
                    height: '100vh',
                    maxHeight: '100vh',
                    top: 0,
                    bottom: 0,
                }}
            >
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <DrawerHeader className="border-b px-4 py-3">
                        <div className="flex items-center gap-3">
                            <DrawerTitle className="sr-only">
                                Mahsulot qidirish
                            </DrawerTitle>

                            {/* Search Input */}
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Mahsulot qidirish..."
                                    value={searchQuery}
                                    className="pl-10 pr-10 h-11 text-base"
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                                {searchQuery && (
                                    <button
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                                        onClick={handleClear}
                                    >
                                        <X className="h-4 w-4 text-gray-500" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </DrawerHeader>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden">
                        <ScrollBar className="h-full">
                            <div className="p-4">
                                {/* Loading state */}
                                {isLoading && (
                                    <div className="flex items-center justify-center py-12">
                                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                    </div>
                                )}

                                {/* Empty state - no search query */}
                                {!searchQuery && !isLoading && (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <Search className="h-16 w-16 text-gray-300 mb-4" />
                                        <p className="text-gray-500 text-lg">
                                            Mahsulot qidiring
                                        </p>
                                        <p className="text-gray-400 text-sm mt-2">
                                            Mahsulot nomini kiriting
                                        </p>
                                    </div>
                                )}

                                {/* No results */}
                                {searchQuery &&
                                    !isLoading &&
                                    products?.data.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-12 text-center">
                                            <Search className="h-16 w-16 text-gray-300 mb-4" />
                                            <p className="text-gray-500 text-lg">
                                                Hech narsa topilmadi
                                            </p>
                                            <p className="text-gray-400 text-sm mt-2">
                                                {searchQuery}
                                            </p>
                                        </div>
                                    )}

                                {/* Products list */}
                                {products && products?.data.length > 0 && (
                                    <div className="space-y-2">
                                        {products?.data?.map((product) => (
                                            <button
                                                key={product.item.id}
                                                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                                                onClick={() =>
                                                    handleProductClick(
                                                        product.item,
                                                    )
                                                }
                                            >
                                                {/* Product Image */}
                                                <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                                                    {product?.item?.images
                                                        ?.length > 0 ? (
                                                        <img
                                                            src={
                                                                product?.item
                                                                    ?.images[0]
                                                                    ?.path || ''
                                                            }
                                                            alt={
                                                                product.item
                                                                    .name
                                                            }
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <Search className="h-6 w-6" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Product Info */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 truncate">
                                                        {product.item.name}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="font-semibold text-primary">
                                                            {'22000'.toLocaleString()}{' '}
                                                            UZS
                                                        </span>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </ScrollBar>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

// import {
//     Drawer,
//     DrawerTitle,
//     DrawerHeader,
//     DrawerContent,
// } from '@/shared/ui/kit/Sheet'

// interface HeaderSearchSheetProps {
//     isOpen: boolean
//     searchItemName: string
//     setIsOpen: (open: boolean) => void
// }

// export function HeaderSearchSheet({
//     isOpen,
//     setIsOpen,
//     searchItemName,
// }: HeaderSearchSheetProps) {
//     return (
//         <Drawer open={isOpen} onOpenChange={setIsOpen}>
//             <DrawerContent className="bg-white fixed inset-0 h-screen flex-1">
//                 <div className="w-full px-4 flex flex-col h-full">
//                     <DrawerHeader className="p-4 border-b">
//                         <DrawerTitle className="text-start text-xl">
//                             Header search
//                         </DrawerTitle>
//                     </DrawerHeader>
//                     <div className="px-4 pb-8 h-screen border border-red-500">
//                         <div>{searchItemName}</div>
//                     </div>
//                 </div>
//             </DrawerContent>
//         </Drawer>
//     )
// }
