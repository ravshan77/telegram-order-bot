import { useEffect } from 'react'

export default function useFixDrawerKeyboard() {
    useEffect(() => {
        const fixDrawerPosition = () => {
            const body = document.body
            // Keyboard ochilganda viewport kichrayadi → scroll yoki transform oldini olish
            if (window.visualViewport) {
                const vh = window.visualViewport.height
                body.style.setProperty('--vh', `${vh * 0.01}px`)
            }
        }

        fixDrawerPosition()
        window.visualViewport?.addEventListener('resize', fixDrawerPosition)

        return () => {
            window.visualViewport?.removeEventListener(
                'resize',
                fixDrawerPosition,
            )
        }
    }, [])
}
