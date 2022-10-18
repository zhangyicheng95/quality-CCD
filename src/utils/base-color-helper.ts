/**
 *@模块名称：BaseColorHelper
 *
 *@创建人：ligaoming
 *
 *@作用：管理颜色
 *
 *@date 2019/8/27
 *
 *@版权所有：
 */
import {ColorConversionHelper} from './color-conversion.helper';
// @ts-nocheck
export default class BaseColorHelper {
  /**
   * 所有的用色规范 渐变规则为 0-》1 0-》2 1》2
   * 主-辅1
   * 主-辅2
   * 辅1-辅2
   */
  private static readonly BASECOLOR = [
    ['#2ba0f6', '#5FBAFB', '#89CBFB', '#4689B9', '#0E63A0'], // 0
    ['#539D3C', '#86CE6F', '#99CE88', '#4C763F', '#276613'], // 1
    ['#00a4a1', '#34D2D2', '#5ED2D2', '#1F7B7B', '#006B6B'], // 2
    ['#336799', '#669ACC', '#81A7CC', '#395773', '#113B63'], // 3
    ['#83aaee', '#A3C2F7', '#BAD0F7', '#768DB3', '#2B549B'], // 4
    ['#5E76D9', '#889BEC', '#A2B1EC', '#5E6BA3', '#1F348D'], // 5
    ['#F4AC48', '#FAC276', '#FAD199', '#B78E56', '#9F6617'], // 6
    ['#ec622c', '#F68A60', '#F6A788', '#B16445', '#99360E'], // 7
    ['#780908', '#bc3838', '#bc5b5b', '#5a1b1b', '#4e0303'], // 8
    ['#ea3230', '#F46363', '#F48A8A', '#B04747', '#981010'], // 9
  ];

  /**
   * 获取颜色的默认；；类型
   * @returns {(string | string | string)[][]}
   */
  public static getBASECOLOR() {
    return this.BASECOLOR;
  }

  /**
   * 获取所有的颜色
   * @returns {Array}
   */
  private static colorCache: any;
  public static getColor() {
    if (this.colorCache) {
      return this.colorCache;
    }
    const color: any[] = [];
    for (let i = 0; i < 4; i++) {
      this.BASECOLOR.forEach(items => {
        color.push(items[i]);
      });
    }
    this.colorCache = color;
    return color;
  }

  /**
   *  获取渐变色
   */
  private static gradientColorCache: any;
  public static gradientColor() {
    if (this.gradientColorCache) {
      return this.gradientColorCache;
    }
    const gradientColor: any = {};
    const {addOpacity} = ColorConversionHelper;
    // 渐变规则变更
    this.BASECOLOR.forEach(items => {
      gradientColor[items[0]] = [items[0], items[2]];
      gradientColor[items[1]] = [items[1], items[3]];
      gradientColor[items[2]] = [items[2], items[4]];
      gradientColor[items[3]] = [items[3], items[0]];
      gradientColor[items[4]] = [items[4], items[1]];
    });
    this.gradientColorCache = gradientColor;
    return gradientColor;
  }
}
