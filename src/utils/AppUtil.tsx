/**
 *@模块名称：TabChangeService
 *
 *@创建人：ligaoming
 *
 *@作用：基础方法封装
 *
 *@date 2018/5/16
 *
 *@版权所有：
 */

import {
    getRandomNumFun,
    getWindowSize,
    removeTip,
    ellipsps,
    isEmptyObject,
} from './AppUtilHelper';
import BaseColorHelper from './base-color-helper';
import {ColorConversionHelper} from './color-conversion.helper';
import DateUtil from './date.util';


export default class AppUtil {
    public static config: any = {};

    /**
     * 初始化静态函数
     */
    public static init(config = {}) {
        AppUtil.config = config;
    }

    /**
     *@函数名称：
     *@参数：
     *@作用：利用对象原型的toString方法来判断数据类型
     *@date 2018/5/17
     */
    private static readonly toString = Object.prototype.toString;
    /**
     *@函数名称：
     *@参数：
     *@作用：IE6 使用toString判断是Object
     *@date 2018/5/17
     */
    public static isObject = function (val: any) {
        return AppUtil.toString.call(null) === '[object Object]'
            ? val !== null &&
            val !== undefined &&
            AppUtil.toString.call(val) === '[object Object]' &&
            val.ownerDocument === undefined // 排除dom
            : AppUtil.toString.call(val) === '[object Object]';
    };
    /**
     * 判断是否是数组
     * @param val
     * @returns {boolean}
     */
    public static isArray = function (val: any) {
        return 'isArray' in Array
            ? Array.isArray(val)
            : AppUtil.toString.call(val) === '[object Array]';
    };

    /**
     *
     * @param val
     * @returns {boolean}
     */
    public static isString(val: any) {
        return typeof val === 'string';
    }

    /**
     *@函数名称：isUndefined
     *@参数：
     *@作用：判断是不是没有赋值
     *@date 2018/5/18
     */
    public static isUndefined(val: any) {
        return typeof val === 'undefined';
    }

    /**
     * Safari 3.x 4.x type判断dom返回的是function
     * @param val
     * @returns {boolean}
     */
    public static isFunction = function (val: any) {
        return typeof document !== 'undefined' &&
        typeof document.getElementsByTagName('body') === 'function'
            ? !!val && toString.call(val) === '[object Function]'
            : !!val && typeof val === 'function';
    };
    /**
     * 判断是否为布尔值
     * @param val
     * @returns {boolean}
     */
    public static isBoolean = function (val: any) {
        return typeof val === 'boolean';
    };

    /**
     * 判断是否为Promise
     * @param val
     * @returns {boolean}
     */
    public static isPromise(obj: any) {
        return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';

    }

    /**
     * 判断数字
     * @param val
     * @returns {boolean}
     */
    public static isNumber = function (val: any) {
        return typeof val === 'number' && isFinite(val);
    };
    /**
     * 判断dom  nodeType 属性可返回节点的类型。
     * @param val
     * @returns {boolean}
     元素类型     节点类型
     元素element       1
     属性attr          2
     文本text          3
     注释comments      8
     文档document      9
     */
    public static isElement = function (val: any) {
        return val ? val.nodeType === 1 : false;
    };
    /**
     * 字符串为“”，数组为空数组
     * @param val
     */
    public static isEmpty = function (val: any) {
        return (
            val === undefined ||
            val === null ||
            val === '' ||
            (AppUtil.isArray(val) && val.length === 0)
        );
    };
    /**
     * 判断是不是空对象
     * @param val
     * @returns {boolean}
     */
    public static isEmptyObject = isEmptyObject;

    /**
     * @函数名称：isEqualByObj
     * @作用：判断俩个对象是否相等
     * @param {Object} k
     * @param {Object} l
     * @returns {boolean}
     * @return：obj
     * @date 2018/9/18
     */
    public static isEqualByObj = function (k: object, l: object) {
        return JSON.stringify(k) === JSON.stringify(l);
    }

    /**
     * 判断浏览器类型 出自ext.js
     * @param regex
     */
    private static check = function (regex: any) {
        return regex.test(navigator.userAgent.toLowerCase());
    };
    public static readonly isStrict = document.compatMode === 'CSS1Compat';
    private static version = function (is: any, regex: any) {
        let m;
        return is && (m = regex.exec(navigator.userAgent.toLowerCase()))
            ? parseFloat(m[1])
            : 0;
    };

    public static get docMode() {
        const dom: any = document;
        return dom.documentMode;
    }

    public static get isOpera() {
        return this.check(/opera/);
    }

    public static get isOpera10_5() {
        return this.isOpera && this.check(/version\/10\.5/);
    };

    public static get isChrome() {
        return this.check(/\bchrome\b/) && !this.check(/edge/);
    };

    public static get isWebKit() {
        return this.check(/webkit/);
    }

    public static get isSafari() {
        return !this.isChrome && this.check(/safari/);
    }

    public static get isSafari2() {
        return this.isSafari && this.check(/applewebkit\/4/);
    }; // unique to Safari 2
    public static get isSafari3() {
        return this.isSafari && this.check(/version\/3/);
    }

    public static get isSafari4() {
        return this.isSafari && this.check(/version\/4/);
    }

    public static get isSafari5_0() {
        return this.isSafari && this.check(/version\/5\.0/);
    }

    public static get isSafari5() {
        return this.isSafari && this.check(/version\/5/);
    }

    public static get isIE() {
        const ActiveXObject: any = 'ActiveXObject';
        return (!this.isOpera && (this.check(/msie/) || this.check(/edge/))) ||
            (!!window[ActiveXObject] || ActiveXObject in window);
    }

    public static get isIE6() {
        return this.isIE && this.check(/msie 6/);
    }

