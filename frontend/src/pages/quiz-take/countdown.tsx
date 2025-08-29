import { useEffect, useState } from 'react'

export const Countdown = ({
    setTimeoutReached,
    timeLimit,
}: { setTimeoutReached: (value: boolean) => void; timeLimit: number }) => {
    const durationMs = (timeLimit ?? 120) * 1000 // convert from secs to ms

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
    }, [durationMs])

    useEffect(() => {
        if (timeLeft <= 0) {
            setTimeoutReached(true)
        }
    }, [timeLeft, setTimeoutReached])

    const minutes = Math.floor(timeLeft / 60000)
    const seconds = Math.floor((timeLeft % 60000) / 1000)

    return <div data-testId="timerID">{`${minutes}:${seconds.toString().padStart(2, '0')}`}</div>
}
