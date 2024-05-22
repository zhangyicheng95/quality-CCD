import { message } from 'antd';
import * as _ from 'lodash';
import * as XLSX from 'xlsx';
const Base64 = require('base-64');

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg =
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

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
  pick: (arr: any[]) => arr[parseFloat(Math.random() * arr.length + '')],
  multiple: (arr: any[]) => {
    const times = parseFloat(Math.random() * arr.length + '');
    const res = [];
    for (let i = 0; i < times; i += 1) {
      res.push(random.pick(arr));
    }
    return res;
  },
};

export const set: any = (state: any, props: any) => {
  const { keys = [], payload } = props;
  if (keys.length) {
    const [curKey, ...restKeys] = keys;
    return {
      ...state,
      [curKey]: set(state[curKey], { keys: restKeys, payload }),
    };
  }
  return {
    ...state,
    ...payload,
  };
};

export const delay = async (time = 300) => {
  await new Promise((resolve) => setTimeout(resolve, time));
};

export interface IObjMap {
  [propName: number | string]: boolean;
}

export function formatTimeToDate(date = 0) {
  let newDate = date / 1000;
  if (newDate < 60) {
    return newDate + '秒';
  } else if (newDate >= 60 && newDate < 60 * 60) {
    return newDate / 60 + '分钟';
  } else if (newDate >= 60 * 60 && newDate < 60 * 60 * 24) {
    return newDate / (60 * 60) + '小时';
  } else {
    return newDate / (60 * 60 * 24) + '天';
  }
}

// 毫秒转为 天时分秒
export function timeToString(time: number) {
  const d = parseInt(time / (24 * 60 * 60 * 1000) + '') || 0;
  const h = parseInt((time - d * 24 * 60 * 60 * 1000) / (60 * 60 * 1000) + '') || 0;
  const m = parseInt((time - d * 24 * 60 * 60 * 1000 - h * 60 * 60 * 1000) / (60 * 1000) + '') || 0;
  const s =
    parseInt((time - d * 24 * 60 * 60 * 1000 - h * 60 * 60 * 1000 - m * 60 * 1000) / 1000 + '') ||
    0;
  return { d, h, m, s };
}

/**
 * XMLHttpRequest.open() 初始化请求参数
 * XMLHttpRequest.send() 发送网络请求
 * XMLHttpRequest.onload() 监听请求结果
 * XMLHttpRequest.responseType 对响应结果进行声明，来对结果自动进行处理(text,json,blob,document)
 * XMLHttpRequest.onerror() 请求中断等错误发生时的处理
 * XMLHttpRequest.status 为HTTP状态码 如 404/422/403等，当为200时为正确响应
 * XMLHttpRequest.statusText HTTP状态码内容，200时为ok,404 为Not Found
 * XMLHttpRequest.response 服务器端响应的内容
 */
export function readTextFile(filePath: string, callback?: any) {
  var xhr = new XMLHttpRequest();
  xhr.open('get', filePath, true);
  xhr.responseType = 'arraybuffer';
  xhr.onload = function (e) {
    if (xhr.status == 200) {
      var data = new Uint8Array(xhr.response);
      var workbook = XLSX.read(data, { type: 'array' });
      if (callback) callback(workbook);
    }
  };
  xhr.send();
}

/** *
 * 将params转为 a=b&c=d 格式
 * @param params
 */
export function parseParamsToUrl(params: any) {
  let queryParam: any = '';
  if (params) {
    const keys = Object.keys(params);

    keys.forEach((key) => {
      const _value = typeof params[key] === 'object' ? JSON.stringify(params[key]) : params[key];
      if (!_value) return;
      queryParam = queryParam ? `${queryParam}&${key}=${_value}` : `${key}=${_value}`;
    });
  }
  return queryParam;
}
// url的参数转换成对象
export function GetQueryObj(url: any) {
  let arr = url?.split('?') || [];
  let params = arr?.[1]?.split('&') || [];
  let obj = {};
  for (let i = 0; i < params.length; i++) {
    let param = params[i].split('=');
    obj[param[0]] = param[1];
  }
  return obj;
}

export const arr2obj = (arr: (string | any)[], key?: string): IObjMap => {
  return arr.reduce(
    (pre, cur) => ({
      ...pre,
      [key ? cur[key] : cur]: true,
    }),
    {},
  );
};

export const arr2enum = (arr: any[], valueKey = 'id', labelKey = 'name') => {
  return arr.reduce(
    (pre, cur) => ({
      ...pre,
      [cur[valueKey]]: cur[labelKey],
    }),
    {},
  );
};

export const enum2values = (obj: any): any[] => Object.keys(obj);

