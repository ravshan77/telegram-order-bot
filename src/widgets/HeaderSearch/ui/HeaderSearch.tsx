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
            <DrawerContent className="bg-white fixed inset-0 h-screen flex-1">
                <div className="w-full px-4 flex flex-col h-full">
                    <DrawerHeader className="p-4 border-b">
                        <DrawerTitle className="text-start text-xl">
                            Header search
                        </DrawerTitle>
                    </DrawerHeader>
                    <div className="px-4 pb-8 h-screen border border-red-500">
                        <div>{searchItemName}</div>
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
