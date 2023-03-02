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
    const input = document?.createElement('input');
    document?.body.appendChild(input);
    input.setAttribute('value', str);
    input.select();
    const res = document?.execCommand('copy')
    res && message.success('文本复制到剪切板成功!')
    document?.body.removeChild(input);
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

var document: any = window.document;
// 展开/全屏
export function requestFullScreen() {
    const element = document.body;
    var requestMethod = element?.requestFullscreen || element?.webkitRequestFullscreen || element?.msRequestFullscreen || element?.mozRequestFullScreen;
    if (requestMethod) {
        requestMethod.call(element);
    }
}
// 退出/全屏
export function exitFullScreen() {
    var exitMethod = document?.exitFullscreen || document?.webkitExitFullscreen || document?.msExitFullscreen || document?.mozCancelFullScreen;
    if (exitMethod) {
        exitMethod.call(document);
    }
}
// 判断是否全屏
export function isFullscreenElement() {
    var isFull = document?.fullscreenElement || document?.webkitFullscreenElement || document?.msFullscreenElement || document?.mozFullScreenElement;
    return !!isFull;
}
// 判断是否是合法json
export const isJSON = (val: any) => {
    // @ts-ignore
    let str: string = val;
    // 开头结尾不一致 也非合法json
    if (str.startsWith('{') && !str.endsWith('}')) return false;
    if (str.startsWith('[') && !str.endsWith(']')) return false;
    // 开头不是{ [ 也不是合法的json
    if (!str?.startsWith('{') && !str?.startsWith('[')) return false;
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
};
// 格式方法
// 公共方法
export function transitionJsonToString(jsonObj: any, callback: any) {
    // 转换后的jsonObj受体对象
    var _jsonObj = null;
    // 判断传入的jsonObj对象是不是字符串，如果是字符串需要先转换为对象，再转换为字符串，这样做是为了保证转换后的字符串为双引号
    if (Object.prototype.toString.call(jsonObj) !== '[object String]') {
        try {
            _jsonObj = JSON.stringify(jsonObj);
        } catch (error) {
            // 转换失败错误信息
            console.error('您传递的json数据格式有误，请核对...');
            console.error(error);
            callback(error);
        }
    } else {
        try {
            jsonObj = jsonObj.replace(/(\')/g, '"');
            _jsonObj = JSON.stringify(JSON.parse(jsonObj));
        } catch (error) {
            // 转换失败错误信息
            console.error('您传递的json数据格式有误，请核对...');
            console.error(error);
            callback(error);
        }
    }
    return _jsonObj;
}

// callback为数据格式化错误的时候处理函数
export function formatJson(jsonObj: any, callback?: any) {
    // 正则表达式匹配规则变量
    var reg = null;
    // 转换后的字符串变量
    var formatted = '';
    // 换行缩进位数
    var pad = 0;
    // 一个tab对应空格位数
    var PADDING = '    ';
    // json对象转换为字符串变量
    var jsonString: any = transitionJsonToString(jsonObj, callback);
    if (!jsonString) {
        return jsonString;
    }
    // 存储需要特殊处理的字符串段
    var _index: any = [];
    // 存储需要特殊处理的“再数组中的开始位置变量索引
    var _indexStart: any = null;
    // 存储需要特殊处理的“再数组中的结束位置变量索引
    var _indexEnd: any = null;
    // 将jsonString字符串内容通过\r\n符分割成数组
    var jsonArray: any = [];
    // 正则匹配到{,}符号则在两边添加回车换行
    jsonString = jsonString.replace(/([\{\}])/g, '\r\n$1\r\n');
    // 正则匹配到[,]符号则在两边添加回车换行
    jsonString = jsonString.replace(/([\[\]])/g, '\r\n$1\r\n');
    // 正则匹配到,符号则在两边添加回车换行
    jsonString = jsonString.replace(/(\,)/g, '$1\r\n');
    // 正则匹配到要超过一行的换行需要改为一行
    jsonString = jsonString.replace(/(\r\n\r\n)/g, '\r\n');
    // 正则匹配到单独处于一行的,符号时需要去掉换行，将,置于同行
    jsonString = jsonString.replace(/\r\n\,/g, ',');
    // 特殊处理双引号中的内容
    jsonArray = jsonString.split('\r\n');
    jsonArray.forEach(function (node: any, index: any) {
        // 获取当前字符串段中"的数量
        var num = node.match(/\"/g) ? node.match(/\"/g).length : 0;
        // 判断num是否为奇数来确定是否需要特殊处理
        if (num % 2 && !_indexStart) {
            _indexStart = index
        }
        if (num % 2 && _indexStart && _indexStart != index) {
            _indexEnd = index
        }
        // 将需要特殊处理的字符串段的其实位置和结束位置信息存入，并对应重置开始时和结束变量
        if (_indexStart && _indexEnd) {
            _index.push({
                start: _indexStart,
                end: _indexEnd
            })
            _indexStart = null
            _indexEnd = null
        }
    })
    // 开始处理双引号中的内容，将多余的"去除
    _index.reverse().forEach(function (item: any, index: any) {
        var newArray = jsonArray.slice(item.start, item.end + 1)
        jsonArray.splice(item.start, item.end + 1 - item.start, newArray.join(''))
    })
    // 奖处理后的数组通过\r\n连接符重组为字符串
    jsonString = jsonArray.join('\r\n');
    // 将匹配到:后为回车换行加大括号替换为冒号加大括号
    jsonString = jsonString.replace(/\:\r\n\{/g, ':{');
    // 将匹配到:后为回车换行加中括号替换为冒号加中括号
    jsonString = jsonString.replace(/\:\r\n\[/g, ':[');
    // 将上述转换后的字符串再次以\r\n分割成数组
    jsonArray = jsonString.split('\r\n');
    // 将转换完成的字符串根据PADDING值来组合成最终的形态
    jsonArray.forEach(function (item: any, index: any) {
        var i = 0;
        // 表示缩进的位数，以tab作为计数单位
        var indent = 0;
        // 表示缩进的位数，以空格作为计数单位
        var padding = '';
        if (item.match(/\{$/) || item.match(/\[$/)) {
            // 匹配到以{和[结尾的时候indent加1
            indent += 1
        } else if (item.match(/\}$/) || item.match(/\]$/) || item.match(/\},$/) || item.match(/\],$/)) {
            // 匹配到以}和]结尾的时候indent减1
            if (pad !== 0) {
                pad -= 1
            }
        } else {
            indent = 0
        }
        for (i = 0; i < pad; i++) {
            padding += PADDING
        }
        formatted += padding + item + '\r\n'
        pad += indent
    })
    // 返回的数据需要去除两边的空格
    return formatted.trim();
}