import { Button } from '@/shared/ui/kit'
import { SingleValue } from 'react-select'
import { GoBack } from '@/shared/ui/kit-pro'
import { Input } from '@/shared/ui/kit/Input'
import { Select } from '@/shared/ui/kit/Select'
import { Form, FormItem } from '@/shared/ui/kit/Form'
import { DatePicker } from '@/shared/ui/kit/DatePicker'
import { useCartStore } from '@/shared/store/useCartStore'
import { FocusEvent, useEffect, useRef, useState } from 'react'

// Virtual Keyboard Type Definition
interface NavigatorWithKeyboard extends Navigator {
    virtualKeyboard?: {
        overlaysContent: boolean
    }
}

const paymentOptions: Option[] = [
    { value: 'cash', label: 'Наличные' },
    { value: 'card', label: 'Карта' },
    { value: 'transfer', label: 'Перевод' },
]

type Option = {
    value: string
    label: string
}

interface FormDataType {
    paymentType: Option | null
    orderDate: Date | null
    additionalInfo: string | null
}

export const CheckoutPage = () => {
    const getTotalPrice = useCartStore((state) => state.getTotalPrice)
    const cart = useCartStore((state) => state.cart)

    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        const tg = window.Telegram?.WebApp

        if (tg) {
            // Telegram Web App'ni kengaytirish
            tg.expand()

            // Virtual Keyboard sozlamalari
            const nav = navigator as NavigatorWithKeyboard
            if ('virtualKeyboard' in nav && nav.virtualKeyboard) {
                nav.virtualKeyboard.overlaysContent = true
            }

            // Viewport height'ni dinamik o'rnatish
            const setViewportHeight = () => {
                const vh = window.innerHeight * 0.01
                document.documentElement.style.setProperty('--vh', `${vh}px`)
            }

            setViewportHeight()
            window.addEventListener('resize', setViewportHeight)

            // Visualviewport API (agar mavjud bo'lsa)
            if (window.visualViewport) {
                const handleViewportChange = () => {
                    const viewport = window.visualViewport
                    if (viewport) {
                        document.documentElement.style.setProperty(
                            '--viewport-height',
                            `${viewport.height}px`,
                        )
                    }
                }

                window.visualViewport.addEventListener(
                    'resize',
                    handleViewportChange,
                )
                window.visualViewport.addEventListener(
                    'scroll',
                    handleViewportChange,
                )

                return () => {
                    window.removeEventListener('resize', setViewportHeight)
                    if (window.visualViewport) {
                        window.visualViewport.removeEventListener(
                            'resize',
                            handleViewportChange,
                        )
                        window.visualViewport.removeEventListener(
                            'scroll',
                            handleViewportChange,
                        )
                    }
                }
            }

            return () => {
                window.removeEventListener('resize', setViewportHeight)
            }
        }
    }, [])

    const handleFocus = (
        e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        // Telegram uchun maxsus
        if (window.Telegram?.WebApp) {
            // Sahifani kengaytirish
            window.Telegram.WebApp.expand()

            // Scroll'ni bloklash
            document.body.style.overflow = 'hidden'
            document.documentElement.style.overflow = 'hidden'

            // Input elementni to'g'ri joylashtirish
            setTimeout(() => {
                e.target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest',
                })
            }, 100)
        }
    }

    const handleBlur = () => {
        // Scroll'ni qayta yoqish
        document.body.style.overflow = ''
        document.documentElement.style.overflow = ''
    }
    const handleSubmit = () => {
        // Ma'lumotlarni Telegram bot'ga yuborish
        if (window.Telegram?.WebApp) {
            const data = {
                ...formData,
            }

            console.log(data)
        }
    }

    const [formData, setFormData] = useState<FormDataType>({
        paymentType: null as Option | null,
        orderDate: null,
        additionalInfo: '',
    })

    const handleSubmitOrder = () => {
        console.log('Order submitted:', {
            cart,
            totalPrice: getTotalPrice(),
            ...formData,
        })
        // Здесь можно добавить логику отправки заказа
    }

    const totalAmount = getTotalPrice()
    const uzsAmount = `${totalAmount.toLocaleString()} сум`
    const usdAmount = `${(totalAmount / 12500).toFixed(2)}$`

    return (
        <div className="pb-16">
            <div className="bg-white w-full">
                <GoBack text={'Оформление заказа'} />
            </div>
            <div className="mt-4">
                <p>
                    После оформления начнутся этапы по выполнению вашего заказа
                </p>
            </div>
            <div className="mt-4">
                <Form onSubmit={handleSubmit}>
                    <FormItem label="Выберите тип оплаты">
                        <Select
                            placeholder="Выберите"
                            options={paymentOptions}
                            isSearchable={false}
                            value={formData.paymentType}
                            onChange={(option: SingleValue<Option>) =>
                                setFormData({
                                    ...formData,
                                    paymentType: option,
                                })
                            }
                        />
                    </FormItem>

                    <FormItem label="Дата заказа">
                        <DatePicker
                            placeholder="Выберите"
                            value={formData.orderDate}
                            onChange={(date) =>
                                setFormData({
                                    ...formData,
                                    orderDate: date,
                                })
                            }
                        />
                    </FormItem>

                    <FormItem label="Дополнительная информация">
                        <Input
                            ref={textareaRef}
                            textArea
                            rows={4}
                            placeholder="Введите дополнительную информацию"
                            value={formData.additionalInfo}
                            onBlur={handleBlur}
                            onFocus={handleFocus}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    additionalInfo: e.target.value,
                                })
                            }
                        />
                    </FormItem>
                </Form>
            </div>
            <div>
                <div className="flex-1 border border-red-500 w-full p-0 px-4">
                    <div className="border-t pt-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                                Общая сумма:
                            </span>
                            <div className="text-right">
                                <p className="text-base font-bold text-cyan-600">
                                    {usdAmount}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {uzsAmount}
                                </p>
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="solid"
                        className="w-full mt-2 rounded-lg font-medium"
                        disabled={!formData.paymentType || !formData.orderDate}
                        onClick={handleSubmitOrder}
                    >
                        Оформить
                    </Button>
                </div>
            </div>
        </div>
    )
}