export const options2enum = (arr: []) => arr2enum(arr, 'value', 'label');

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
  const res = document?.execCommand('copy');
  res && message.success('文本复制到剪切板成功!');
  document?.body.removeChild(input);
}
// 数字转汉字
export function convertToChinaNum(num: any) {
  var arr1 = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九');

  var arr2 = new Array(
    '',
    '十',
    '百',
    '千',
    '万',
    '十',
    '百',
    '千',
    '亿',
    '十',
    '百',
    '千',
    '万',
    '十',
    '百',
    '千',
    '亿',
  ); //可继续追加更高位转换值

  if (!num || isNaN(num)) {
    return '零';
  }

  var english = num.toString().split('');

  var result = '';

  for (var i = 0; i < english.length; i++) {
    var des_i = english.length - 1 - i; //倒序排列设值

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

  result = result.replace(/零+$/, '');

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

// 生成唯一id,8位数
export const uuid = () => {
  return 'xxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * uuid,32位
 */
export const getuid = () => {
  var s: any = [];
  var hexDigits = '0123456789abcdef';
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(parseFloat(Math.random() * 0x10 + ''), 1);
  }
  s[14] = '4';
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  s[8] = s[13] = s[18] = s[23] = '-';
  var uuid = s.join('');
  return uuid;
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
  var requestMethod =
    element?.requestFullscreen ||
    element?.webkitRequestFullscreen ||
    element?.msRequestFullscreen ||
    element?.mozRequestFullScreen;
  if (requestMethod) {
    requestMethod.call(element);
  }
}
// 退出/全屏
export function exitFullScreen() {
  var exitMethod =
    document?.exitFullscreen ||
    document?.webkitExitFullscreen ||
    document?.msExitFullscreen ||
    document?.mozCancelFullScreen;
  if (exitMethod) {
    exitMethod.call(document);
  }
}
// 判断是否全屏
export function isFullscreenElement() {
  var isFull =
    document?.fullscreenElement ||
    document?.webkitFullscreenElement ||
    document?.msFullscreenElement ||
    document?.mozFullScreenElement;
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
      _indexStart = index;
    }
    if (num % 2 && _indexStart && _indexStart != index) {
      _indexEnd = index;
    }
    // 将需要特殊处理的字符串段的其实位置和结束位置信息存入，并对应重置开始时和结束变量
    if (_indexStart && _indexEnd) {
      _index.push({
        start: _indexStart,
        end: _indexEnd,
      });
      _indexStart = null;
      _indexEnd = null;
    }
  });
  // 开始处理双引号中的内容，将多余的"去除
  _index.reverse().forEach(function (item: any, index: any) {
    var newArray = jsonArray.slice(item.start, item.end + 1);
    jsonArray.splice(item.start, item.end + 1 - item.start, newArray.join(''));
  });
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
      indent += 1;
    } else if (item.match(/\}$/) || item.match(/\]$/) || item.match(/\},$/) || item.match(/\],$/)) {
      // 匹配到以}和]结尾的时候indent减1
      if (pad !== 0) {
        pad -= 1;
      }
    } else {
      indent = 0;
    }
    for (i = 0; i < pad; i++) {
      padding += PADDING;
    }
    formatted += padding + item + '\r\n';
    pad += indent;
  });
  // 返回的数据需要去除两边的空格
  return formatted.trim();
}

// 数字转字母
export function numToString(num: number) {
  return String.fromCharCode(64 + num);
}

// 字母转数字
export function stringToNum(letter: any) {
  return letter.toUpperCase().charCodeAt() - 64;
}

/**
 * 从树形组件中深度便利获取某个字段
 * @param data 要进行便利的list数组
 * @param key 要拿出的key
 * @param searchKey 深度便利的key
 * @returns
 */
export function getKeyFromTree(data: any, key = 'key', searchKey = 'children') {
  let ids: any = [];
  const fetchIds = (list: any, index: number) => {
    if (!list[index]) {
      return;
    }
    ids.push(list[index]?.[key]);
    if (!!list[index]?.[searchKey] && list[index]?.[searchKey]?.length) {
      for (let i = 0; i < list[index]?.[searchKey].length; i++) {
        fetchIds(list[index]?.[searchKey], i);
      }
    }
  };
  for (let i = 0; i < data.length; i++) {
    fetchIds(data, i);
  }
  return ids;
}

/**
 * 公共导出方法，支持ie10
 * @param data
 * @param name
 */
