import { queryOrderList, getOrderDetail, queryImgList, getSiblingImg, auditImg } from "@/services";
import { useEffect, useState } from 'react';
const moment = require("moment");
const getInitialList = () => ({
    page: 1,
    totalRecord: 0,
    size: 20,
    contents: [],
});
const getInitialOrderQuery = () => ({
    orderId: undefined,
    timeRange: [],
});
const getInitialImgQuery = () => ({
    id: undefined,
    timeRange: [],
    qualified: 0,
    isAudited: 3,
});
const formatQuery = (query) => {
    const { timeRange = [], qualified, ...rest } = query;
    const startTime =
        timeRange[0] && moment(timeRange[0]).format("YYYY-MM-DD HH:mm:ss");
    const endTime =
        timeRange[1] && moment(timeRange[1]).format("YYYY-MM-DD HH:mm:ss");
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
// @ts-ignore
const systemType = window?.QUALITY_CONFIG?.type;

export default () => {
    const [ready, setReady] = useState<boolean>(false)
    const [orderQuery, setOrderQuery] = useState<any>(getInitialOrderQuery())
    const [orderList, setOrderList] = useState<any>(getInitialList())

    const [currentOrderId, setCurrentOrderId] = useState<any>()
    const [imgDrawerVisible, setImgDrawerVisible] = useState<boolean>(false)
    const [imgQuery, setImgQuery] = useState<any>(getInitialImgQuery())
    const [imgList, setImgList] = useState<any>(getInitialList())
    const [processResult, setProcessResult] = useState<any>({});
    const [imgViewerLoading, setImgViewerLoading] = useState<boolean>(false)
    const [imgViewerData, setImgViewerData] = useState<any>({})
    const [imgViewerVisible, setImgViewerVisible] = useState<boolean>(false)

    const resetOrderQuery = () => setOrderQuery(getInitialOrderQuery())
    const resetImgQuery = () => setImgQuery(getInitialImgQuery())
    const resetImgDrawer = () => {
        setImgList(getInitialList())
        setImgQuery(getInitialImgQuery())
        setCurrentOrderId(undefined)
        setImgDrawerVisible(false)
    }
    const patchImg = (id, isAudited) => setImgList({
        ...imgList,
        contents: imgList.contents.map(i => i.id === id ? { ...i, isAudited } : i)
    })
    const unmount = () => {
        setReady(false)
        resetImgDrawer()
        resetOrderQuery()
        setOrderList(getInitialList())
    }
    const loadOrderList = async (query = {} as any) => {
        if (preventNextQuery) {
            preventNextQuery = false
            return
        }
        if (query.size) {
            preventNextQuery = true
        }
        const { page, size } = orderList
        const res = await queryOrderList(
            formatQuery({
                ...orderQuery,
                page,
                size,
                ...query,
                type: systemType === 'xd' ? 2 : 1
            })
        )
        if (res) {
            setOrderList(res)
        }
    };
    const handleOrderDetail = async (orderId: string) => {
        if (orderId) {
            const res = await getOrderDetail(orderId);
            console.log(res)
            res && setProcessResult(res);
        }
    }
    const handleViewOrder = (order) => {
        setCurrentOrderId(order.orderId)
        setImgDrawerVisible(true)
        // loadImgList()
    }
    const loadImgList = async (query = {} as any) => {
        const { page, size } = imgList
        const { isAudited, ...rest } = formatQuery({
            ...imgQuery,
            orderId: currentOrderId,
            page,
            size,
            ...query,
            type: systemType === 'xd' ? 2 : 1
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
        const res = await getSiblingImg(Object.assign({}, data, {
            type: systemType === 'xd' ? 2 : 1
        }))
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
        ready && loadOrderList({ page: 1 })
    }, [ready, orderQuery])
    useEffect(() => {
        ready && imgDrawerVisible && loadImgList({ page: 1, orderId: currentOrderId, })
    }, [ready, imgDrawerVisible, imgQuery, currentOrderId])

    return {
        ready, setReady,
        orderQuery, setOrderQuery,
        orderList, setOrderList, loadOrderList,
        currentOrderId, setCurrentOrderId,
        imgDrawerVisible, setImgDrawerVisible,
        imgList, setImgList, loadImgList,
        imgQuery, setImgQuery,
        resetOrderQuery, resetImgQuery, resetImgDrawer,
        patchImg, unmount, queryOrderList, queryImgList,
        handleAudit, loadSiblingImg, handleViewOrder,
        imgViewerVisible, imgViewerData, imgViewerLoading,
        setImgViewerVisible, setImgViewerData, setImgViewerLoading,
        handleOrderDetail, processResult, setProcessResult,
    }
};
