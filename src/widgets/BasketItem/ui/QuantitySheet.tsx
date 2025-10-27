import { Items } from '@/entities/product'
import {
    Input,
    Sheet,
    Select,
    DrawerHeader,
    DrawerContent,
    DrawerDescription,
} from '@/shared/ui/kit'

interface Props {
    item?: Items
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export function QuantitySheet({ isOpen, setIsOpen, item }: Props) {
    const handleClose = () => setIsOpen(false)
    return (
        <Sheet open={isOpen} onOpenChange={handleClose}>
            <DrawerContent className="bg-white pb-8">
                <div className="w-full p-4 pt-0">
                    <DrawerHeader className="p-0 pb-4">
                        <DrawerDescription className="text-start">
                            Количество
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="flex items-center justify-between bg-gray-100 rounded-md border">
                        <Input
                            autoFocus
                            type="number"
                            inputMode="decimal"
                            className="w-1/2"
                        />
                        <div className="border h-8 w-[1px]"></div>
                        <Select
                            className="w-1/2"
                            options={
                                item?.item?.package_measurements
                                    ? item.item.package_measurements.map(
                                          (pkg) => ({
                                              label: pkg.name,
                                              value: pkg.quantity,
                                          }),
                                      )
                                    : [{ label: 'шт', value: 1 }]
                            }
                            placeholder={''}
                            defaultValue={[{ label: 'шт', value: 1 }]}
                            defaultOptions={[{ label: 'шт', value: 1 }]}
                            value={[{ label: 'шт', value: 1 }]}
                            menuPlacement="top"
                        />
                    </div>
                </div>
            </DrawerContent>
        </Sheet>
    )
}

export default QuantitySheet
