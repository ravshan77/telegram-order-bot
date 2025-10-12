'use client'

import * as React from 'react'
import { Minus, Plus } from 'lucide-react'

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/shared/ui/kit/Sheet'
import { Button } from '@/shared/ui/kit'

export function SheetDemo() {
    const [goal, setGoal] = React.useState(350)

    function onClick(adjustment: number) {
        setGoal(Math.max(200, Math.min(400, goal + adjustment)))
    }

    return (
        <Drawer>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                        <DrawerTitle>Move Goal</DrawerTitle>
                        <DrawerDescription>
                            Set your daily activity goal.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                        <div className="flex items-center justify-center space-x-2">
                            <Button
                                className="h-8 w-8 shrink-0 rounded-full"
                                disabled={goal <= 200}
                                onClick={() => onClick(-10)}
                            >
                                <Minus />
                                <span className="sr-only">Decrease</span>
                            </Button>
                            <div className="flex-1 text-center">
                                <div className="text-7xl font-bold tracking-tighter">
                                    {goal}
                                </div>
                                <div className="text-muted-foreground text-[0.70rem] uppercase">
                                    Calories/day
                                </div>
                            </div>
                            <Button
                                className="h-8 w-8 shrink-0 rounded-full"
                                disabled={goal >= 400}
                                onClick={() => onClick(10)}
                            >
                                <Plus />
                                <span className="sr-only">Increase</span>
                            </Button>
                        </div>
                        <div className="mt-3 h-[120px]">
                            <h1>Nimadurlar</h1>
                        </div>
                    </div>
                    <DrawerFooter>
                        <Button>Submit</Button>
                        <DrawerClose asChild>
                            <Button>Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
