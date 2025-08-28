import { useEffect, useState } from 'react'

export const Countdown = ({ setTimeoutReached }: { setTimeoutReached: (value: boolean) => void }) => {
    const durationMs = 2 * 60 * 1000 // 2 minuty

    const [timeLeft, setTimeLeft] = useState(durationMs)

    useEffect(() => {
        const endTime = Date.now() + durationMs
        const interval = setInterval(() => {
            const newTimeLeft = endTime - Date.now()
            if (newTimeLeft <= 0) {
                clearInterval(interval)
                setTimeLeft(0)
            } else {
                console.log('time left:', newTimeLeft)
                setTimeLeft(newTimeLeft)
            }
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (timeLeft <= 0) {
            setTimeoutReached(true)
        }
    }, [timeLeft, setTimeoutReached])

    const minutes = Math.floor(timeLeft / 60000)
    const seconds = Math.floor((timeLeft % 60000) / 1000)

    return <div data-testId="timerID">{`${minutes}:${seconds.toString().padStart(2, '0')}`}</div>
}
