/**********************************************************************
 *
 * @模块名称: Intercept
 *
 * @模块用途: Intercept 拦截器
 *
 * @date: 2021/7/26 8:26
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import {Intercept, Option} from "@gaopeng123/fetch";
import {getToken} from "@httpClient/Global";

const intercept: Intercept = {
	request: function (url: string, config: Option) {
		// Modify the url or config here
		// console.log('request', config);
		if (config?.headers) {
			// 此处定义token 获取其他
			config.headers.token = "jaFKi6fQ+o9IbcxSJUVbhELuOilniWo0";
		}
		return [url, config];
	},
	
	requestError: function (error: Error) {
		// console.log('requestError');
		return Promise.reject(error);
	},
	
	response: (response: Response): Promise<any> => {
		// Modify the reponse object
		return new Promise((resolve, reject) => {
			resolve(response);
		});
	},
	
	responseError: function (error: Error) {
		// Handle an fetch error
		// console.log('responseError');
		return Promise.reject(error);
	}
};

export default intercept;