    public static get isIE7() {
        return this.isIE &&
            ((this.check(/msie 7/) &&
                this.docMode !== 8 &&
                this.docMode !== 9 &&
                this.docMode !== 10) ||
                this.docMode === 7);
    }

    public static get isIE8() {
        return this.isIE &&
            ((this.check(/msie 8/) &&
                this.docMode !== 7 &&
                this.docMode !== 9 &&
                this.docMode !== 10) ||
                this.docMode === 8);
    }

    public static get isIE9() {
        return this.isIE &&
            ((this.check(/msie 9/) &&
                this.docMode !== 7 &&
                this.docMode !== 8 &&
                this.docMode !== 10) ||
                this.docMode === 9);
    }

    public static get isIE10() {
        return this.isIE &&
            ((this.check(/msie 10/) &&
                this.docMode !== 7 &&
                this.docMode !== 8 &&
                this.docMode !== 9) ||
                this.docMode === 10);
    }

    public static get isIE11() {
        return this.isIE && this.check(/trident/);
    }

    public static get isEdge() {
        return this.isIE && this.check(/edge/);
    }

    public static get isGecko() {
        return !this.isWebKit && this.check(/gecko/);
    }

    public static get isGecko3() {
        return this.isGecko && this.check(/rv:1\.9/);
    }

    public static get isGecko4() {
        return this.isGecko && this.check(/rv:2\.0/);
    }

    public static get isGecko5() {
        return this.isGecko && this.check(/rv:5\./);
    }

    public static get isGecko10() {
        return this.isGecko && this.check(/rv:10\./);
    }

    public static get isFF3_0() {
        return this.isGecko3 && this.check(/rv:1\.9\.0/);
    }

    public static get isFF3_5() {
        return this.isGecko3 && this.check(/rv:1\.9\.1/);
    }

    public static get isFF3_6() {
        return this.isGecko3 && this.check(/rv:1\.9\.2/);
    }

    public static get isWindows() {
        return this.check(/windows|win32/);
    }

    public static get isMac() {
        return this.check(/macintosh|mac os x/);
    }

    public static get isLinux() {
        return this.check(/linux/);
    }

    public static readonly scrollbarSize = null;

    public static get chromeVersion() {
        return this.version(true, /\bchrome\/(\d+\.\d+)/);
    }

    public static get firefoxVersion() {
        return this.version(true, /\bfirefox\/(\d+\.\d+)/);
    }

    public static get ieVersion() {
        return this.version(this.isIE, /msie (\d+\.\d+)/);
    }

    public static get operaVersion() {
        return this.version(this.isOpera, /version\/(\d+\.\d+)/);
    }

    public static get safariVersion() {
        return this.version(this.isSafari, /version\/(\d+\.\d+)/);
    }

    public static get webKitVersion() {
        return this.version(this.isWebKit, /webkit\/(\d+\.\d+)/);
    }

    public readonly isSecure = /^https/i.test(window.location.protocol);

    public static get isFirefox() {
        return !!this.firefoxVersion;
    }

    /**
     * 深层属性拷贝
     * @param object
     * @param config
     * @param defaults
     */
    public static apply = function (object: any, config: any, defaults: any = '') {
        // ES6 使用新方法实现该功能
        if (Object.assign) {
            if (defaults) {
                Object.assign(object, config, defaults);
            } else {
                Object.assign(object, config);
            }
            return object;
        }
        const enumerables = [
            'valueOf',
            'toLocaleString',
            'toString',
            'constructor',
        ];
        // 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
        if (defaults) {
            AppUtil.apply(object, defaults);
        }
        if (object && config && AppUtil.isObject(config)) {
            let i; let j; let k;
            for (i in config) {
                object[i] = config[i];
            }
            /**
             * 处理可枚举属性的copy
             */
            if (enumerables) {
                for (j = enumerables.length; j--;) {
                    k = enumerables[j];
                    if (config.hasOwnProperty(k)) {
                        object[k] = config[k];
                    }
                }
            }
        }
    };

    /**
     * 全属性copy
     * @param targetConfig
     * @param sourceConfig
     */
    public static depthAssign<T extends {}>(targetConfig: T, sourceConfig: T, sourceConfig2: any = undefined, level = 5): void {
        if (sourceConfig2) {
            this.depthAssign(targetConfig, sourceConfig2);
        }
        if (targetConfig && sourceConfig && this.isObject(sourceConfig)) {
            // 默认5层递归 如果层次过多 请传递层次次数
            this.copyObjectProperties(targetConfig, sourceConfig, level);
        } else {
            this.apply(targetConfig || {}, sourceConfig || {});
        }
    };

    /**
     * 属性copy 用于绝对的深层次copy
     * @param targetConfig
     * @param sourceConfig
     */
    public static copyObjectProperties(targetConfig: any, sourceConfig: any, index: number): void {
        index -= 1;
        if (index < 0) return;
        if (this.isObject(sourceConfig)) {
            for (const key in sourceConfig) {
                if (this.isObject(sourceConfig[key])) {
                    targetConfig[key] = this.isUndefined(targetConfig[key]) ? {} : targetConfig[key];
                    this.copyObjectProperties(targetConfig[key], sourceConfig[key], index);
                } else {
                    targetConfig[key] = this.isUndefined(sourceConfig[key]) ? targetConfig[key] : sourceConfig[key];
                }
            }
        } else {
            targetConfig = this.isUndefined(sourceConfig) ? targetConfig : sourceConfig;
        }
    }

    /**
     * 浅层属性拷贝
     * @param object
     * @param config
     * @returns {*}
     */
    public static applyIf = function (object: any, config: any) {
        let property;
        if (object) {
            for (property in config) {
                if (object[property] === undefined) {
                    object[property] = config[property];
                }
            }
        }
        return object;
    };

