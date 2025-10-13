import { useState } from 'react'
import { Countdown } from './countdown.tsx'
import { TimeOutReachedModal } from './timeout-reached-modal.tsx'

interface TimeLimitProps {
    readonly timeLimit: number
    readonly onEvaluate: () => void
}

export const TimeLimit = ({ timeLimit, onEvaluate }: TimeLimitProps) => {
    const [timeoutReached, setTimeoutReached] = useState(false)

    return (
        <div>
            <Countdown setTimeoutReached={setTimeoutReached} timeLimit={timeLimit} />
            {timeoutReached && <TimeOutReachedModal onEvaluate={onEvaluate} timeoutReached={timeoutReached} />}
        </div>
    )
}
