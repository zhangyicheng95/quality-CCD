import { fabric } from 'fabric';
import * as FontFaceObserver from 'fontfaceobserver';
import { FONT_PRESET_FAMILY_LIST, LOG_PREFIX } from '@/common/constants/globalConstants';
import { message } from 'antd';

const AngleCoordsMap = {
    45: JSON.stringify({ x1: 0, y1: 1, x2: 1, y2: 0 }),
    90: JSON.stringify({ x1: 0, y1: 0, x2: 1, y2: 0 }),
    135: JSON.stringify({ x1: 0, y1: 0, x2: 1, y2: 1 }),
    180: JSON.stringify({ x1: 0, y1: 0, x2: 0, y2: 1 }),
    225: JSON.stringify({ x1: 1, y1: 0, x2: 0, y2: 1 }),
    270: JSON.stringify({ x1: 1, y1: 0, x2: 0, y2: 0 }),
    315: JSON.stringify({ x1: 1, y1: 1, x2: 0, y2: 0 }),
    0: JSON.stringify({ x1: 0, y1: 1, x2: 0, y2: 0 })
}

const transformAngle2Coords = (angle: any) => {
    angle = angle % 360;
    return JSON.parse(AngleCoordsMap[angle] || AngleCoordsMap[90]);
}

const transformCoords2Angel = (coords: any) => {
    const keys = Object.keys(AngleCoordsMap);
    for (let key of keys) {
        let _coords = { ...coords };
        _coords = {
            x1: coords.x1 > 1 ? 1 : 0,
            y1: coords.y1 > 1 ? 1 : 0,
            x2: coords.x2 > 1 ? 1 : 0,
            y2: coords.y2 > 1 ? 1 : 0
        }
        if (JSON.stringify(_coords) === AngleCoordsMap[key]) {
            return Number(key);
        }
    }
    return 90;
}

export const transformFill2Colors = (v: any) => {
    if (!v || typeof v === 'string' || v instanceof fabric.Pattern) {
        return { type: 'solid', color: v || '#ffffff' };
    }
    return {
        type: v.type,
        gradient: {
            colorStops: v.colorStops,
            angle: transformCoords2Angel(v.coords)
        }
    }
}

export const transformColors2Fill = (v: any) => {
    let fill: any;
    switch (v?.type) {
        case 'solid':
            fill = v.color;
            break;
        case 'linear':
            fill = {
                type: 'linear',
                gradientUnits: 'percentage',
                coords: transformAngle2Coords(v.gradient.angle),
                colorStops: v.gradient.colorStops
            };
            break;
        case 'radial':
            fill = {
                type: 'radial',
                gradientUnits: 'percentage',
                coords: { x1: 0.5, y1: 0.5, x2: 0.5, y2: 0.5, r1: 0, r2: 1 },
                colorStops: v.gradient.colorStops
            };
        default:
            break;
    }
    return fill;
}

export const loadFont = async (f: string) => {
    try {
        if (!f) return Promise.resolve();
        const item = FONT_PRESET_FAMILY_LIST.find(_item => _item.value === f);
        if (!item) return Promise.resolve();
        const font = new FontFaceObserver(f);
        return font.load(null, 1000 * 100).catch((e: any) => { console.error(LOG_PREFIX, e); });
    } catch (err) {
        return Promise.resolve();
    }
}
const getType = (type: any) => {
    if (type.indexOf('text') === 0) {
        return 'text';
    }
    if (type.indexOf('image/') === 0) {
        return 'image';
    }
    return '';
}
export const readBlob = async (blob: any, blobType: any) => {
    const type = getType(blobType);
    if (!type) return Promise.resolve(null);
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            resolve({ type, result: e.target?.result });
        }
        reader.onerror = (e) => {
            console.log(e)
            resolve(null);
        }
        if (type === 'text') {
            reader.readAsText(blob);
        } else if (type === 'image') {
            reader.readAsDataURL(blob);
        }
    });
}
export const getSystemClipboard = async () => {
    try {
        const clipboardItems = await navigator.clipboard.read();
        for (const clipboardItem of clipboardItems) {
            for (const type of clipboardItem.types) {
                const result = await readBlob(await clipboardItem.getType(type), type);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    } catch (err: any) {
        console.error(err.name, err.message);
        return null;
    }
}

export function getArrowPoint(array: any) {
    //ctx为需要绘制的canvas元素的CanvasRenderingContext2D 对象，使用它可以绘制到 Canvas 元素中。
    if (array.length === 2) {
        let x1 = array[0].x; // 第一个点的X
        let x2 = array[1].x; // 第2个点的X
        let y1 = array[0].y; // 第一个点的y
        let y2 = array[1].y; // 第2个点的y
        // 中点c的位置为
        let c = { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
        // 根据x、y的值 计算是x1-x2 还是x2-x1 以及y2-y1 还是 y1-y2
        let borderX = null;
        let borderY = null;
        if (x1 > x2 && y2 > y1) {
            borderX = x2 - x1;
            borderY = y2 - y1;
        } else if (x1 > x2 && y1 > y2) {
            borderX = x1 - x2;
            borderY = y2 - y1;
        } else if (x2 > x1 && y1 > y2) {
            borderX = x2 - x1;
            borderY = y1 - y2;
        } else {
            borderX = x1 - x2;
            borderY = y1 - y2;
        }
        // 斜边l1的长度为
        let l1 = Math.sqrt(Math.pow(borderX, 2) + Math.pow(borderY, 2));

        // 定义l2的默认长度为50
        let l2 = 100;
        let h2 = (l2 * borderX) / l1;
        let s2 = Math.sqrt(Math.pow(l2, 2) - Math.pow(h2, 2));
        let endX = array[1].x >= array[0].x ? s2 + c.x : c.x - s2;
        let endY = c.y + h2;
        let end2X = 2 * c.x - endX;
        let end2Y = 2 * c.y - endY;
        return [c.x, c.y, end2X, end2Y];
        //drawLineArrow为 画箭头的方法
        // this.drawLineArrow(ctx, c.x, c.y, endX, endY, '#f00', 'A');
        // this.drawLineArrow(ctx, c.x, c.y, end2X, end2Y, '#f00', 'B');
    } else {
        message.error('需要两个点的xy坐标');
    }
};