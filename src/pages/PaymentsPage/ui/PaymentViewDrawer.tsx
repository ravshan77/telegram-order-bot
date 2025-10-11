import { Drawer } from '@/shared/ui/kit'

interface Props {
    isDrawerOpen: boolean
    setIsDrawerOpen: (isOpen: boolean) => void
}

export const PaymentViewDrawer = ({ isDrawerOpen, setIsDrawerOpen }: Props) => {
    return (
        <Drawer
            isOpen={isDrawerOpen}
            placement="bottom"
            title="Подробности"
            closable={true}
            height="auto"
            bodyClass="p-0"
            className={'overflow-hidden rounded-lg'}
            onClose={() => setIsDrawerOpen(false)}
        >
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
                        <span className="text-gray-700">Перечисления</span>
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
                        <span className="font-semibold text-black">50$</span>
                    </div>
                </div>
            </div>
        </Drawer>
    )
}
