import {
    Drawer,
    DrawerTitle,
    DrawerHeader,
    DrawerContent,
} from '@/shared/ui/kit/Sheet'

interface HeaderSearchSheetProps {
    isOpen: boolean
    searchItemName: string
    setIsOpen: (open: boolean) => void
}

export function HeaderSearchSheet({
    isOpen,
    setIsOpen,
    searchItemName,
}: HeaderSearchSheetProps) {
    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerContent className="bg-white">
                <div
                    className="mx-auto w-full px-4"
                    style={{ height: '100vh' }}
                >
                    <DrawerHeader className="p-0">
                        <DrawerTitle className="text-start text-xl">
                            Header search
                        </DrawerTitle>
                    </DrawerHeader>
                    <div className="px-4 pb-8 h-full border border-red-500">
                        <div>{searchItemName}</div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