    /**
     *  或者数据的length  主要是用来获取对象的  数组和字符串类型也支持，一般不会用到
     * @param d  传入参数
     * @returns {number}
     */
    public static getLength = function (d: any) {
        if (AppUtil.isObject(d)) {
            return Object.keys(d).length;
        } if (AppUtil.isArray(d) || AppUtil.isString(d)) {
            return d.length;
        }
        return 0;
    }

    private static readonly __DAYTIME: number = 86400000;
    private static readonly __DATAMAP: any = {
        day: 1,
        week: 7,
        month: DateUtil.getNumberDaysByMonth(),
        year: 365,
    };
    private static readonly __WEEKMAP: any = {
        0: `星期日`,
        1: `星期一`,
        2: `星期二`,
        3: `星期三`,
        4: `星期四`,
        5: `星期五`,
        6: `星期六`,
    };

    /**
     * 获取当前时间
     * @param type
     * @param {boolean} natural 为false  默认取自然月 自然周时间戳
     * @returns {{startTime: number; endTime: number}}
     */
    public static getTimeStamp = function (type: any = null, natural: boolean = false) {
        if (!natural) {
            return AppUtil.getRecentTimeStamp(type);
        }
        const thisDayZore: any = AppUtil.thisDayZore();
        const thisDayEarly: any = AppUtil.thisDayEarly();
        let num = 1;
        if (AppUtil.isNumber(type)) {
            num = type;
        } else if (AppUtil.isString(type)) {
            const data = AppUtil.__DATAMAP;
            num = data[type] || num;
        }
        return {
            // (Number(thisDayZore) - num  * 86400) * 1000, 1502640000000 ---- 1502726400000
            startTime: num === 1 ? thisDayZore : thisDayZore - (num - 1) * AppUtil.__DAYTIME,
            endTime: thisDayEarly, // (Number(thisDayZore) + 86400) * 1000
        }
    }

    /**
     * 获取自然维度时间戳
     * @param type
     * @returns {any}
     */
    public static getRecentTimeStamp = function (type: string) {
        let time: any;
        switch (type) {
            case 'week':
                time = AppUtil.getWeekDayTime();
                break;
            case 'month':
                time = AppUtil.getMonthDayTime();
                break;
            case 'quarter':
                time = AppUtil.getQuarterDayTime();
                break;
            case 'year':
                time = AppUtil.getYearDayTime();
                break;
            case 'yesterday':
                const {startTime, endTime} = AppUtil.getTimeStamp('day', true);
                time = {
                    startTime: startTime - AppUtil.__DAYTIME,
                    endTime: endTime - AppUtil.__DAYTIME
                }
                break;
            default:
                time = AppUtil.getTimeStamp('day', true);
                break;
        }
        return time;
    }

    /**
     * 获取当月的时间
     * @returns {{startTime: number; endTime: number}}
     */
    public static getMonthDayTime() {
        // 当前时间的星期几
        const _month = new Date().getDate();
        return AppUtil.__getMonthOrWeelDayTime(AppUtil.__DATAMAP.month, _month);
    }

    /**
     * 获取月和周的时间维度
     * @param days
     * @param nowDay
     * @returns {{startTime: number; endTime: number}}
     */
    private static __getMonthOrWeelDayTime(days: number, nowDay: number) {
        const _days = days;
        const _nowDay = nowDay;
        const thisDayZore = AppUtil.thisDayZore();
        const thisDayEarly = AppUtil.thisDayEarly();
        return {
            startTime: thisDayZore - (_nowDay - 1) * AppUtil.__DAYTIME,
            endTime: thisDayEarly + (_days - _nowDay) * AppUtil.__DAYTIME,
        }
    }

    /**
     * 获取当前是周几
     * @returns {{startTime: number; endTime: number}}
     */
    public static getWeekDayTime() {
        // 当前时间的星期几
        const _week = new Date().getDay() || 7;
        return AppUtil.__WEEKMAP[_week];
    }

    public static getWeekDay() {
        // 当前时间的星期几
        const _week = new Date().getDay() || 7;

        return AppUtil.__getMonthOrWeelDayTime(AppUtil.__DATAMAP.week, _week);
    }

    /**
     * 获取自然年的时间戳
     * @returns {{startTime: number; endTime: number}}
     */
    public static getYearDayTime() {
        const firstDay = new Date().setFullYear(new Date().getFullYear(), 0, 1);
        const lastDay = new Date().setFullYear(new Date().getFullYear(), 11, 31);
        return {
            startTime: Number(new Date(firstDay).setHours(0, 0, 0, 0)),
            endTime: Number(new Date(lastDay).setHours(23, 59, 59, 999)),
        }
    }

    /**
     * 获取自然季度的时间戳
     * @returns {{startTime: number; endTime: number}}
     */
    public static getQuarterDayTime() {
        const firstDay = DateUtil.getStartQuarterDay();
        const lastDay = DateUtil.getEndQuarterDay();
        return {
            startTime: Number(new Date(firstDay).setHours(0, 0, 0, 0)),
            endTime: Number(new Date(lastDay).setHours(23, 59, 59, 999)),
        }
    }

    /**
     * 获取今天开始时间
     * @returns {number}
     */
    public static thisDayZore() {
        return Number(new Date(new Date().setHours(0, 0, 0, 0)));
    }

    /**
     * 今天结束时间
     * @returns {number}
     */
    public static thisDayEarly() {
        return Number(new Date(new Date().setHours(23, 59, 59, 999)));
    }

    /**
     * 根据时间戳获取是什么取件的时间
     * @param timeStampObj
     * @returns {any}
     */
    public static getDayTypeByTimeStamp(timeStampObj: any) {
        const {startTime} = timeStampObj;
        const {endTime} = timeStampObj;
        const keyArr = Object.keys(AppUtil.__DATAMAP);
        const len = keyArr.length;
        for (let i = len - 1; i >= 0; i--) {
            const key: string = keyArr[i];
            if ((endTime - startTime + 1) / AppUtil.__DAYTIME === AppUtil.__DATAMAP[key]) {
                return key;
            }
        }
        return new Error(`参数错误`)
    }

