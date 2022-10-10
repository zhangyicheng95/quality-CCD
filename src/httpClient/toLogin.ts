/**********************************************************************
 *
 * @模块名称: toLongin
 *
 * @模块用途: toLongin
 *
 * @date: 2021/7/26 11:36
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import {createBrowserHistory, createHashHistory} from 'history';

export const BrowserHistory = createHashHistory();// createBrowserHistory();

export default function toLogin() {
	BrowserHistory.replace({pathname: '/login'});
}