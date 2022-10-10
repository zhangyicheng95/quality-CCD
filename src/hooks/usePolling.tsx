import { useState, useEffect } from 'react'

const usePolling: any = (fn: Function, time: number = 10000) => {
    const [timer, setTimer] = useState<any>(1)

    useEffect(() => {
        if (!timer) return () => {}
        fn()
        const timeout = setTimeout(() => {
            setTimer(timeout)
        }, time)
        return () => clearTimeout(timeout)
    }, [timer]);

    return {
        exec: () => setTimer(1),
        cancel: () => setTimer(0)
    };
};

export default usePolling;