    /**
     *@函数名称：timestampToTime
     *@参数：timestamp时间戳 type时间格式 yyyy-MM-dd yyyy-MM-dd HH:mm:ss HH:mm:ssv  HH
     *@作用：将时间戳转换成日期
     *@date 2018/5/21
     */
    public static timestampToTime(timestamp: any, type: any = 'yyyy-MM-dd HH:mm:ss') {
        // DateUtil.dateFormat(timestamp)
        //
        const t = Number(timestamp);
        timestamp = new Date(isNaN(t) ? timestamp : Number(timestamp));
        const time: any = {
            'yyyy': 'dateFormatY',
            'yyyy-MM-dd': 'dateFormat',
            'yyyy-MM-dd HH:mm:ss': 'datetimeFormat_1',
            'HH:mm:ss': 'dateFormatHMS',
            'HH': 'dateFormatH',
            'MM-dd': 'dateFormat_MM_dd',
            'MM': 'dateFormat_MM',
            'dd': 'dateFormat_dd',
            'ss': 'dateFormatS',
        };
        if (AppUtil.isString(type) && time[type]) {
            return DateUtil[time[type]](timestamp);
        } 
            return DateUtil[time['yyyy-MM-dd HH:mm:ss']](timestamp);
        
    }

    /**
     * 将时间类型转换成时间戳
     * @param {string | any[]} timestamp
     * @returns {any}
     */
    public static timeTotimestampArray(timestamp: any) {
        if (AppUtil.isArray(timestamp)) {
            return timestamp.map((item: string) => {
                return AppUtil.getTimestampByDate(item);
            });
        } 
            return [AppUtil.getTimestampByDate(timestamp)];
        
    }

    /**
     *  根据日志获取时间戳
     * @param data   日期格式
     * @returns {number}
     */
    public static getTimestampByDate(data: any) {
        return new Date(data).getTime();
    }

    /**
     * 根据时间戳获取日志
     * @param timestamp
     * @returns {any}
     */
    public static getDateByTimestamp(timestamp: any) {
        if (AppUtil.isArray(timestamp)) {
            const len = timestamp.length;
            const date = [];
            for (let i = 0; i < len; i++) {
                date.push(new Date(timestamp[i]));
            }
            return date;
        }
        return new Date(timestamp);
    }

    /**
     * 根据组件获取的对象获取开始和结束时间
     * @param {any[]} data
     */
    public static getTimeStampByPicker(data: any[], startKey = 'startTime', endKey = 'endTime') {
        const param: any = {};
        if (AppUtil.isArray(data) && data.length) {
            param[startKey] = AppUtil.getTimestampByDate(data[0]);
            param[endKey] = AppUtil.getTimestampByDate(data[1]);
        }
        return param;
    }

    /**
     *@函数名称：toThousands
     *@参数：value Number  num,小数点精确到几位数
     *@作用：将数字格式化成千位符号进行展示
     *@date 2018/5/22
     */
    public static toThousands(val: string | number, digit: number = 0) {
        const value = Number(val);
        const num: any = (value || 0).toFixed(digit || 0).toString();
        let result = '';
        let integer: any = num.match(/(\S*)\./);
        let decimal = '';
        // 将字符串从'.'断开 用点之前的数据做分割处理，最后再加上小数点后面的数字
        if (integer) {
            integer = integer[1];
            decimal = num.match(/\.(\S*)/)[0]; // 拿到小数点后面的数字
        } else {
            integer = num;
        }
        while (integer.length > 3) {
            result = `,${  integer.slice(-3)  }${result}`;
            integer = integer.slice(0, integer.length - 3);
        }
        if (integer) {
            result = integer + result;
        }
        return result + decimal;
    }

    /**
     * @param key 模块传入key值，获取相当应的颜色，方便统一管理
     * @returns {any}
     */
    private static colorCache: any;

    public static getColor(key = 'color', defalut = false) {
        let color: any;
        // 利用缓存 只执行一次
        if (AppUtil.colorCache) {
            color = AppUtil.colorCache;
        } else {
            color = {
                text: 'rgba(255, 255, 255, 1)', // 文本色
                color: BaseColorHelper.getColor(),
                background: '#14212A', // 背景色
            };
            // 漏洞类型  相关颜色配置 事件类型 视觉类型 告警类型 对比类型
            color = AppUtil.apply(color, AppUtil.gradientColor);
            AppUtil.colorCache = color;
        }
        return color[key] || (defalut ? '#8fd7ff' : undefined);
    }

    public static sequence = 0;

    public static getSequenceColor() {
        let color: any;
        // 利用缓存 只执行一次
        if (AppUtil.colorCache) {
            color = AppUtil.colorCache;
        } else {
            color = {
                text: 'rgba(255, 255, 255, 1)', // 文本色
                color: BaseColorHelper.getColor(),
                background: '#14212A', // 背景色
            };
            // 漏洞类型  相关颜色配置 事件类型 视觉类型 告警类型 对比类型
            color = AppUtil.apply(color, AppUtil.gradientColor);
            AppUtil.colorCache = color;
        }
        if (AppUtil.sequence >= color.color.length) {
            AppUtil.sequence = 0;
        }
        return color.color[AppUtil.sequence++];
    }


    /**
     * 渐变色管理
     * @returns {{#E21352: string; #990099: string; #fbf264: string; #00E0E6: string; #00DC85: string}}
     */
    public static get gradientColor() {
        const gradientColor = BaseColorHelper.gradientColor();
        return gradientColor
    }

    /**
     * 将rgb颜色转换成16进制颜色
     * @param that
     * @returns {any}
     */
    public static colorToHex = ColorConversionHelper.colorToHex;

