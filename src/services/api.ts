import { fetchGet, fetchPost, fetchPut, fetchDelete } from '@/services/fetch';
import { parseParamsToUrl } from '@/utils/utils';
export const BASE_IP = localStorage.getItem("ipUrl-history") ?
  `http://${localStorage.getItem("ipUrl-history")}/` : `http://localhost:8888/`;

// 获取项目列表
export async function getAllProject(params?: any) {
  return fetchGet(`${BASE_IP}projects?timestamp${new Date().getTime()}`);
}

// 获取历史记录 //缺陷
export async function getAllHistory(params: any) {
  return fetchPost(`${BASE_IP}track/track/list/v1`, { body: params });
}
// 获取历史记录 //尺寸
export async function getAllHistorySize(params: any) {
  return fetchPost(`${BASE_IP}track/size/list/v1`, { body: params });
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
  return fetchPost(`${BASE_IP}trigger/2000?msg=ONCE`);
}

// 选择文件路径
export async function selectFilePathService(path: string) {
  return fetchGet(`${BASE_IP}file_browser${path.indexOf('\\') === 0 ? '' : '\\'}${path}`);
}
