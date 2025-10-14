import {
    Drawer,
    DrawerTitle,
    DrawerHeader,
    DrawerContent,
} from '@/shared/ui/kit/Sheet'

interface BottomSheetProps {
    isOpen: boolean
    setIsOpen: (prev: boolean) => void
}

export function PayoutViewDrawer({ isOpen, setIsOpen }: BottomSheetProps) {
    return (
        <Drawer open={isOpen} onOpenChange={(prew) => setIsOpen(prew)}>
            <DrawerContent className="bg-white">
                <div className="mx-auto w-full px-4">
                    <DrawerHeader className="p-0">
                        <DrawerTitle className="text-start text-xl">
                            Оформление заказа
                        </DrawerTitle>
                    </DrawerHeader>
                    <div className="px-4 pb-8">
                        <div>
                            <div
                                className="flex justify-between items-center py-4 border-b border-dashed"
                                style={{
                                    borderImage:
                                        'repeating-linear-gradient(to right, #9ca3af 0 10px, transparent 10px 15px) 1',
                                }}
                            >
                                <span className="text-gray-700">Наличный</span>
                                <span className="font-semibold text-black">
                                    146 000 сум
                                </span>
                            </div>

                            <div
                                className="flex justify-between items-center py-4 border-b border-dashed"
                                style={{
                                    borderImage:
                                        'repeating-linear-gradient(to right, #9ca3af 0 10px, transparent 10px 15px) 1',
                                }}
                            >
                                <span className="text-gray-700">Uzcard</span>
                                <span className="font-semibold text-black">
                                    20 000 сум
                                </span>
                            </div>

                            <div
                                className="flex justify-between items-center py-4 border-b border-dashed"
                                style={{
                                    borderImage:
                                        'repeating-linear-gradient(to right, #9ca3af 0 10px, transparent 10px 15px) 1',
                                }}
                            >
                                <span className="text-gray-700">Humo</span>
                                <span className="font-semibold text-black">
                                    150 000 сум
                                </span>
                            </div>

                            <div
                                className="flex justify-between items-center py-4 border-b border-dashed"
                                style={{
                                    borderImage:
                                        'repeating-linear-gradient(to right, #9ca3af 0 10px, transparent 10px 15px) 1',
                                }}
                            >
                                <span className="text-gray-700">
                                    Перечисления
                                </span>
                                <span className="font-semibold text-black">
                                    75 000 сум
                                </span>
                            </div>

                            <div
                                className="flex justify-between items-center py-4 border-b border-dashed"
                                style={{
                                    borderImage:
                                        'repeating-linear-gradient(to right, #9ca3af 0 10px, transparent 10px 15px) 1',
                                }}
                            >
                                <span className="text-gray-700">Click</span>
                                <span className="font-semibold text-black">
                                    210 000 сум
                                </span>
                            </div>

                            <div
                                className="flex justify-between items-center py-4 border-b border-dashed"
                                style={{
                                    borderImage:
                                        'repeating-linear-gradient(to right, #9ca3af 0 10px, transparent 10px 15px) 1',
                                }}
                            >
                                <span className="text-gray-700">Payme</span>
                                <span className="font-semibold text-black">
                                    15 000 сум
                                </span>
                            </div>

                            <div className="flex justify-between items-center py-4">
                                <span className="text-gray-700">Visa</span>
                                <span className="font-semibold text-black">
                                    50$
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