    /**
     * 将16进制转换成rgb颜色
     * @param col
     * @returns {string}
     */
    public static colorToRgb = ColorConversionHelper.colorToRgb;

    /**
     * 添加透明度
     * @param {string} color
     * @param {number} opacity
     */
    public static addOpacity = ColorConversionHelper.addOpacity;

    /**
     * RGBA 转16进制颜色
     * @param color
     * @returns {string}
     */
    public static RGBATOHEX = ColorConversionHelper.RGBATOHEX;

    /**
     * @param rgba_color rgba(0,0,0,0.1)
     * @returns {string}
     * @constructor
     */
    public static RGBA2RGB = ColorConversionHelper.RGBA2RGB;

    /**
     * 给对象排序
     * @param {Object} obj
     * @returns {Object}
     */
    public static sortObjByVal(obj: object) {
        return obj;
    }

    /**
     * copy 解除引用
     * @param val
     * @returns {*}
     */
    public static clone = function (val: any) {
        return JSON.parse(JSON.stringify(val));
    };
    private static cloneAllObject = function (val: any) {
        const obj: any = {};
        let item: any;
        for (const k in val) {
            item = val[k];
            if (AppUtil.isArray(item)) {
                // 判断数组
                obj[k] = AppUtil.cloneAllArray(item);
            } else if (AppUtil.isObject(item)) {
                obj[k] = AppUtil.cloneAllItems(item);
            } else {
                obj[k] = item;
            }
        }
        return item;
    };
    private static cloneAllArray = (val: any): any => {
        /**
         * 解除数组关系的引用
         * @type {Array.<T>}
         */
        const arr = Array.prototype.slice.call(val);
            const newArr = [];
            const len = arr.length;
        for (let i = 0; i < len; i++) {
            const item: any = arr[i];
            if (AppUtil.isArray(item)) {
                newArr.push(AppUtil.cloneAllArray(item));
            } else if (AppUtil.isObject(item)) {
                newArr.push(AppUtil.cloneAllObject(item));
            } else {
                newArr.push(val);
            }
        }
        return newArr;
    };
    /**
     * 深度copy
     * @param val
     * @returns {*}
     */
    public static cloneAllItems = function (val: any) {
        if (AppUtil.isArray(val)) {
            AppUtil.cloneAllArray(val);
        } else if (AppUtil.isObject(val)) {
            AppUtil.cloneAllObject(val);
        }
        return val;
    };
    /**
     * 判断是否支持排序，主要是判断浏览器差异的
     * @type {boolean}
     */
    private static readonly supportsSort = (function () {
        const a = [1, 2, 3, 4, 5].sort(function () {
            return 0;
        });
        return a[0] === 1 && a[1] === 2 && a[2] === 3 && a[3] === 4 && a[4] === 5;
    })();

    /**
     * Sorts the elements of an Array.
     * By default, this method sorts the elements alphabetically and ascending.
     *
     * @param {Array} array The array to sort.
     * @param {Function} sortFn (optional) The comparison function.
     * @param {Mixed} sortFn.a An item to compare.
     * @param {Mixed} sortFn.b Another item to compare.
     * @return {Array} The sorted array.
     */
    public static sort(_array: any[], _sortFn: any) {
        return AppUtil.supportsSort
            ? function (array, sortFn) {
                if (sortFn) {
                    return array.sort(sortFn);
                } 
                    return array.sort();
                
            }(_array, _sortFn)
            : function (array, sortFn) {
                const {length} = array;
                let i = 0;
                    let comparison;
                    let j;
                    let min;
                    let tmp;

                for (; i < length; i++) {
                    min = i;
                    for (j = i + 1; j < length; j++) {
                        if (sortFn) {
                            comparison = sortFn(array[j], array[min]);
                            if (comparison < 0) {
                                min = j;
                            }
                        } else if (array[j] < array[min]) {
                            min = j;
                        }
                    }
                    if (min !== i) {
                        tmp = array[i];
                        array[i] = array[min];
                        array[min] = tmp;
                    }
                }

                return array;
            }(_array, _sortFn);
    }

    /**
     * 获取自动登录字段缓存
     * @returns {boolean}
     */
    public static getAutoLogin() {
        const autoLogin = localStorage.getItem('autoLogin');
        if (autoLogin === 'true') {
            return true;
        } 
            return false;
        
    }

    /**
     * 设置自动登录本地缓存
     * @param val
     */
    public static setAutoLogin(val: any) {
        localStorage.setItem('autoLogin', val);
    }

    /**
     * 获取指定范围内的随机数，主要用于deom数据模拟
     * @param min
     * @param max
     * @returns {number}
     */
    public static getRandomNum = getRandomNumFun;

    /**
     *  清理所有的tip信息
     */
    public static removeTip = removeTip;

    /**
     *
     * @returns {{width: number; 浏览器宽度
     * height: number; 浏览器高度
     * availWidth: any;  可视化宽度
     * availHeight: any}} 可视化高度
     */
    public static getWindowSize = getWindowSize;

    /**
     * 获取数组的最大值
     * @param {Array<number>} arr  数组类型 且元素为number
     * @returns {any}
     */
    public static getMax(arr: number[]) {
        return Math.max.apply(null, arr);
    }

    /**
     * 数组求和
     * @param {Array<any>} arr
     * @param {string} key  对象形式传入key值
     * @returns {any}
     */
    public static getSum(arr: any[], key = '') {
        // if (!key) {
        //   return eval(arr.join('+'));
        // }
        let sum = 0;
        key ? arr.forEach(function (val, idx, arr) {
            sum += val[key];
        }, 0) : arr.forEach(function (val, idx, arr) {
            sum += val;
        }, 0);
        return sum;
    }

