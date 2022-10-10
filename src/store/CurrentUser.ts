/**********************************************************************
 *
 * @模块名称: User
 *
 * @模块用途: User 用户信息管理
 *
 * @date: 2021/7/31 15:43
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import {atom, selector} from 'recoil';
import {getCurrentUserFromStorage, setCurrentUserToStorage} from "@httpClient/Global";

const UserState: any = atom({
	key: 'currentUser',
	default: getCurrentUserFromStorage(),
});

export type CurrentUserType = {
	name: string; // 用户名称
	avatar?: string;
}

export type CurrentUserState = Array<CurrentUserType | any>

const CurrentUser = selector({
	key: 'filteredTodoListState',
	get: ({get}) => {
		return get(UserState);
	},
	set: ({set}, newValue) => {
		// 拦截输入 将用户信息写入到Storage
		setCurrentUserToStorage(newValue);
		set(UserState, newValue);
	},
});
/**
 * 获取OEM配置信息
 */

export default CurrentUser;