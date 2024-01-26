import { getUserAuthList } from "./utils/utils";

/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: any) {
  const userAuthList = getUserAuthList();

  return {
    canAdmin: true,//currentUser && currentUser.access === 'admin',
    canMark: false,
    canHistory: userAuthList?.includes('history'),
    canControl: userAuthList?.includes('control'),
    canSetting: userAuthList?.includes('setting'),
    canLog: userAuthList?.includes('log'),
    canFileText: false //process.env.NODE_ENV === 'development'
  };
}