    /**
     * 获取最小值
     * @param {Array<number>} arr 数组类型 且元素为number
     * @returns {any}
     */
    public static getMin(arr: number[]) {
        return Math.min.apply(null, arr);
    }


    /**
     * 钻取维度参数
     * @param cfg
     * @param params
     * @returns {any}
     */
    public static getMapInterfaceParams(cfg: any, params: any) {
        if (cfg && cfg.name) {
            params.factory = cfg.name;
        } else {
            delete params.factory;
        }
        return params;
    }

    /**
     * 过滤地图数据  只取4级数据
     * @param data   地图数据
     * @param level  过滤级别
     * @param {string} customKey  自定义添加key值
     * @returns {Array}
     */
    public static getMapLevelData(data: any, level: any = 4, customKey: string = '', customVal?: any, _num: boolean = false) {
        const len = data.length;
        const arr = [];
        let num: any = 0;
        for (let i = 0; i < len; i++) {
            const item = data[i];
            if (item && (parseInt(item.level, 10) === parseInt(level, 10))) {
                if (customKey && customVal) item[customKey] = customVal;
                arr.push(item);
                num += item.value;
            }
        }
        if (_num) return num;
        return arr;
    }

    /**
     * 获取地图左上角的信息 过滤一级区域数据
     * @param data
     * @returns {number}
     */
    public static getAmount(data: any, level: number = 4) {
        let amount = 0;
        if (data) {
            const len = data.length;
            for (let i = 0; i < len; i++) {
                const item = data[i];
                if (item && (parseInt(item.level, 10) === level)) {
                    amount += item.value;
                }
            }
        }
        return amount;
    }

    /**
     * 获取健康指数
     * @param data
     * @returns {string}
     */
    public static getHealthVvalue(data: any) {
        // 标准规则为 将100 - 当前的风险值去计算
        const _risk = 100 - AppUtil.getAmount(data.risks) || 0;
        // const _risk = getRandomNumFun(80, 85);
        return {
            value: Number(_risk.toFixed()),
            level: AppUtil.getRiskLevel(_risk).healthLevle
        };
    }

    /**
     * 根据最大值 统一阈值划分 0-60 60-80 80-90 90-100 4个层次 其他量级 依次规则进行划分
     * @param maxVal
     * @returns {{firstThreshold: number; secondThreshold: number; thirdThreshold: number}}
     */
    public static getLevelThresholdByMaxValue(maxVal: number) {
        const firstThreshold = Math.ceil(maxVal / 100 * 90);
        const secondThreshold = Math.ceil(maxVal / 100 * 80);
        const thirdThreshold = Math.ceil(maxVal / 100 * 60);
        return {
            firstThreshold,
            secondThreshold,
            thirdThreshold,
        }
    }

    /**
     * 获取健康及风险信息  扩展 展示图例信息
     * @param {number} val  数据
     * @param levelThreshold  区域值  可一次获取当前的阈值  否则需要传入最大值
     * @param {number} maxVal  最大值
     * @returns {{riskLevel: string; healthLevle: string; level: number; legend: string; color: (any | string)}}
     */
    public static getRiskLevel(val: number, levelThreshold: any = null, maxVal: number = 100) {
        // 风险值
        let riskLevel: string;
        // 健康值
        let healthLevle: string;
        // 图例值
        let legend: string;
        // 级别值
        let level = 0;
        // 风险值
        const _risk = val;
        // 3个级别
        const {firstThreshold, secondThreshold, thirdThreshold} = levelThreshold || AppUtil.getLevelThresholdByMaxValue(maxVal);

        if (_risk >= firstThreshold) {
            riskLevel = '危急';
            healthLevle = '健康';
            level = 4;
            legend = `>= ${firstThreshold}`;
        } else if (firstThreshold > _risk && _risk >= secondThreshold) {
            riskLevel = '高危';
            healthLevle = '良好';
            level = 3;
            legend = `${secondThreshold} - ${firstThreshold}`;
        } else if (secondThreshold > _risk && _risk >= thirdThreshold) {
            riskLevel = '中危';
            healthLevle = '一般';
            level = 2;
            legend = `${thirdThreshold} - ${secondThreshold}`;
        } else {
            riskLevel = '低危';
            healthLevle = '较差';
            level = 1;
            legend = `0 - ${thirdThreshold}`;
        }

        return {
            riskLevel,
            healthLevle,
            level,
            legend,
            color: AppUtil.getColor(riskLevel)
        }
    }

    /**
     *  根据最大值 计算legend
     * @param maxVal
     */
    public static getRiskLegend(maxVal: number) {
        const threshold = AppUtil.getLevelThresholdByMaxValue(maxVal);
        const {firstThreshold, secondThreshold, thirdThreshold} = threshold;
        const first = AppUtil.getRiskLevel(firstThreshold, threshold, maxVal);
        const second = AppUtil.getRiskLevel(secondThreshold, threshold, maxVal);
        const third = AppUtil.getRiskLevel(thirdThreshold, threshold, maxVal);
        const fourth = AppUtil.getRiskLevel(0, threshold, maxVal);
        return [first, second, third, fourth];
    }

    /**
     * 获取dom的真实样式  处理基于订阅者模式下样式变动场景
     * 当满足条件时返回true即可
     * 例：AppUtil.util.getOffetWidthAfterViewInit(()=>{
        const W = dom.querySelector('ul').offsetWidth;
        if (W <= 300) {
          return true;
        } else {
          document.getElementsByTagName('app-sidebar')[0]['style'].width = W + 30 + 'px';
          return false;
        }
      });
     * @param callback
     */
    public static getOffetWidthAfterViewInit = function (callback: any) {
        setTimeout(() => {
            if (callback && AppUtil.isFunction(callback)) {
                // status来判断计时器是否开启 当不满足条件时返回true即可 接着轮询
                const status = callback();
                if (status) {
                    AppUtil.getOffetWidthAfterViewInit(callback);
                }
            }
        }, 200);
    }

