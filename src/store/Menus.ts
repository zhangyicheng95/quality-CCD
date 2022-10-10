/**********************************************************************
 *
 * @模块名称: Menus
 *
 * @模块用途: Menus
 *
 * @date: 2021/8/2 18:42
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import {atom} from 'recoil';
import {loadLocalJson} from "@httpClient/Global";

const Menus = atom({
	key: 'menus',
	default: [],
});
/**
 * 获取json数据
 */
export const menuData = loadLocalJson('/json/menus.json');
export default Menus;
