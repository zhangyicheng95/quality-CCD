/*
 * @name: answer
 * @author: answer
 * @Date: 2021-12-21 09:38:02
 * @description: answer
 */
import {asyncMemoized, pathJoin} from "@gaopeng123/utils";

enum Global {
	user = 'vision-portal-user',
	oem = 'vision-portal-oem' // 定制化信息
}

/**
 * 获取token信息
 * @returns {any}
 */
export const getToken = () => {
	const userInfo: any = getCurrentUserFromStorage();
	return userInfo.token || null;
};

/**
 * 获取用户保存信息
 * @returns {any}
 */
export const getCurrentUserFromStorage = () => {
	return JSON.parse(localStorage.getItem(Global.user) || '{}');
};

/**
 * 获取第一个路由
 * @param menuInfo
 */
export const getFirstPath = (menuInfo: any) => {
	const child = getIsibleMenus(menuInfo);
	return child ? getPathByRecursion(child) : '';
};

const getPathByRecursion: any = (child: any) => {
	if (child[0] && child[0].children && child[0].children.length) {
		return getPathByRecursion(child[0].children);
	}
	return child[0] ? child[0].path : '';
};
/**
 * 获取可视菜单
 * @param menuInfo
 */
export const getIsibleMenus = (menus: any = []) => {
	return menus || [];
};

/**
 * 设置用户信息
 * @param value
 */
export const setCurrentUserToStorage = (value: any) => {
	localStorage.setItem(Global.user, JSON.stringify(value));
};
/**
 * 获取本地json数据
 * @param path
 */
export const loadLocalJson = asyncMemoized(async (path: string) => {
	const res = await fetch(pathJoin(process.env.REACT_APP_PUBLICPATH || '', path));
	const json = await res.clone().json();
	return json;
});


export default Global;
