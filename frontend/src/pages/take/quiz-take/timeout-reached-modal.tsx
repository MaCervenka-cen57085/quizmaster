import { useEffect, useRef } from 'react'
import { EvaluateButton } from './buttons'

export const TimeOutReachedModal = ({
    timeoutReached,
    onEvaluate,
}: {
    timeoutReached: boolean
    onEvaluate: () => void
}) => {
    const dialogRef = useRef<HTMLDialogElement>(null)
    useEffect(() => {
        if (timeoutReached && dialogRef.current) {
            dialogRef.current.showModal()
        }
    })

    return (
        <dialog ref={dialogRef}>
            <p>Game over time</p>
            <EvaluateButton onClick={onEvaluate} />
        </dialog>
    )
}