    /**
     * 获取元素的某个属性的值
     * @param element  dom
     * @param attr    样式名称
     * @returns {any}
     */
    public static getStyle(el: any, attr: any) {
        if (el) {
            if (el.currentStyle) {
                return el.currentStyle[attr];
            } 
                const computed = getComputedStyle(el, null);
                return computed[attr] || computed.getPropertyValue ? computed.getPropertyValue(attr) : '';
            
        }
    }


    /**
     * 对象和string互转方法
     */
    public static objToStr(val: any, direction = true) {
        if (direction && AppUtil.isObject(val)) {
            return JSON.stringify(val);
        } if (!direction &&
            (val === '{}' || (AppUtil.isString(val) && ((val.startsWith('{') && val.endsWith('}')) || (val.startsWith('[') && val.endsWith(']')))))) {
            return (new Function(`return ${  val}`))();
        } 
            return val;
        
    }

    /**
     * 对象转换成字符串
     * @param val
     * @returns {string | any | any}
     */
    public static stringify(val: any) {
        return AppUtil.objToStr(val, true);
    }

    /**
     * 字符串转换成对象
     * @param val
     * @returns {string | any | any}
     */
    public static strToObj(val: string) {
        return AppUtil.objToStr(val, false);
    }

    /**
     * 字符串转换成对象
     * @param val
     * @returns {string | any | any}
     */
    public static parse(val: string) {
        return AppUtil.strToObj(val);
    }

    /**
     * 获取uuid方法 用于做唯一标识时使用
     * @param {number} len  id的长度  默认64位
     * @param {number} radix  数据基数你2 10 16等  默认62位全部正常字符
     * @returns {string}
     */
    public static uuid(len: number = 64, radix: number = 62) {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        const uuid = [];
        let i;
        radix = radix || chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            // rfc4122, version 4 form
            let r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data. At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    }

    /**
     *
     * @param text
     * @param font
     */
    private static _canvas: any;
    private static _ctx: any;

    public static measureText(text: string, font = '12px Microsoft YaHei') {
        if (!AppUtil._canvas) AppUtil._canvas = document.createElement('canvas');
        if (!AppUtil._ctx) AppUtil._ctx = AppUtil._canvas.getContext('2d');
        AppUtil._ctx.font = font;
        return AppUtil._ctx.measureText(text).width;
    }

    /**
     * @param text  字符串
     * @param maxWidth 最大宽度
     */
    public static setTextByWidth(text: string, maxWidth: number, font = '12px Microsoft YaHei') {
        const _w = AppUtil.measureText(text, font);
        if (maxWidth >= _w) return text;
        let str = text;
        while (AppUtil.measureText(`${str  }...`, font) > maxWidth) {
            str = str.substring(0, str.length - 1);
        }
        return `${str  }...`;
    }

    /**
     * 下载函数 文件需在服务端存在
     * @param url
     * @param {string} name
     */
    public static download({url, name, blob, parmas}: any): void {
        if (!url && !blob) new Error('url不合法');
        const href = blob ? URL.createObjectURL(blob) : url + AppUtil.urlJointParmas(parmas);
        const elt = document.createElement('a');
        elt.setAttribute('href', href);
        elt.setAttribute('download', name || 'default');
        elt.style.display = 'none';
        document.body.appendChild(elt);
        elt.click();
        document.body.removeChild(elt);
        if (blob) URL.revokeObjectURL(blob);
    }

    /**
     * 图片转换
     * @param canvas
     * @param type
     * @returns {string | *}
     */
    public static canvasToUrl({canvas, type}: any): string {
        return canvas.toDataURL(type || 'image/png');
    }

    /**
     * 获取canvas  video 或者canvas
     * @returns {*}
     */
    public static getCavnasByVideo(video: any): HTMLCanvasElement {
        let videoDom: any;
        if (AppUtil.isElement(video)) {
            videoDom = video;
        } else {
            videoDom = document.getElementById(video);
        }

        let canvas;
        if (videoDom.tagName === 'VIDEO') {
            canvas = document.createElement('canvas');
            canvas.width = videoDom.offsetWidth;
            canvas.height = videoDom.offsetHeight;
            canvas.style.height = `${videoDom.offsetWidth}px`;
            canvas.style.height = `${videoDom.offsetHeight}px`;
        } else {
            canvas = videoDom;
        }
        return canvas;
    }

    /**
     * 截屏图片下载
     * @param {any} dom   截屏的dom对象
     * @param {any} name  图片名称
     * @param {any} type  图片类型
     */
    public static dowmloadCameraPicture({dom, name, type}: any): void {
        AppUtil.download({url: AppUtil.canvasToUrl({canvas: AppUtil.getCavnasByVideo(dom), type}), name})
    }

    /**
     * 文档流下载函数 建议使用此方式进行下载 服务端不需要保存冗余文件
     * @param {any} url
     * @param {any} name
     * @param {any} params
     */
    // public static downloadStream({url, options, params}: any) {
    //     HttpClient.post({
    //         url: url || '/download',
    //         params: {
    //             options,
    //             params
    //         },
    //         responseType: 'blob'
    //     }).then((res: any) => {
    //         const blob = new Blob([res], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"});
    //         AppUtil.download({blob: blob, name: options.name});
    //     });
    // };

    /**
     * @params  需要拼接的参数
     *    拼接url地址参数
     */
    public static urlJointParmas(parmas: any) {
        let count = 1;
        if (AppUtil.isObject(parmas)) {
            let str = `?`;
            for (const i in parmas) {
                const concatSymbol = count > 1 ? '&' : '';
                str += `${concatSymbol}${i}=${parmas[i]}`;
                count++;
            }
            return str;
        } 
            return '';
        
    }

