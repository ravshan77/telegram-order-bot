import { useThemeStore } from '@/shared/model/themeStore'
import { THEME_ENUM } from '@/shared/config/constants/theme.constant'
import type { DetailedHTMLProps, ImgHTMLAttributes } from 'react'

interface DoubleSidedImageProps
    extends DetailedHTMLProps<
        ImgHTMLAttributes<HTMLImageElement>,
        HTMLImageElement
    > {
    darkModeSrc: string
}

const { MODE_DARK } = THEME_ENUM

const DoubleSidedImage = ({
    src,
    darkModeSrc,
    alt = '',
    ...rest
}: DoubleSidedImageProps) => {
    const mode = useThemeStore((state) => state.mode)

    return (
        <img src={mode === MODE_DARK ? darkModeSrc : src} alt={alt} {...rest} />
    )
}

export default DoubleSidedImage
