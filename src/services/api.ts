import { fetchGet, fetchPost, fetchPut, fetchDelete } from '@/services/fetch';
import _ from 'lodash';
export const BASE_IP = localStorage.getItem("ipUrl-realtime") ?
  `http://${localStorage.getItem("ipUrl-realtime")}/` : `http://localhost:8866/`;
export const BASE_HISTORY_IP = localStorage.getItem("ipUrl-history") ?
  `http://${localStorage.getItem("ipUrl-history")}/` : `http://localhost:8867/`;

// 获取项目列表
export async function getAllProject(params?: any) {
  return fetchGet(`${BASE_IP}projects`);
}

// 获取列表任务状态
export const getListStatusService = () => {
  return fetchGet(`${BASE_IP}tasks`);
};

// 获取历史记录 //缺陷
export async function getAllHistory(params: any) {
  return fetchPost(`${BASE_HISTORY_IP}track/list/v1`, { body: params });
}
// 获取历史记录 //尺寸
export async function getAllHistorySize(params: any) {
  return fetchPost(`${BASE_HISTORY_IP}size/list/v1`, { body: params });
}

// 根据id获取项目详情
export async function getParams(id: string) {
  return fetchGet(`${BASE_IP}project/${id}`);
}

// 根据id修改项目
export async function updateParams(params: any) {
  const { id, data } = params;
  return fetchPut(`${BASE_IP}project/${id}`, { body: data });
}

// 根据id获取任务状态（首页轮训执行）
export async function getFlowStatusService(id: string) {
  return fetchGet(`${BASE_IP}task/${id}`);
}

// 业务启动
export async function startFlowService(id: string) {
  return fetchPost(`${BASE_IP}task/${id}`);
}

// 业务停止
export async function stopFlowService(id: string) {
  return fetchDelete(`${BASE_IP}task/${id}`);
}

// 自助触发推送
export async function touchFlowService() {
  return fetchPost(`${BASE_IP}trigger/2006?msg=ONCE`);
}

// 选择文件路径
export async function selectFilePathService(path: string) {
  return fetchGet(`${BASE_IP}file_browser${path.indexOf('\\') === 0 ? '' : '\\'}${path}`);
}

// 登录
export async function login(params: any) {

}

// 退出登录
export async function outLogin() {

}

export async function btnFetch(type: string, url: string, params: any) {
  if (url.indexOf('http') < 0) {
    url = 'http://' + url;
  }
  if (type === 'get') {
    if (_.isObject(params)) {
      return fetchGet(url, { params, });
    }
    return fetchGet(`${url}/${params}`);
  } if (type === 'delete') {
    if (_.isObject(params)) {
      return fetchDelete(url, { params, });
    }
    return fetchDelete(`${url}/${params}`);
  } else if (type === 'post') {
    if (_.isObject(params)) {
      return fetchPost(url, { body: params });
    }
    return fetchPost(`${url}/${params}`);
  } else if (type === 'put') {
    if (_.isObject(params)) {
      return fetchPut(url, { body: params });
    }
    return fetchPut(`${url}/${params}`);
  }
}