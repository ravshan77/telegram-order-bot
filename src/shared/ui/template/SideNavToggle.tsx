import withHeaderItem from '@/shared/lib/hoc/withHeaderItem'
import { useThemeStore } from '@/shared/model/themeStore'
import useResponsive from '@/shared/lib/hooks/useResponsive'
import NavToggle from '@/shared/ui/kit-pro/NavToggle'
import type { CommonProps } from '@/@types/common'

const _SideNavToggle = ({ className }: CommonProps) => {
    const { layout, setSideNavCollapse } = useThemeStore((state) => state)

    const sideNavCollapse = layout.sideNavCollapse

    const { larger } = useResponsive()

    const onCollapse = () => {
        setSideNavCollapse(!sideNavCollapse)
    }

    return (
        <>
            {larger.md && (
                <div className={className} role="button" onClick={onCollapse}>
                    <NavToggle className="text-2xl" toggled={sideNavCollapse} />
                </div>
            )}
        </>
    )
}

const SideNavToggle = withHeaderItem(_SideNavToggle)

export default SideNavToggle
