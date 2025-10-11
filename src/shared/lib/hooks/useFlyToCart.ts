import { useCallback } from 'react'
// eslint-disable-next-line import/no-unresolved
import gsap from 'gsap'

interface FlyToCartOptions {
    duration?: number
    scale?: number
}

export const useFlyToCart = (
    cartSelector: string,
    options?: FlyToCartOptions,
) => {
    const { duration = 0.8, scale = 0.2 } = options || {}

    const flyToCart = useCallback(
        (sourceEl: HTMLElement) => {
            const cart = document.querySelector(cartSelector)
            if (!cart || !sourceEl) return

            const img = sourceEl.querySelector('img') as HTMLElement
            if (!img) return

            const clone = img.cloneNode(true) as HTMLElement
            document.body.appendChild(clone)

            const imgRect = img.getBoundingClientRect()
            const cartRect = cart.getBoundingClientRect()

            Object.assign(clone.style, {
                position: 'fixed',
                top: `${imgRect.top}px`,
                left: `${imgRect.left}px`,
                width: `${imgRect.width}px`,
                height: `${imgRect.height}px`,
                zIndex: '9999',
                borderRadius: '10px',
                transition: 'none',
                pointerEvents: 'none',
            })

            gsap.to(clone, {
                top: cartRect.top + cartRect.height / 4,
                left: cartRect.left + cartRect.width / 4,
                width: imgRect.width * scale,
                height: imgRect.height * scale,
                opacity: 0,
                duration,
                ease: 'power2.inOut',
                onComplete: () => clone.remove(),
            })
        },
        [cartSelector, duration, scale],
    )

    return flyToCart
}
