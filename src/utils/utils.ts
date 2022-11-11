import { message } from "antd";
import * as _ from "lodash";

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
    if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
        return true;
    }
    return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
    const { NODE_ENV } = process.env;
    if (NODE_ENV === 'development') {
        return true;
    }
    return isAntDesignPro();
};

export const random = {
    key: (num = -1): string => `${Math.random()}`.slice(2, num),
    pick: (arr: any[]) => arr[Math.floor(Math.random() * arr.length)],
    multiple: (arr: any[]) => {
        const times = Math.floor(Math.random() * arr.length);
        const res = [];
        for (let i = 0; i < times; i += 1) {
            res.push(random.pick(arr))
        }
        return res
    }
};

export const set: any = (state: any, props: any) => {
    const { keys = [], payload } = props;
    if (keys.length) {
        const [curKey, ...restKeys] = keys;
        return {
            ...state,
            [curKey]: set(state[curKey], { keys: restKeys, payload })
        }
    }
    return {
        ...state,
        ...payload
    }
}

export const delay = async (time = 300) => {
    await new Promise(resolve => setTimeout(resolve, time))
}

export interface IObjMap {
    [propName: number | string]: boolean;
};

/** *
 * 将params转为 a=b&c=d 格式
 * @param params
 */
export function parseParamsToUrl(params: any) {
    let queryParam: any = null;
    if (params) {
        const keys = Object.keys(params);

        keys.forEach((key) => {
            const _value =
                typeof params[key] === 'object'
                    ? JSON.stringify(params[key])
                    : params[key];
            if (!_value) return;
            queryParam = queryParam
                ? `${queryParam}&${key}=${_value}`
                : `${key}=${_value}`;
        });
    }
    return queryParam;
}

export const arr2obj = (arr: (string | any)[], key?: string): IObjMap => {
    return arr.reduce((pre, cur) => ({
        ...pre,
        [key ? cur[key] : cur]: true,
    }), {})
}

export const arr2enum = (arr: any[], valueKey = 'id', labelKey = 'name') => {
    return arr.reduce((pre, cur) => ({
        ...pre,
        [cur[valueKey]]: cur[labelKey]
    }), {})
}

export const enum2values = (obj: any): any[] => Object.keys(obj)

export const options2enum = (arr: []) => arr2enum(arr, "value", "label")

export function titleCase(s: any) {
    return s.toLowerCase().replace(/\b([\w|‘]+)\b/g, (word: any) => {
        return word.replace(word.charAt(0), word.charAt(0).toUpperCase());
    });
}

export function copy2clipbord(str: string) {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.setAttribute('value', str);
    input.select();
    const res = document.execCommand('copy')
    res && message.success('文本复制到剪切板成功!')
    document.body.removeChild(input);
}
// 数字转汉字
export function convertToChinaNum(num: any) {

    var arr1 = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九');

    var arr2 = new Array('', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千', '万', '十', '百', '千', '亿');//可继续追加更高位转换值    

    if (!num || isNaN(num)) {

        return "零";

    }

    var english = num.toString().split("")

    var result = "";

    for (var i = 0; i < english.length; i++) {

        var des_i = english.length - 1 - i;//倒序排列设值        

        result = arr2[i] + result;

        var arr1_index = english[des_i];

        result = arr1[arr1_index] + result;

    }

    //将【零千、零百】换成【零】 【十零】换成【十】    

    result = result.replace(/零(千|百|十)/g, '零').replace(/十零/g, '十');

    //合并中间多个零为一个零    

    result = result.replace(/零+/g, '零');

    //将【零亿】换成【亿】【零万】换成【万】    

    result = result.replace(/零亿/g, '亿').replace(/零万/g, '万');

    //将【亿万】换成【亿】    

    result = result.replace(/亿万/g, '亿');

    //移除末尾的零    

    result = result.replace(/零+$/, '')

    //将【零一十】换成【零十】    

    //result = result.replace(/零一十/g, '零十');

    //貌似正规读法是零一十    

    //将【一十】换成【十】    

    result = result.replace(/^一十/g, '十');

    return result;

}

// 生成唯一id,8位数
export const guid = () => {
    return 'xxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};

// 后端接口返回数据格式化
export function formatResponse(res: any) {
    if (res.data && _.isObject(res.data)) {
        for (const key in res.data) {
            switch (key) {
                case 'error_code':
                    res.data.code = res.data.error_code;
                    if (res.data.error_code == '000000') {
                        res.data.code = 100000;
                    }
                    delete res.data.error_code;
                    break;
                case 'error_msg':
                    res.data.msg = res.data.error_msg;
                    if (res.data.error_msg == '请求成功') {
                        res.data.status = 'success';
                    } else {
                        res.data.status = 'failed';
                    }
                    delete res.data.error_msg;
                    break;
                default:
                    break;
            }
        }
    }
    return res;
}