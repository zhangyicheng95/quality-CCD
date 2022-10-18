/**
 * @函数名称：ColorConversionHelper
 * @param
 * @作用：颜色转换辅助类
 * @return：obj
 * @date 2020/4/17
 */
export const ColorConversionHelper = (function () {
    const __reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    /**
     * 将16进制转换成rgb颜色
     * @param col
     * @returns {string}
     */
    return {
        /**
         * 添加透明度
         * @param {string} color
         * @param {number} opacity
         */
        addOpacity(color: string, opacity: number = 1) {
            if (!color) return '#ffffff';
            let col = color.toLowerCase();
            if (col.startsWith('rgba')) {
                const finalStr = col.split(',');
                return col.replace(finalStr[finalStr.length - 1], `${opacity  })`);
            }
            if (color.startsWith('#')) {
                col = this.colorToRgb(col).toLowerCase();
            }
            col = col.replace(/rgb\(/, 'rgba(');
            col = col.replace(/\)/, `,${  opacity  })`);
            return col;
        },
        /**
         * 将16进制转换成rgb颜色
         * @param col
         * @returns {string}
         */
        colorToRgb(col: string) {
            let sColor = col.toLowerCase();
            const reg = __reg;
            if (sColor && reg.test(sColor)) {
                if (sColor.length === 4) {
                    let sColorNew = '#';
                    for (let i = 1; i < 4; i += 1) {
                        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                    }
                    sColor = sColorNew;
                }
                // 处理六位的颜色值
                const sColorChange = [];
                for (let i = 1; i < 7; i += 2) {
                    sColorChange.push(parseInt(`0x${  sColor.slice(i, i + 2)}`));
                }
                return `RGB(${  sColorChange.join(',')  })`;
            } 
                return sColor;
            
        },
        /**
         * RGBA 转16进制颜色
         * @param color
         * @returns {string}
         */
        RGBATOHEX(color: string) {
            const values: any[] = color
                .replace(/rgba?\(/, '')
                .replace(/\)/, '')
                .replace(/[\s+]/g, '')
                .split(',');
            const a: number = parseFloat(values[3] || 1);
            const r: number = Math.floor(a * parseInt(values[0]) + (1 - a) * 255);
            const g: number = Math.floor(a * parseInt(values[1]) + (1 - a) * 255);
            const b: number = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
            return `#${ 
                (`0${  r.toString(16)}`).slice(-2) 
                }${(`0${  g.toString(16)}`).slice(-2) 
                }${(`0${  b.toString(16)}`).slice(-2)}`;
        },

        /**
         * @param rgba_color rgba(0,0,0,0.1)
         * @returns {string}
         * @constructor
         */
        RGBA2RGB(rgba_color: string) {
            // 注：rgba_color的格式为rgba(0,0,0,0.1)
            const BGcolur: number = 1;
            const arr: any[] = rgba_color.split('(')[1].split(')')[0].split(',');
            const a: number = arr[3];
            const r: number = BGcolur * (1 - a) + arr[0] * a;
            const g: number = BGcolur * (1 - a) + arr[1] * a;
            const b: number = BGcolur * (1 - a) + arr[2] * a;
            return `rgb(${  r  },${  g  },${  b  })`;
        },
        /**
         * 将rgb颜色转换成16进制颜色
         * @param that
         * @returns {any}
         */
        colorToHex(rgb: string) {
            const reg = __reg;
            if (/^(rgb|RGB)/.test(rgb)) {
                const aColor: any[] = rgb.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',');
                let strHex: string = '#';
                for (let i = 0; i < aColor.length; i++) {
                    let hex = Number(aColor[i]).toString(16);
                    if (hex === '0') {
                        hex += hex;
                    }
                    strHex += hex;
                }
                if (strHex.length !== 7) {
                    strHex = rgb;
                }
                return strHex;
            } if (reg.test(rgb)) {
                const aNum = rgb.replace(/#/, '').split('');
                if (aNum.length === 6) {
                    return rgb;
                } if (aNum.length === 3) {
                    let numHex = '#';
                    for (let i = 0; i < aNum.length; i += 1) {
                        numHex += (aNum[i] + aNum[i]);
                    }
                    return numHex;
                }
            } else {
                return rgb;
            }
        },
    };
})();
