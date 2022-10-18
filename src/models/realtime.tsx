import { useEffect, useState } from 'react';
import { message } from 'antd'
import { website } from '@/consts'
import { delay } from '@/utils/utils';
const REALTIME_LIST_STACK_MAX = 100;

export default () => {
    const [orderCount, setOrderCount] = useState<number>();
    const [exceptionOrderCount, setExceptionOrderCount] = useState<number>();
    const [result, setResult] = useState<any[]>([]);
    const [processResult, setProcessResult] = useState<any>({});
    const [processResultTimes, setProcessResultTimes] = useState(0);
    const [page, setPage] = useState<number>(1);
    const [ws, setWs] = useState<any>();
    const [inited, setInited] = useState<boolean>(false);
    const init = async () => {
        setProcessResult({})
        console.log('version 0.0.4 2022-01-07 v2')
        if (window['ws']) return;
        await delay(1000)
        try {
            setWs(new WebSocket(website.socket));
        } catch (e) {
            console.error(e)
        }
        console.log("ws: connecting...");
    }

    const removeInit = () => {
        ws && ws.close();
    }

    useEffect(() => {
        if (ws) {
            ws.onopen = () => {
                console.log("ws: connected!");
                window['ws'] = ws;
            }
            ws.onmessage = (msg) => {
                let data;
                try {
                    data = JSON.parse(msg.data);
                } catch (e) {
                    console.error(data);
                }
                if (!data) {
                    message.error("实时数据解析错误!");
                    return;
                }
                console.log('ws data:', data)
                const { orderCount, exceptionOrderCount, imgList, type = '', } = data;
                if (type === 'POST_PROCESS') {
                    setProcessResult(data);
                    setProcessResultTimes(0);
                } else {
                    setProcessResult({});
                    setOrderCount(orderCount);
                    setExceptionOrderCount(exceptionOrderCount);
                    if (!inited) {
                        setInited(true)
                        setResult(imgList)
                        setPage(1)
                    } else {
                        setResult([...imgList, ...result].slice(
                            0,
                            REALTIME_LIST_STACK_MAX
                        ))
                    }
                }
            }
            ws.onerror = () => {
                setInited(false)
                init();
            }
            ws.onclose = () => {
                console.error("ws:disconnected!");
                window['ws'] = undefined;
                setInited(false)
            };
        }
    }, [result, ws, inited])

    return {
        orderCount, setOrderCount,
        exceptionOrderCount, setExceptionOrderCount,
        result, setResult,
        processResult, processResultTimes, setProcessResultTimes,
        page, setPage,
        init, removeInit
    }
}
