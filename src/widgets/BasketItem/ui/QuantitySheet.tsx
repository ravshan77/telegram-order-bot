import {
    Input,
    Sheet,
    DrawerHeader,
    DrawerContent,
    DrawerDescription,
} from '@/shared/ui/kit'

interface Props {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export function QuantitySheet({ isOpen, setIsOpen }: Props) {
    const handleClose = () => setIsOpen(false)
    return (
        <Sheet open={isOpen} onOpenChange={handleClose}>
            <DrawerContent className="bg-white pb-8">
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerDescription className="text-start">
                            Set your daily activity goal.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                        <Input autoFocus type="number" />
                    </div>
                </div>
            </DrawerContent>
        </Sheet>
    )
}

export default QuantitySheet
