/**********************************************************************
 *
 * @模块名称: OEM
 *
 * @模块用途: OEM
 *
 * @date: 2021/7/23 9:55
 *
 * @版权所有: pgli
 *
 **********************************************************************/
import {atom} from 'recoil';
import {loadLocalJson} from "@httpClient/Global";

const OEM = atom({
	key: 'oem',
	default: {},
});

/**
 * 获取OEM配置信息
 */

export const oemData = loadLocalJson('/json/OEM.json');

export default OEM;
