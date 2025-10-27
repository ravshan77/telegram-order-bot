import classNames from 'classnames'
import type { CommonProps } from '@/@types/common'
import { BrandLogo, BrandLogoFull } from '@/shared/ui/BrandLogo'

interface LogoProps extends CommonProps {
    size?: string | number
    collapsed?: boolean
}

const Logo = (props: LogoProps) => {
    const { className, style, size, collapsed = false } = props
    return (
        <div
            className={classNames(
                `logo ${collapsed ? 'flex justify-center items-center pl-2' : 'pl-6'} `,
                className,
            )}
            style={{ ...style }}
        >
            {collapsed ? (
                <BrandLogo height={size} />
            ) : (
                <BrandLogoFull height={size} />
            )}
        </div>
    )
}

export default Logo
