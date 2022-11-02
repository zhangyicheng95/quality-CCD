// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
const { origin, pathname = '/', href } = window.location;
const BASE_IP = localStorage.getItem("ipUrl-history") ?
  `http://${localStorage.getItem("ipUrl-history")}${pathname}` : `http://localhost:19820${pathname}`;
console.log(BASE_IP)
/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>(`${BASE_IP}api/notices`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function getParams(params: any, options?: { [key: string]: any },) {
  return request<API.Params>(`${BASE_IP}api/params`, {
    method: 'GET',
    params,
    ...(options || {}),
  });
}