/**********************************************************************
 *
 * @模块名称: HttpClient
 *
 * @模块用途: HttpClient
 *
 * @date: 2021/7/26 8:25
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import intercept from "@httpClient/intercept";
import {register} from '@gaopeng123/fetch';

export {get as get} from "@gaopeng123/fetch";
export {post as post} from "@gaopeng123/fetch";
export {put as put} from "@gaopeng123/fetch";
export {del as del} from "@gaopeng123/fetch";

export const unregisterFetch = register(intercept);
