import classNames from '@/shared/lib/classNames'
import type { CommonProps } from '@/@types/common'

export interface FrameLessGapProps extends CommonProps {
    contained?: boolean
}

const FrameLessGap = ({ children, className }: FrameLessGapProps) => {
    return <div className={classNames(className, 'p-6')}>{children}</div>
}

export default FrameLessGap
