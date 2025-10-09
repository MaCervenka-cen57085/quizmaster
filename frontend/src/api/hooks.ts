import { useCallback, useEffect } from 'react'

export const useApi = <T>(id: string | undefined, fetch: (id: string) => Promise<T>, setData: (data: T) => void) => {
    const fetchData = useCallback(async () => {
        if (id) {
            const data = await fetch(id)
            setData(data)
        }
    }, [id])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    return fetchData
}
