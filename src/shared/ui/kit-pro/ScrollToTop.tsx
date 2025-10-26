import Button from '../kit/Button'
import classNames from 'classnames'
import { ChevronUp } from 'lucide-react'
import { FC, useState, useEffect } from 'react'

interface ScrollToTopProps {
    containerRef?: React.RefObject<HTMLElement | HTMLDivElement | null>
    offset?: number
    className?: string
}

export const ScrollToTop: FC<ScrollToTopProps> = ({
    containerRef,
    offset = 300,
    className,
}) => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = containerRef?.current
                ? containerRef.current.scrollTop
                : window.scrollY

            setIsVisible(scrollTop > offset)
        }

        const container = containerRef?.current

        if (container) {
            container.addEventListener('scroll', handleScroll)
            handleScroll()
        } else {
            window.addEventListener('scroll', handleScroll)
            handleScroll()
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll)
            } else {
                window.removeEventListener('scroll', handleScroll)
            }
        }
    }, [containerRef, offset])

    const scrollToTop = () => {
        if (containerRef?.current) {
            containerRef.current.scrollTo({
                top: 0,
                behavior: 'smooth',
            })
        } else {
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            })
        }
    }

    return (
        <Button
            className={classNames(
                'fixed bottom-10 right-4 z-50 p-3 transition-all duration-300 transform',
                isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-20 opacity-0 pointer-events-none',
                className,
            )}
            variant="solid"
            shape="circle"
            aria-label="Scroll to top"
            onClick={scrollToTop}
        >
            <ChevronUp size={24} />
        </Button>
    )
}

export default ScrollToTop
