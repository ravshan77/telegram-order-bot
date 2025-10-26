import { useRef, useEffect, useState } from 'react'

interface UseHorizontalInfiniteScrollProps {
    onLoadMore: () => Promise<void> | void
    isLoading?: boolean
    threshold?: number
}

export const useHorizontalInfiniteScroll = ({
    onLoadMore,
    isLoading = false,
    threshold = 0.1,
}: UseHorizontalInfiniteScrollProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [isAtEnd, setIsAtEnd] = useState(false)
    const isLoadingRef = useRef(false)

    const [isDesktop, setIsDesktop] = useState(false)

    useEffect(() => {
        const userAgent = navigator.userAgent.toLowerCase()
        const isMobile = /iphone|ipad|android|mobile|ipod/.test(userAgent)
        setIsDesktop(!isMobile)
    }, [])

    const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
        if (isLoadingRef.current || isAtEnd) return

        const element = e.currentTarget
        const isNearEnd =
            element.scrollLeft + element.clientWidth >=
            element.scrollWidth - threshold

        if (isNearEnd && !isLoadingRef.current) {
            isLoadingRef.current = true
            setIsAtEnd(true)
            try {
                await onLoadMore()
            } finally {
                setTimeout(() => {
                    isLoadingRef.current = false
                    setIsAtEnd(false)
                }, 100)
            }
        }
    }

    useEffect(() => {
        isLoadingRef.current = isLoading
    }, [isLoading])

    return {
        scrollContainerRef,
        handleScroll,
        isDesktop,
    }
}
