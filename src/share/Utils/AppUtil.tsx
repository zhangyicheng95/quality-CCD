/**
 *@模块名称：TabChangeService
 *
 *@创建人：ligaoming
 *
 *@作用：基础方法封装
 *
 *@date 2018/5/16
 *
 */
import {isArray, isEmptyObject, isObject, isString, isUndefined} from "@gaopeng123/utils";

export default class AppUtil {
	/**
	 * 对象和string互转方法
	 */
	public static objToStr(val: any, direction = true) {
		if (direction && isObject(val)) {
			return JSON.stringify(val);
		} else if (!direction &&
			(val === '{}' || (isString(val) && ((val.startsWith('{') && val.endsWith('}')) || (val.startsWith('[') && val.endsWith(']')))))) {
			return (new Function('return ' + val))();
		} else {
			return val;
		}
	}
	
	/**
	 * 根据指定key将 对象数组 转换成对象
	 * @param arr, key
	 * @returns {object}
	 */
	public static arrayToObject(arr: any[], key?: any) {
		if (!arr)
			throw new Error(`arrayToObject must provide array param!`);
		if (!isArray(arr))
			throw new Error(`arrayToObject provided arr param must be array type!`);
		
		if (!key)
			key = 'key';
		
		if (!isString(key))
			throw new Error(`arrayToObject provided key param must be string type!`);
		
		let acptObj: any = {};
		arr.forEach(item => {
			acptObj[item[key]] = item;
		});
		return acptObj;
	}
	
	/**
	 * 对象转换成对象数组
	 * @param obj
	 * @returns {Array}
	 */
	public static objectToArray(obj: any) {
		if (!obj)
			throw new Error(`objectToArray must provide object param!`);
		if (!isObject(obj))
			throw new Error(`objectToArray provided obj param must be object type!`);
		
		let acptArr = [];
		for (const item in obj) {
			acptArr.push(obj[item]);
		}
		return acptArr;
	}
	
	/**
	 *  检查对象是否有某个属性
	 * @param obj  要检查的对象
	 * @param {string} attr  对象上的属性 且支持多个层级的探测
	 * @returns {boolean}
	 */
	public static checkObjHasSingleAttr(obj: any, attr: string) {
		if (isUndefined(obj[attr]) || obj[attr] === null) {
			return false;
		}
		return true;
	}
	
	/**
	 *  检查对象是否有某个属性
	 * @param obj  要检查的对象
	 * @param {string} attr  对象上的属性 且支持多个层级的探测
	 * @returns {boolean}
	 */
	public static checkObjHasAttr(obj: any, attr: string) {
		if (!obj || isEmptyObject(obj)) return false;
		const attrs = attr.split('.');
		const len = attrs.length;
		let storey = obj;
		for (let i = 0; i < len; i++) {
			if (!this.checkObjHasSingleAttr(storey, attrs[i])) {
				return false;
			}
			storey = obj[attrs[i]];
		}
		return true;
	}
}
