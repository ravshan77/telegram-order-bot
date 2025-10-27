import {
    Input,
    Sheet,
    Select,
    DrawerHeader,
    DrawerContent,
    DrawerDescription,
} from '@/shared/ui/kit'
import { useState } from 'react'
import { SingleValue } from 'react-select'
import { Items } from '@/entities/product'

interface Props {
    item?: Items
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export function QuantitySheet({ isOpen, setIsOpen, item }: Props) {
    const [select, setSelect] = useState<
        SingleValue<{ label: string; value: number }>
    >({ label: `шт: ${1}`, value: 1 })
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
                            value={1}
                            type="number"
                            className="w-1/2"
                            inputMode="decimal"
                        />
                        <div className="border h-8 w-[1px]"></div>
                        <Select
                            className="w-1/2"
                            placeholder={''}
                            options={[
                                { label: `шт: ${1}`, value: 1 },
                                ...(item?.item?.package_measurements?.map(
                                    (pkg) => ({
                                        label: `${pkg.name}:  ${pkg.quantity}`,
                                        value: pkg.quantity,
                                    }),
                                ) ?? []),
                            ]}
                            isSearchable={false}
                            value={select}
                            menuPlacement="top"
                            onChange={(e) => setSelect(e)}
                        />
                    </div>
                </div>
            </DrawerContent>
        </Sheet>
    )
}

export default QuantitySheet
