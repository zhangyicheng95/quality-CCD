import { request } from 'umi';
const { origin, pathname = '/', href } = window.location;
const BASE_IP = (href.indexOf('iframe') > -1 || pathname !== '/') ? `${origin + pathname}` :
    `http://${localStorage.getItem("ipUrl-history")}${pathname}` || `http://localhost:19820${pathname}`;

// 历史数据
export const queryOrderList = params => request(`${BASE_IP}track/order/list/v1`, { params });
export const getOrderDetail = orderId => request(`${BASE_IP}track/order/post/detail?orderId=${orderId}`, { method: 'POST', });
export const queryImgList = params => request(`${BASE_IP}track/pic/list/v1`, { params });
export const getSiblingImg = params => request(`${BASE_IP}track/pic/next`, { params });
export const auditImg = data => request(`${BASE_IP}track/pic`, { method: 'POST', data });

// 数据统计
export const staticsOrderList = params => request(`${BASE_IP}track/statics/order`, { params });
export const staticsImgList = params => request(`${BASE_IP}track/statics/img`, { params });
export const staticsLabelList = params => request(`${BASE_IP}track/statics/label`, { params });
