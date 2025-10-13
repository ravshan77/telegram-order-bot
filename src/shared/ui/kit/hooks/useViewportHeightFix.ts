import { useEffect } from 'react'

export const useViewportHeightFix = () => {
    useEffect(() => {
        const updateVh = () => {
            if (window.visualViewport) {
                const vh = window.visualViewport.height * 0.01
                document.documentElement.style.setProperty('--vh', `${vh}px`)
            } else {
                // Fallback
                const vh = window.innerHeight * 0.01
                document.documentElement.style.setProperty('--vh', `${vh}px`)
            }
        }

        updateVh()
        window.visualViewport?.addEventListener('resize', updateVh)
        window.visualViewport?.addEventListener('scroll', updateVh)

        return () => {
            window.visualViewport?.removeEventListener('resize', updateVh)
            window.visualViewport?.removeEventListener('scroll', updateVh)
        }
    }, [])
}

export default useViewportHeightFix
