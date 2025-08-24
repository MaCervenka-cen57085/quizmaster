import { useEffect, useRef } from 'react'

export const useApi = <T>(id: string | undefined, fetch: (id: string) => Promise<T>, setData: (data: T) => void) => {
    // React boogaloo to avoid infinite useEffect loop
    const fetchRef = useRef(fetch)
    const setDataRef = useRef(setData)
    fetchRef.current = fetch
    setDataRef.current = setData

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                console.log('fetchData', id)
                const data = await fetchRef.current(id)
                setDataRef.current(data)
            }
        }
        fetchData()
    }, [id])
}
