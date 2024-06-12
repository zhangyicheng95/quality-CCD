import { fetchGet, fetchPost, fetchPut, fetchDelete, upload } from '@/services/fetch';
import { parseParamsToUrl } from '@/utils/utils';
import _ from 'lodash';
export const BASE_IP = localStorage.getItem('ipUrl-realtime')
  ? `http://${localStorage.getItem('ipUrl-realtime')}/`
  : `http://localhost:8866/`;
export const BASE_HISTORY_IP = localStorage.getItem('ipUrl-history')
  ? `http://${localStorage.getItem('ipUrl-history')}/`
  : `http://localhost:8867/`;

// 获取项目列表
export async function getAllProject(ip?: any) {
  return fetchGet(`${ip ? 'http://' + ip + '/' : BASE_IP}projects`);
}
// 获取列表任务状态
export const getListStatusService = () => {
  return fetchGet(`${BASE_IP}tasks`);
};
// 获取历史记录 //缺陷
export async function getAllHistory(params: any) {
  return fetchGet(`${BASE_HISTORY_IP}projects/list`, {
    params: {
      func: 'SELECT',
      data: [params],
    },
  });
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
export async function getFlowStatusService(id: string, url?: string) {
  return fetchGet(
    `${!!url ? `${url?.indexOf('http') > -1 ? `${url}/` : `http://${url}/`}` : BASE_IP}task/${id}`,
  );
}
// 业务启动
export async function startFlowService(id: string, url?: string, params?: any) {
  if (!!params && !_.isEmpty(params)) {
    return fetchPost(
      `${
        !!url ? `${url?.indexOf('http') > -1 ? `${url}/` : `http://${url}/`}` : BASE_IP
      }task/${id}`,
      { body: params },
    );
  } else {
    return fetchPost(
      `${
        !!url ? `${url?.indexOf('http') > -1 ? `${url}/` : `http://${url}/`}` : BASE_IP
      }task/${id}`,
    );
  }
}
// 业务停止
export async function stopFlowService(id: string, url?: string) {
  return fetchDelete(
    `${!!url ? `${url?.indexOf('http') > -1 ? `${url}/` : `http://${url}/`}` : BASE_IP}task/${id}`,
  );
}
// 自助触发推送
export async function touchFlowService() {
  return fetchPost(`${BASE_IP}trigger/2000?msg=ONCE`);
}
// 选择文件路径
export async function selectFilePathService(path: string) {
  return fetchGet(`${BASE_IP}file_browser${path?.indexOf('\\') === 0 ? '' : '\\'}${path}`);
}
// 根据id获取缓存
export async function getStorageService(id: string) {
  return fetchGet(`${BASE_IP}project_cache/${id}`);
}
// 根据id保存缓存
export async function setStorageService(id: string, params?: any) {
  return fetchPost(`${BASE_IP}project_cache/${id}`, { body: params });
}
// 根据id删除缓存
export async function deleteStorageService(id: string) {
  return fetchDelete(`${BASE_IP}project_cache/${id}`);
}
// 获取日志信息
export async function getLogService(id: string, params: any) {
  return fetchPost(`${BASE_IP}project_log/${id}`, { body: params });
}
// 登录
export async function login(params: any) {
  return fetchPost(`${BASE_IP}login`, { body: params });
}
// 退出登录
export async function outLogin() {}

export async function btnFetch(type: string, url: string, params = {}, options?: any) {
  if (url?.indexOf('/') === 0) {
    url = url.slice(1);
  }
  if (url?.indexOf(':') < 0) {
    url = BASE_IP + url;
  }
  if (url?.indexOf('http') < 0) {
    url = 'http://' + url;
  }
  if (type === 'get') {
    if (_.isObject(params)) {
      return fetchGet(`${url}?${parseParamsToUrl(params)}`, { ...options });
    }
    if (_.isString(params)) {
      return fetchGet(`${url}/${params}`);
    }
    return fetchGet(url);
  }
  if (type === 'delete') {
    if (_.isObject(params)) {
      return fetchDelete(url, { params, ...options });
    }
    if (!_.isUndefined(params) && !_.isNull(params) && !!params) {
      return fetchDelete(`${url}/${params}`);
    }
    return fetchDelete(url);
  } else if (type === 'post') {
    if (_.isObject(params)) {
      return fetchPost(url, {
        body:
          options?.headers['Content-Type'] === 'application/x-www-form-urlencoded'
            ? parseParamsToUrl(params)
            : params,
        ...options,
      });
    }
    if (!_.isUndefined(params) && !_.isNull(params) && !!params) {
      return fetchPost(`${url}/${params}`);
    }
    return fetchPost(url);
  } else if (type === 'put') {
    if (_.isObject(params)) {
      return fetchPut(url, { body: params, ...options });
    }
    if (!_.isUndefined(params) && !_.isNull(params) && !!params) {
      return fetchPut(`${url}/${params}`);
    }
    return fetchPut(url);
  } else if (type === 'upload') {
    if (_.isObject(params)) {
      return upload(url, { body: params, ...options });
    }
  }
}
