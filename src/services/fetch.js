import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { message } from 'antd';

// import mockRules from '../../mock';
import { formatResponse } from '@/utils/utils'; // 引入mock规则库

// axios全局配置
axios.defaults.headers.common.token = '';
axios.defaults.headers.post['Content-Type'] = 'application/json';
// axios.defaults.headers['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';
// axios.defaults.headers.accountId = 1;
// axios.defaults.headers.userId = 2;
axios.defaults.withCredentials = false;
axios.defaults.crossDomain = true;
axios.defaults.timeout = 60000;
export const dpmDomain = localStorage.getItem('ipUrl') || 'localhost:8866';
// 实例化axios
const axiosInstance = axios.create({
  baseURL: `http://${dpmDomain}`,
});

// 实例化mock axios
const mockInstance = new MockAdapter(axiosInstance);
// 注册mock rule
// mockRules.forEach((rule) => {
//   const method = `on${rule.request?.method?.charAt(0).toUpperCase()}${rule.request?.method?.slice(
//     1,
//   )}`;
//   mockInstance[method](rule.request.url).reply((config) => {
//     const { data } = rule.response;
//     // 如果是函数，则执行函数，函数返回promise
//     if (data instanceof Function) {
//       return new Promise((resolve, reject) => {
//         data(config.data, config)
//           .then((res) => {
//             resolve([rule.response.status, res?.data, config.headers]);
//           })
//           .catch((error) => {
//             if (process.env.NODE_ENV === 'development') {
//               console.log(error);
//             }
//             reject(error);
//           });
//       });
//     }
//     return [rule.response.status, data, config.headers];
//   });
// });
// 透传所有不匹配mock数据的api请求
mockInstance.onAny().passThrough();
// 全局取消请求标识
const { CancelToken } = axios;
const source = CancelToken.source();

// 注册拦截器
axiosInstance.interceptors.response.use(
  (response) => {
    if (response.status >= 200 && response.status < 300) {
      // IE 8-9
      if (
        response.data === null &&
        response.config.responseType === 'json' &&
        response.request.responseText != null
      ) {
        try {
          // eslint-disable-next-line no-param-reassign
          response.data = JSON.parse(response.request.responseText);
        } catch (e) {
          // ignored
        }
      }
      return formatResponse(response);
    }
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 取消所有请求
          source.cancel();
          // 清空本地缓存，然后退出
          localStorage.removeItem('userInfo');
          let hash = '';
          if (location.href?.indexOf('?') > -1) {
            hash = location.href.split('?')[1];
          }
          location.href = `${location.href?.split('#/')?.[0]}#/user/login${
            !!hash ? `?${hash}` : ''
          }`;
          throw error;
          break;
        case 403:
          // window.location.hash = '/';
          throw error;
          break;
        // license 过期
        case 499:
          // hashHistory.push('/logout');
          throw error;
          break;
        default:
          throw error;
      }
    }
  },
);

// axios发起请求
function axiosRequest(config) {
  config.url = `${config.url}${
    config.url?.indexOf('?') > -1 ? '&' : '?'
  }__timestamp=${+new Date()}`;
  return axiosInstance
    .request(config)
    .then((response) => {
      if (response instanceof Object) {
        if (!_.isString(response?.data) || response?.data?.indexOf?.('<body>') < 0) {
          return response.data;
        } else {
          return {
            code: 'ERROR',
            data: null,
            msg:
              response.data?.indexOf('<body>') > -1
                ? response.data.split('<body>')[1].split('</body>')[0]
                : response.data,
          };
        }
      }
      return response;
    })
    .catch((error) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('requestError:', error);
      }
      if (error.response) {
        const { status } = error.response;
        if (
          status === 302 ||
          status === 304 ||
          status === 400 ||
          status === 403 ||
          status === 404 ||
          status === 405 ||
          status === 500
        ) {
          if (status === 500) {
            message.error('后台服务异常，请尝试重启机器');
          }
          return {
            status: 'failed',
            message:
              error.response.data?.indexOf('<body>') > -1
                ? error.response.data.split('<body>')[1].split('</body>')[0]
                : error.response.data,
          };
        }
      }
      return {
        code: '100111', // 全局错误码
        msg: '请求过程发生错误,已经取消请求!',
      };
    });
}

export function upload(url, params = {}, onUploadProgress = (progressEvent) => {}, options = {}) {
  if (!(params instanceof FormData)) {
    const formData = new FormData();
    for (const [k, v] of Object.entries(params)) {
      if (Array.isArray(v)) {
        v.forEach((item) => {
          return formData.append(`${k}`, item);
        });
      } else {
        formData.append(k, v);
      }
    }
    params = formData;
  }

  options = {
    url,
    method: 'post',
    data: params,
    // `onUploadProgress`允许处理选择的进度事件
    onUploadProgress: onUploadProgress,

    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...options,
  };

  return axiosRequest(options);
}

export function fetchPost(url, options) {
  const config = {
    method: 'post',
    url: url,
    ...options,
  };
  if (options && options.body) {
    config.data = options.body;
  }

  return axiosRequest(config);
}

export function fetchGet(url, options) {
  const config = {
    method: 'GET',
    url: url,
    ...options,
  };

  return axiosRequest(config);
}

export function fetchDelete(url, options) {
  const config = {
    method: 'delete',
    url: url,
    ...options,
  };
  if (options && options.body) {
    config.data = options.body;
  }

  return axiosRequest(config);
}

export function fetchPut(url, options) {
  const config = {
    method: 'put',
    url: url,
    ...options,
  };
  if (options && options.body) {
    config.data = options.body;
  }

  return axiosRequest(config);
}