export function downFileFun(data = '{}', name = '') {
  const blob = new Blob([data], { type: 'application/x-sql;charset=UTF-8' });
  // @ts-ignore
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    // @ts-ignore
    window.navigator.msSaveOrOpenBlob(blob, name);
  } else {
    const a = document.createElement('a');
    a.download = name;
    a.style.display = 'none';
    a.href = URL.createObjectURL(blob);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
// 十六进制 转 RGB
export const hexToRGB = (hex: any) => {
  let alpha = false,
    h = hex.slice(hex.startsWith('#') ? 1 : 0);
  if (h.length === 3) h = [...h]?.map?.((x) => x + x).join('');
  else if (h.length === 8) alpha = true;
  h = parseInt(h, 16);
  return (
    'rgb' +
    (alpha ? 'a' : '') +
    '(' +
    (h >>> (alpha ? 24 : 16)) +
    ', ' +
    ((h & (alpha ? 0x00ff0000 : 0x00ff00)) >>> (alpha ? 16 : 8)) +
    ', ' +
    ((h & (alpha ? 0x0000ff00 : 0x0000ff)) >>> (alpha ? 8 : 0)) +
    (alpha ? `, ${h & 0x000000ff}` : '') +
    ')'
  );
};

/**
 *  深度比较两个对象是否相同
 * @param {Object} oldData
 * @param {Object} newData
 */
export function equalsObj(oldData: any, newData: any) {
  try {
    // 类型为基本类型时,如果相同,则返回true
    if (oldData === newData) return true;
    if (
      _.isObject(oldData) &&
      _.isObject(newData) &&
      Object.keys(oldData).length === Object.keys(newData).length
    ) {
      // 类型为对象并且元素个数相同
      // 遍历所有对象中所有属性,判断元素是否相同
      for (const key in oldData) {
        if (oldData?.hasOwnProperty(key)) {
          if (!equalsObj(oldData[key], newData[key])) {
            // 对象中具有不相同属性 返回false
            return false;
          }
        }
      }
    } else if (_.isArray(oldData) && oldData.length === newData.length) {
      // 类型为数组并且数组长度相同
      for (let i = 0, { length } = oldData; i < length; i++) {
        if (!equalsObj(oldData[i], newData[i])) {
          // 如果数组元素中具有不相同元素,返回false
          return false;
        }
      }
    } else {
      // 其它类型,均返回false
      return false;
    }

    // 走到这里,说明数组或者对象中所有元素都相同,返回true
    return true;
  } catch (err) {
    return false;
  }
}

// 获取localStorage中所有的key
export function getAllLocalStorageKeys() {
  var keys = [];
  for (var i = 0; i < localStorage.length; i++) {
    keys.push(localStorage.key(i));
  }
  return keys;
}
//获取用户信息
export function getUserData() {
  try {
    const res = JSON.parse(localStorage.getItem('userInfo') || '{}');
    return res;
  } catch (err) {
    return {};
  }
}
//获取用户权限
export function getUserAuth() {
  const res = getUserData();
  return res?.auth || [];
}
//获取用户权限列表
export function getUserAuthList() {
  const res = getUserData();
  return res?.authList || [];
}
//获取用户登录时间
export function getLoginTime() {
  const res = getUserData();
  return res?.loginTime || 0;
}
// base64加密
export function cryptoEncryption(message: string) {
  message = message.padEnd(32, 'ubvision');
  var encodeStr = Base64.encode(message);
  return encodeStr;
}
// base64解密
export function cryptoDecrypt(message: string) {
  message = message.padEnd(32, 'ubvision');
  var decodeStr = Base64.decode(message);
  return decodeStr;
}
// ptSrc: 圆上某点(初始点);
// ptRotationCenter: 圆心点;
// angle: 旋转角度°  -- [angle * M_PI / 180]:将角度换算为弧度
// 【注意】angle 逆时针为正，顺时针为负
export function rotatePoint(
  ptSrc: { x: number; y: number },
  ptRotationCenter: { x: number; y: number },
  angle: number,
) {
  var a = ptRotationCenter.x;
  var b = ptRotationCenter.y;
  var x0 = ptSrc.x;
  var y0 = ptSrc.y;
  var rx =
    a + (x0 - a) * Math.cos((angle * Math.PI) / 180) - (y0 - b) * Math.sin((angle * Math.PI) / 180);
  var ry =
    b + (x0 - a) * Math.sin((angle * Math.PI) / 180) + (y0 - b) * Math.cos((angle * Math.PI) / 180);
  var json = { x: rx, y: ry };
  return json;
}
// 计算两点之间的距离
export function twoPointDistance(p1: { x: number; y: number }, p2: { x: number; y: number }) {
  let dep = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  return dep;
}
//参数（起点坐标，角度，斜边长（距离）） 这是一个基本的三角函数应用
export function getNewPoint(pointB: { x: number; y: number }, angle: number, bevel: number) {
  //在Flash中顺时针角度为正，逆时针角度为负
  //换算过程中先将角度转为弧度
  var radian: number = (angle * Math.PI) / 180;
  var xMargin: number = Math.cos(radian) * bevel;
  var yMargin: number = Math.sin(radian) * bevel;
  return { x: pointB.x + xMargin, y: pointB.y + yMargin };
}
// 检测字符串中是否包含汉字
export function ifHasChinese(str: string) {
  var filter = /[\u4E00-\u9FA5\uF900-\uFA2D]{1,}/;
  if (filter.test(str)) {
    return true;
  } else if (/[a-zA-Z]/.test(str) && _.lowerCase(str)?.indexOf('x') < 0) {
    return true;
  } else {
    return false;
  }
}
