import { useState, type SyntheticEvent } from 'react'

export const tryCatch = async <T>(setErrorMessage: (message: string) => void, fn: () => Promise<T>): Promise<T> => {
    setErrorMessage('')
    try {
        return await fn()
    } catch (error) {
        setErrorMessage('Unexpected Error')
        throw error
    }
}

type Handler<E extends SyntheticEvent> = (e: E) => void

export const preventDefault =
    <E extends SyntheticEvent>(handle: Handler<E>): Handler<E> =>
    (e: E): void => {
        e.preventDefault()
        handle(e)
    }

type AlterValue<T> = (value: T) => void
type StateArray<T> = [readonly T[], AlterValue<T>, AlterValue<T>, AlterValue<T>]

export const useStateArray = <T>(initialValue: T[]): StateArray<T> => {
    const [value, setValue] = useState<readonly T[]>(initialValue)

    const addValue = (value: T) => setValue(prev => [...prev, value])
    const removeValue = (value: T) => setValue(prev => prev.filter(v => v !== value))

    const toggleValue = (value: T) =>
        setValue(prev => (prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]))

    return [value, toggleValue, addValue, removeValue]
}
