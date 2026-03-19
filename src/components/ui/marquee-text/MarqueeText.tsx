import { useEffect, useRef, useState } from 'react'
import styles from './MarqueeText.module.scss'

interface Props {
    text: string
    className?: string
    speed?: number
}

export const MarqueeText = ({ text, className = '', speed = 10 }: Props) => {
    const [isOverflowing, setIsOverflowing] = useState(false)
    const [translateX, setTranslateX] = useState(0)
    const textRef = useRef<HTMLDivElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const animationRef = useRef<number | null>(null)

    useEffect(() => {
        const checkOverflow = () => {
            if (textRef.current && containerRef.current) {
                const containerWidth = containerRef.current.clientWidth
                const textWidth = textRef.current.scrollWidth
                const isOverflow = textWidth > containerWidth
                setIsOverflowing(isOverflow)

                if (isOverflow) {
                    const maxTranslate = -(textWidth - containerWidth)
                    setTranslateX(maxTranslate)
                }
            }
        }

        checkOverflow()
        window.addEventListener('resize', checkOverflow)
        return () => window.removeEventListener('resize', checkOverflow)
    }, [text])

    useEffect(() => {
        if (!isOverflowing) return

        let startTime: number | null = null
        const duration = speed * 1000 // в миллисекундах
        const maxTranslate = translateX

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime
            const elapsed = (currentTime - startTime) % duration

            let progress = elapsed / duration
            if (progress < 0.5) {
                progress = progress * 2 // от 0 до 1
                const currentTranslate = maxTranslate * progress
                if (textRef.current) {
                    textRef.current.style.transform = `translateX(${currentTranslate}px)`
                }
            } else {
                progress = (progress - 0.5) * 2 // от 0 до 1
                const currentTranslate = maxTranslate * (1 - progress)
                if (textRef.current) {
                    textRef.current.style.transform = `translateX(${currentTranslate}px)`
                }
            }

            animationRef.current = requestAnimationFrame(animate)
        }

        animationRef.current = requestAnimationFrame(animate)

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
            if (textRef.current) {
                textRef.current.style.transform = ''
            }
        }
    }, [isOverflowing, translateX, speed])

    return (
        <div
            ref={containerRef}
            className={`${styles.container} ${className}`}
        >
            <div
                ref={textRef}
                className={styles.text}
            >
                {text}
            </div>
        </div>
    )
}