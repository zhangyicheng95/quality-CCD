import { staticsOrderList, staticsImgList, queryImgList, getSiblingImg, auditImg, staticsLabelList } from "@/services";
import { useEffect, useState } from 'react';
import { message } from 'antd';

const moment = require("moment");
const getInitialList = () => ({
    page: 1,
    totalRecord: 0,
    size: 20,
    contents: [],
});
const getInitialOrderQuery = (currentType = 'order') => ({
    currentType,
    timeRange: [moment(new Date().getTime() - 7 * 24 * 60 * 60 * 1000), moment(new Date().getTime())],
});
const getInitialImgQuery = () => ({
    id: undefined,
    timeRange: [],
    qualified: -1,
    isAudited: 3,
});
const formatQuery = (query) => {
    const { timeRange = [], qualified, ...rest } = query;
    const startTime =
        !!timeRange && timeRange[0] ? moment(timeRange[0]).format("YYYY-MM-DD HH:mm:ss") : undefined;
    const endTime =
        !!timeRange && timeRange[1] ? moment(timeRange[1]).format("YYYY-MM-DD HH:mm:ss") : undefined;
    let res = {
        ...rest,
        startTime,
        endTime,
    };
    qualified && Object.assign(res, {
        qualified: qualified === 1
    })
    return res
};
let preventNextQuery = false;

export default () => {
    const [ready, setReady] = useState<boolean>(false)
    const [orderQuery, setOrderQuery] = useState<any>(getInitialOrderQuery())
    const [orderList, setOrderList] = useState<any>({});

    const [currentOrderIdList, setCurrentOrderIdList] = useState<any>([]);
    const [currentOrderId, setCurrentOrderId] = useState<any>('');
    const [imgDrawerVisible, setImgDrawerVisible] = useState<boolean>(false);
    const [imgQuery, setImgQuery] = useState<any>(getInitialImgQuery());
    const [imgList, setImgList] = useState<any>(getInitialList());

    const [imgViewerLoading, setImgViewerLoading] = useState<boolean>(false);
    const [imgViewerData, setImgViewerData] = useState<any>({});
    const [imgViewerVisible, setImgViewerVisible] = useState<boolean>(false);

    const resetOrderQuery = (currentType: string) => setOrderQuery(getInitialOrderQuery(currentType));
    const resetImgQuery = () => setImgQuery(getInitialImgQuery());
    const resetImgDrawer = () => {
        setImgList(getInitialList());
        setImgQuery(getInitialImgQuery());
        setCurrentOrderId(undefined);
        setCurrentOrderIdList([]);
        setImgDrawerVisible(false);
    }
    const patchImg = (id, isAudited) => setImgList({
        ...imgList,
        contents: imgList.contents.map(i => i.id === id ? { ...i, isAudited } : i)
    })
    const unmount = (currentType: string) => {
        setReady(false)
        resetImgDrawer()
        resetOrderQuery(currentType)
        setOrderList({})
    }
    const loadOrderList = () => {
        if (preventNextQuery) {
            preventNextQuery = false
            return
        }
        const { currentType, ...rest } = orderQuery;
        if (currentType === 'order') {
            staticsOrderList(
                formatQuery({
                    ...rest,
                })
            ).then((res) => {
                console.log('res', res);
                if (res) {
                    setOrderList(res);
                } else {
                    message.error(res?.message || '接口异常');
                }
            });
        } else if (currentType === 'img') {
            staticsImgList(
                formatQuery({
                    ...rest,
                })
            ).then((res) => {
                console.log('res', res);
                if (res) {
                    setOrderList(res);
                } else {
                    message.error(res?.message || '接口异常');
                }
            });
        } else if (currentType === 'label') {
            staticsLabelList(
                formatQuery({
                    ...rest,
                })
            ).then((res) => {
                console.log('res', res);
                if (res) {
                    setOrderList(res);
                } else {
                    message.error(res?.message || '接口异常');
                }
            });
        }
    }
    const handleViewOrder = (order) => {
        if (order?.orderId && order?.orderId[0]) {
            setCurrentOrderIdList(order?.orderId || [])
            setCurrentOrderId(order?.orderId[0])
        }
        setImgDrawerVisible(true)
        // loadImgList()
    }
    const loadImgList = async (query = {} as any) => {
        const { page, size } = imgList
        const { isAudited, ...rest } = formatQuery({
            ...imgQuery,
            // orderId: currentOrderId,
            page,
            size,
            ...query,
        })
        let data = { ...rest }
        if (isAudited !== 3) {
            Object.assign(data, { isAudited });
        }
        const res = await queryImgList(data);
        // console.log(res)
        res && setImgList(res)
    }
    const loadSiblingImg = async (query = {}) => {
        const { isAudited, ...rest } = formatQuery({
            ...imgQuery,
            orderId: currentOrderId,
            ...query,
        })
        let data = { ...rest }
        if (isAudited !== 3) {
            Object.assign(data, { isAudited })
        }
        const res = await getSiblingImg(data)
        // console.log(res)
        res && setImgViewerData(res)
    }
    const handleAudit = async (audit) => {
        setImgViewerLoading(true)
        const res = await auditImg({
            audit,
            id: imgViewerData.id,
        });
        // console.log(res)
        res && setImgViewerData(res)
        setImgViewerLoading(false)
    }

    useEffect(() => {
        ready && loadOrderList();
    }, [ready, orderQuery])
    useEffect(() => {
        imgDrawerVisible && loadImgList({
            page: 1,
            //  orderId: currentOrderId, 
        })
    }, [ready, imgDrawerVisible, imgQuery, currentOrderId])

    return {
        ready, setReady,
        orderQuery, setOrderQuery,
        orderList, setOrderList, loadOrderList,
        currentOrderIdList, setCurrentOrderIdList,
        currentOrderId, setCurrentOrderId,
        imgDrawerVisible, setImgDrawerVisible,
        imgList, setImgList, loadImgList,
        imgQuery, setImgQuery,
        resetOrderQuery, resetImgQuery, resetImgDrawer,
        patchImg, unmount, staticsOrderList, queryImgList,
        handleAudit, loadSiblingImg, handleViewOrder,
        imgViewerVisible, imgViewerData, imgViewerLoading,
        setImgViewerVisible, setImgViewerData, setImgViewerLoading
    }
};
