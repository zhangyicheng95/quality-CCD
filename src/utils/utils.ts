import { message } from "antd";

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

export const set = (state, {keys = [], payload}) => {
    if (keys.length) {
        const [curKey, ...restKeys] = keys;
        return {
            ...state,
            [curKey]: set(state[curKey], {keys: restKeys, payload})
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

export const arr2obj = (arr: (string | any)[], key?: string): IObjMap => {
    return arr.reduce((pre, cur) => ({
        ...pre,
        [key ? cur[key] : cur ]: true,
    }), {})
}

export const arr2enum = (arr: any[], valueKey = 'id', labelKey = 'name'): IValueEnum => {
    return arr.reduce((pre, cur) => ({
        ...pre,
        [cur[valueKey]]: cur[labelKey]
    }), {})
}

export const enum2values = (obj): any[] => Object.keys(obj)

export const options2enum = (arr: IOption[]) => arr2enum(arr, "value", "label")

export function titleCase(s) {
    return s.toLowerCase().replace(/\b([\w|‘]+)\b/g, (word) => {
        return word.replace(word.charAt(0), word.charAt(0).toUpperCase());
    });
}

export function copy2clipbord (str: string) {
    const input = document.createElement('input');
	document.body.appendChild(input);
 	input.setAttribute('value', str);
	input.select();
	const res = document.execCommand('copy')
    res && message.success('文本复制到剪切板成功!')
    document.body.removeChild(input);
}
