/*
 * @name: answer
 * @author: answer
 * @Date: 2021-12-21 09:38:02
 * @description: answer
 */
/**********************************************************************
 *
 * @模块名称: api
 *
 * @模块用途: api
 *
 * @date: 2021/8/4 9:28
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import { get, post } from "@httpClient/index";

console.log("process.env.REACT_APP_ENV", process.env.REACT_APP_ENV);

export const url = localStorage.getItem("ipUrl") || "43.138.71.42:8080";
export const getStationID = async () => {
  return await post(`http://${url}/track/station`);
};
export const getCarDetail = async (id: string) => {
  return await post(`http://${url}/track/data`, {
    body: {
      stationID: id,
    },
  });
};

export const setScope = async (params: any) => {
  const res = await get(`${url}/screen/fetch/v1/setScope`, { params });
  console.log(res);
};

export const showProjectDetail = async (params: any) => {
  const res = await get(`${url}/screen/fetch/v1/showProjectDetail`, { params });
  if (res.code === 200) {
    return res.data;
  }
  return {};
};

// export const deviceSearch =  async(body:any) => {
//     const res = await post(`/alarmAPI/device/search`,{body});
// }
// export const deviceSearch =  async(params:any) => {

//     const res = await get(`http://10.88.212.154:31006/screen/fetch/v1/findAll`,{params});
// }
export const basicInfo = (body: any) =>
  post(`/deviceAPI/nebula/device/devices/v1?pageNum=1&pageSize=10`, { body });
export type queryParams = {
  type: string;
  code: string;
  cameraTypeCode: string;
  type1?: string;
  type2?: string;
};
export const getData = async (params: queryParams) => {
  if (params.type === "3") {
    const res = await get(
      `/api/equipment/v1/vision/portal2/${params.type}/${params.code}?rightCategory=${params.cameraTypeCode}`
    );
    if (res.code === 200) {
      return res.data;
    }
  } else {
    const res = await get(
      `/api/equipment/v1/vision/portal2/${params.type}/${params.code}?rightCategory=${params.cameraTypeCode}`
    );
    if (res.code === 200) {
      return res.data;
    }
  }
  return false;
};
export const getCameraList = async () => {
  const res = await get(`/api/equipment/v1/vision/camera/type`);
  if (res.code === 200) {
    return res.data;
  }
  return [];
};
export const getSceneList = async () => {
  const res = await get(`/api/equipment/v1/vision/right/category`);
  if (res.code === 200) {
    return res.data;
  }
  return [];
};
export const getCameraUrl = async (cameraIp: string) => {
  const res = await get(
    `/api/equipment/v1/vision/cameraSnapUrl?cameraIp=${cameraIp}`
  );
  if (res.code === 200) {
    return res.data;
  }
  return false;
};

export const getTableData = async (params: queryParams) => {
  const res = await get(
    `/api/equipment/v1/vision/pop/${params.type1}/${params.type}/${params.code}?rightCategory=${params.cameraTypeCode}&f=${params.type2}`
  );
  if (res.code === 200) {
    return res.data;
  }
  return [];
};
