import React, { useEffect, useState } from 'react'
import { toTime } from 'utils/utils'

const Counter = ({ time = 0, onFinish = () => { } }) => {
    const [counter, setCounter] = useState(time)
    useEffect(() => {
        if (counter > 0) {
            const interval = setInterval(() => {
                setCounter(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            onFinish()
        }
    }, [counter])

    return <h6 className='mb-0'>{toTime(counter)}</h6>
}
export default Counter