    /**
     * 获取正确的title的值
     * @param {string} title
     */
    public static replaceTitle = function (title: string = '{0}', str: any[]) {
        const t: any = title;
        return t.format(...str);
    }

    // 字符串解决方法
    public static ellipsps = ellipsps;

    /**
     * 验证数组是否有重复
     * @param {Array<any>} arr
     * @returns {boolean}
     */
    public static isRepeat(arr: any[], item: any = null): any {
        if (item) {
            const _arr: any[] = AppUtil.cloneAllItems(arr);
            _arr.unshift(item);
            return AppUtil.isRepeat(_arr);
        }
        const hash: any = {};
        for (const i in arr) {
            if (hash[arr[i]]) {
                return true;
            }
            // 不存在该元素，则赋值为true，可以赋任意值，相应的修改if判断条件即可
            hash[arr[i]] = true;
        }
        return false;
    }

    /**
     * 根据指定key将 对象数组 转换成对象
     * @param arr, key
     * @returns {object}
     */
    public static arrayToObject(arr: any[], key?: any) {
        if (!arr)
            throw new Error(`arrayToObject must provide array param!`);
        if (!AppUtil.isArray(arr))
            throw new Error(`arrayToObject provided arr param must be array type!`);

        if (!key)
            key = 'key';

        if (!AppUtil.isString(key))
            throw new Error(`arrayToObject provided key param must be string type!`);

        const acptObj: any = {};
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
        if (!AppUtil.isObject(obj))
            throw new Error(`objectToArray provided obj param must be object type!`);

        const acptArr = [];
        for (const item in obj) {
            acptArr.push(obj[item]);
        }
        return acptArr;
    }

    /**
     * 对象转换成二维
     * @param obj
     * @returns {Array}
     */
    public static objectToTwoDimensionalArray(obj: any) {
        if (!obj)
            throw new Error(`objectToArray must provide object param!`);
        if (!AppUtil.isObject(obj))
            throw new Error(`objectToArray provided obj param must be object type!`);

        const acptArr = [];
        for (const item in obj) {
            acptArr.push([item, obj[item]]);
        }
        return acptArr;
    }

    /**
     * 处理数字千位分隔符
     * @param number
     * @returns {String}
     */
    public static toThousandsSpy(num: number) {
        return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    }

    /**
     * 处理数字单位化读法
     * @param number
     * @returns {String}
     */
    public static numToReadability(numb: number) {
        let num: string | number = numb;
        if (num >= 10000) {
            num = `${Math.round(num / 1000) / 10  }W`;
        } else if (num >= 1000) {
            num = `${Math.round(num / 100) / 10  }K`;
        }
        return num;
    }

    /**
     *  复制文本
     * @param span 文本标签
     */
    public static inputCache: any;

    public static copySpanText(span: any) {
        const text = span.innerText;
        if (!AppUtil.inputCache) {
            AppUtil.inputCache = document.createElement('input');
        }
        AppUtil.inputCache.setAttribute('value', text);
        // document.getElementsByTagName('body')[0].appendChild(input);
        AppUtil.inputCache.select();
        if (document.execCommand('copy')) {
            console.log('复制成功')
        }
        // input.remove();
    }

    /**
     *  检查对象是否有某个属性
     * @param obj  要检查的对象
     * @param {string} attr  对象上的属性 且支持多个层级的探测
     * @returns {boolean}
     */
    public static checkObjHasSingleAttr(obj: any, attr: string) {
        if (AppUtil.isUndefined(obj[attr]) || obj[attr] === null) {
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
        if (!obj || AppUtil.isEmptyObject(obj)) return false;
        const attrs = attr.split('.');
        const len = attrs.length;
        let storey = obj;
        for (let i = 0; i < len; i++) {
            if (!AppUtil.checkObjHasSingleAttr(storey, attrs[i])) {
                return false;
            }
            storey = obj[attrs[i]];
        }
        return true;
    }

    /**
     * 获取proTable表格数据
     * @param data
     * @returns {any}
     */
    public static getGraphQlTableData(data: any): any {
        if (AppUtil.isUndefined(data)) {
            return data;
        }
        if (data.__typename) {
            return data;
        }
        return AppUtil.getGraphQlTableData(data.data);
    }

    /**
     * 处理参数
     * @param params
     * @returns {any}
     */
    public static setGraphQlParams(params: any): any {
        return params;
    }

    /**
     * 递归查找符合预期的dom结构
     * @param dom
     * @param fn
     * @returns {any}
     */
    public static getParentDomToExpected(dom: any, fn: any): any {
        if (fn(dom)) {
            return dom;
        }
        return AppUtil.getParentDomToExpected(dom.parentNode || dom.parentElement, fn);
    }

    /**
     * 根据URL获取传递的参数
     * @param url
     * @returns {{}}
     */
    public static getQueryObjectByUrl = (url: string) => {
        const _url = url === null ? window.location.href : url;
        const search = _url.substring(_url.lastIndexOf('?') + 1);
        const obj: any = {};
        const reg = /([^?&=]+)=([^?&=]*)/g;
        // [^?&=]+表示：除了？、&、=之外的一到多个字符
        // [^?&=]*表示：除了？、&、=之外的0到多个字符（任意多个）
        search.replace(reg, function (rs: any, $1, $2) {
            const name = decodeURIComponent($1);
            const val = String(decodeURIComponent($2));
            obj[name] = val;
            return rs;
        });
        return obj;
    }
    /**
     * 根据event 获取鼠标位置
     * @param event
     * @returns {any}
     */
    public static mousePosition = (event: any) => {
        if (event.pageX || event.pageY) {
            return {x: event.pageX, y: event.pageY};
        }
        return {
            x: event.clientX + document.body.scrollLeft - document.body.clientLeft,
            y: event.clientY + document.body.scrollTop - document.body.clientTop
        };
    }
}
