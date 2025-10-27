import {
    Button,
    Sheet,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    Input,
} from '@/shared/ui/kit'

interface Props {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export function QuantitySheet({ isOpen, setIsOpen }: Props) {
    const handleClose = () => setIsOpen(false)
    return (
        <Sheet open={isOpen}>
            <DrawerContent className="bg-white">
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Move Goal</DrawerTitle>
                        <DrawerDescription>
                            Set your daily activity goal.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                        <Input type="number" />
                    </div>
                    <DrawerFooter>
                        <Button>Submit</Button>
                        <DrawerClose asChild>
                            <Button onClick={handleClose}>Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Sheet>
    )
}

export default QuantitySheet
