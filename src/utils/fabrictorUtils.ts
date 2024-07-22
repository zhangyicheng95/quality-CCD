import { fabric } from 'fabric';
import * as FontFaceObserver from 'fontfaceobserver';
import { FONT_PRESET_FAMILY_LIST, LOG_PREFIX } from '@/common/constants/globalConstants';

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