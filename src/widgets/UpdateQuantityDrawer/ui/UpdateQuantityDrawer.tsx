import {
    Input,
    Sheet,
    Select,
    Button,
    DrawerHeader,
    DrawerContent,
    DrawerDescription,
} from '@/shared/ui/kit'
import { SingleValue } from 'react-select'
import { MeasurementType } from '@/shared/config'
import { FormEvent, useEffect, useState } from 'react'
import { Package_measurements } from '@/entities/product'

interface Props {
    isOpen: boolean
    quantity: number
    measurement: number
    package_measurements: Package_measurements[]
    updateQuantity: (quantity: number) => void
    setIsOpen: (open: boolean) => void
}

export function UpdateQuantityDrawer({
    isOpen,
    setIsOpen,
    quantity,
    measurement,
    updateQuantity,
    package_measurements,
}: Props) {
    const [count, setCount] = useState<number | string>(quantity)
    const [select, setSelect] = useState<
        SingleValue<{ label: string; value: number }>
    >({ label: `шт: ${1}`, value: 1 })
    const handleClose = () => setIsOpen(false)

    useEffect(() => {
        setCount(quantity)
    }, [quantity])

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const calcQuantity = Number(count) * Number(select?.value)
        updateQuantity(calcQuantity)
        handleClose()
    }

    return (
        <Sheet open={isOpen} onOpenChange={handleClose}>
            <DrawerContent className="bg-white pb-8">
                <div className="w-full p-4 pt-0">
                    <DrawerHeader className="p-0 pb-4">
                        <DrawerDescription className="text-start">
                            Количество
                        </DrawerDescription>
                    </DrawerHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="flex items-center justify-between bg-gray-100 rounded-md border">
                            <Input
                                autoFocus
                                value={count}
                                type="number"
                                min={0}
                                className="w-1/2 focus:ring-0 focus-within:border-none"
                                inputMode="decimal"
                                onChange={(e) => {
                                    setCount(e.target.value)
                                }}
                            />
                            <div className="border h-8 w-[1px]"></div>
                            <Select
                                className="w-1/2"
                                classNames={{
                                    control: (state) =>
                                        state.isFocused
                                            ? 'select-control no-ring no-border'
                                            : 'select-control',
                                }}
                                placeholder={''}
                                options={[
                                    {
                                        label: `${MeasurementType[measurement].label}: ${1}`,
                                        value: 1,
                                    },
                                    ...(package_measurements?.map((pkg) => ({
                                        label: `${pkg.name}:  ${pkg.quantity}`,
                                        value: pkg.quantity,
                                    })) ?? []),
                                ]}
                                isSearchable={false}
                                value={select}
                                menuPlacement="top"
                                onChange={(e) => setSelect(e)}
                            />
                        </div>
                        <div className="flex justify-between items-center gap-2 pt-6">
                            <Button
                                type="button"
                                className="w-full"
                                onClick={handleClose}
                            >
                                Отмена
                            </Button>
                            <Button
                                type="submit"
                                variant="solid"
                                className="w-full"
                            >
                                Редактировать
                            </Button>
                        </div>
                    </form>
                </div>
            </DrawerContent>
        </Sheet>
    )
}

export default UpdateQuantityDrawer
