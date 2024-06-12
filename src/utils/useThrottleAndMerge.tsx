/**********************************************************************
 *
 * @模块名称: throttle
 *
 * @模块用途: throttle  节流
 *
 * @date: 2021/8/31 10:11
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import { useCallback, useRef, useEffect } from 'react';
import _ from 'lodash';
/**
 * @desc 函数节流
 * @param fn 函数
 * @param timeout 延迟执行毫秒数
 * @param type 1 表时间戳版，2 表定时器版
 */
export type ThrottleOptions = {
  type?: 1 | 2; // 1 时间戳记录 2 setTimeout版本
  leading?: boolean; // 第一时间是否立即调用 后续在节流
  notThrottle?: (...arg: any) => any; // 在去抖过程中 有一些非去抖处理 可以添加此参数
}

export const createThrottle = (fn: any, wait: number, options: ThrottleOptions, timeout: any) => {
  const _throttle = function(...args: any) {
    const { type, notThrottle, leading } = options;
    notThrottle && _.isFunction(notThrottle) && notThrottle(...args);
    // @ts-ignore
    const context: any = this;
    if (type === 1) {
      let now = Date.now();
      if (now - timeout > wait) {
        fn.apply(context, args);
        timeout = now;
      }
    } else if (type === 2) {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null;
          fn.apply(context, args);
        }, wait);
      }
    }
    return timeout;
  };
  return _throttle;
};
/**
 * 获取默认参数
 * @param options
 */
export const throttleOptions = (options?: ThrottleOptions) => Object.assign({
  type: 1,
  leading: false
}, options);

const throttle = (fn: any, wait?: number, options?: ThrottleOptions) => {
  let _timeout: any = 0; // setTimeout 返回值timeoutID是一个正整数
  return createThrottle(fn, wait || 200, throttleOptions(options), _timeout);
};

export default throttle;


type Fn = (...props: any) => any;

export const useThrottleAndMerge = (fn: Fn, wait: number = 200, options: ThrottleOptions = {}, dep: any[] = []) => {
  const { current } = useRef<any>({ fn, timer: 0 });
  useEffect(function() {
    current.data = [];
    current.timmer = [];
    current.fn = ()=> {
      current.timmer.forEach((itemTimmer: any)=> {
        clearTimeout(itemTimmer);
      });
      if (current.data.length) {
        fn([...current.data]);
      }
      current.data = [];
    };
  }, [fn]);

  return useCallback(function f(...args) {
    const throttle = createThrottle(current.fn, wait, throttleOptions(Object.assign({
      leading: true,
      notThrottle: (data: any) => {
        current.data.push(data);
        current.timmer.push(setTimeout(()=> {
          if (current.data.length) {
            fn([...current.data]);
            current.data = [];
          }
        }, wait));
      }
    }, options)), current.timer);
    // @ts-ignore
    current.timer = throttle(...args);
  }, dep);
};
