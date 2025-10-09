import { CommonProps } from '@/@types/common'
import LayoutBase from '@/shared/ui/template/LayoutBase'
import { LAYOUT_BLANK } from '@/shared/config/constants/theme.constant'

const Blank = ({ children }: CommonProps) => {
    return (
        <LayoutBase
            type={LAYOUT_BLANK}
            className="app-layout-blank flex flex-auto flex-col h-[100vh]"
        >
            <div className="flex min-w-0 w-full flex-1">{children}</div>
        </LayoutBase>
    )
}

export default Blank
