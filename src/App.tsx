import { message, notification } from 'antd';
import type { RequestConfig } from 'umi';
import type { RequestOptionsInit, ResponseError } from 'umi-request';
import { debounce } from 'lodash';

export const initialStateConfig = {
    loading: <div />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
    settings?: any;
}> {
    return {
        settings: {},
    };
}

// const debounceWran = debounce((msg) => {
//     message.warn(msg);
// }, 2000, {
//     leading: true,
//     trailing: false
// });

// const responseInterceptors = async (response: Response, options: RequestOptionsInit) => {
//     const {success, ...data} = await response.clone().json();
//     console.log('responseInterceptors', data)
//     if (data && data.code !== 200) {
//         debounceWran(data.message);
//         // throw data.message
//     } else {
//         return data
//     }
// };

const middleware = async (ctx, next) => {
    await next()
    // console.log('middleware', ctx.res)
    if (!ctx.req.options.raw) {
        if (ctx.res.code !== 200) {
            message.error(ctx.res.message)
            ctx.res = false
        } else {
            ctx.res = ctx.res.result || true
        }
    }
}

export const request: RequestConfig = {
    errorHandler: (error: ResponseError) => {
        console.error(error)
        const {response} = error;
        if (!response) return message.error('请求失败')
        if (response) {
            const { status, statusText, url } = response;
            const requestErrorMessage = '请求失败';
            const errorMessage = `${requestErrorMessage} ${status}: ${url}`;
            const errorDescription = '请求失败' || statusText;
            notification.error({
                message: errorMessage,
                description: errorDescription,
            });
        }
    },
    middlewares: [middleware], // 中间件
    // responseInterceptors: [responseInterceptors],
};
