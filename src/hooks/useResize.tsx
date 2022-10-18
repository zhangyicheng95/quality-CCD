import {useEffect, useState} from 'react';
import { debounce} from 'lodash';

interface IProps {
    width: number;
    height: number;
}
const useResize = (): IProps => {
    const [height, setHeight] = useState<number>(window.innerHeight);
    const [width, setWidth] = useState<number>(window.innerWidth);
    useEffect(() => {
        const onResize = debounce(() => {
            if (window.innerHeight > 500) {
                setHeight(window.innerHeight);
            }
            if (window.innerWidth > 500) {
                setWidth(window.innerWidth);
            }
        }, 200);
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, []);
    return { width, height }
};

export default useResize;
