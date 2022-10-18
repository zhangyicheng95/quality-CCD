//  import * as CryptoJS from 'crypto-js';
// import { saveAs } from 'file-saver';

/**
 * 字符串格式化函数
 * @returns {string}
 */
// @ts-nocheck
String.prototype.format = function (args: any) {
    let result: any = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) === 'object') {
            for (const key in args) {
                if (args[key] != undefined) {
                    const reg: any = new RegExp(`({${  key  }})`, 'g');
                    result = result.replace(reg, args[key]);
                }
            }
        } else {
            for (let i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    const reg: any = new RegExp(`({)${  i  }(})`, 'g');
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};

/**
 * 获取随机数
 * @param min
 * @param max
 * @returns {number}
 */
export function getRandomNumFun(min: number, max: number) {
    min = min || 0;
    max = max || 10;
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * 通过自定义标签获取所有的dom集合
 * @param el  要查询dom范围
 * @param tag  要查询的标签
 * @param attr  要查询的属性名称
 * @param value  要匹配的属性值
 * @returns {Array}
 */
function getElementByAttr(el: any, tag: any, attr: any, value: any) {
    const aElements = el || document.getElementsByTagName('div');
    const aEle = [];
    const len = aElements.length;
    for (let i = 0; i < len; i++) {
        if (aElements[i].getAttribute(attr) === value) aEle.push(aElements[i]);
    }
    return aEle;
}

/**
 *  清理所有的tip信息
 */
export function removeTip() {
    const aElements = document
        .getElementsByClassName('cdk-overlay-container')[0]
        .getElementsByTagName('div');
    const aDiv = getElementByAttr(aElements, 'div', 'dir', 'ltr'); // 返回data-id为123456的div集合
    const len = aDiv.length;
    for (let i = 0; i < len; i++) {
        const aDivDom = aDiv[i].childNodes[0];
        if (aDivDom.childNodes && aDivDom.childNodes[0] && aDivDom.childNodes[0].className.includes('ant-tooltip')) {
            // 指定鼠标事件
            aDivDom.style['pointer-events'] = 'none';
            aDivDom.removeChild(aDivDom.childNodes[0]);
        }
    }
}

/**
 * 清理选择框的内容
 */
export function removeSelectBox() {
    const box = document.getElementsByClassName('cdk-overlay-connected-position-bounding-box');
    if (box) {
        const len = box.length;
        for (let i = 0; i < len; i++) {
            if (i) {
                const pane = box[i].getElementsByClassName('cdk-overlay-pane');
                if (pane && pane[0]) {
                    pane[0].removeChild(pane[0].children[0]);
                }
            }
        }
    }
}

/**
 * 密码加密
 * @param password
 * @returns {string}
 */
export function passwordEncryption(password: string) {
    // 用于沟通解密 不允许修改
    // const key = CryptoJS.enc.Utf8.parse('W7BwcnaDnOKnuJ51');
    // const srcs = CryptoJS.enc.Utf8.parse(password);
    // const encrypted = CryptoJS.AES.encrypt(srcs, key, {mode:CryptoJS.mode.ECB,padding: CryptoJS.pad.Pkcs7});
    // return encrypted.toString();
}

/**
 *
 * @returns {{width: number; 浏览器宽度
   * height: number; 浏览器高度
   * availWidth: any;  可视化宽度
   * availHeight: any}} 可视化高度
 */
export function getWindowSize() {
    let xScroll: number;
    let yScroll: number;
    let pageWidth: number;
    let pageHeight: number;
    // @ts-ignore
    if (window.innerHeight && window.scrollMaxY) {
        xScroll = window.innerWidth + window.scrollMaxX;
        yScroll = window.innerHeight + window.scrollMaxY;
    } else if (document.body.scrollHeight > document.body.offsetHeight) {
            // all but Explorer Mac
            xScroll = document.body.scrollWidth;
            yScroll = document.body.scrollHeight;
        } else {
            // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
            xScroll = document.body.offsetWidth;
            yScroll = document.body.offsetHeight;
        }
    let windowWidth; let windowHeight;
    if (window.self.innerHeight) {
        // all except Explorer
        if (document.documentElement.clientWidth) {
            windowWidth = document.documentElement.clientWidth;
        } else {
            windowWidth = window.self.innerWidth;
        }
        windowHeight = window.self.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight) {
            // Explorer 6 Strict Mode
            windowWidth = document.documentElement.clientWidth;
            windowHeight = document.documentElement.clientHeight;
        } else if (document.body) {
                // other Explorers
                windowWidth = document.body.clientWidth;
                windowHeight = document.body.clientHeight;
            }
    // for small pages with total height less then height of the viewport
    if (yScroll < windowHeight) {
        pageHeight = windowHeight;
    } else {
        pageHeight = yScroll;
    }
    // for small pages with total width less then width of the viewport
    if (xScroll < windowWidth) {
        pageWidth = xScroll;
    } else {
        pageWidth = windowWidth;
    }
    return {
        width: pageWidth,
        height: pageHeight,
        availWidth: windowWidth,
        availHeight: windowHeight,
        screenHeight: window.screen.height,
        screenWidth: window.screen.width,
    };
}

/**
 * 获取各种高度
 * @type {() => {contentHeight: (() => number)}}
 */
const getKindHeight = (function () {
    const kindHeight: any = {};
    /**
     * 窗口高度
     */

    return {
        get(key) {
            return kindHeight[key];
        },

        set(key, val) {
            kindHeight[key] = val;
        },

        /**
         * 全局头部高度 内部
         * @type {number}
         */
        headerHeight() {
            if (!this.get('headerHeight')) {
                this.set('headerHeight', getHeaderHeight(document.getElementsByTagName('ant-pro-top-nav-header'), 48));
            }
            return this.get('headerHeight');
        },

        /**
         * 项目内部不均bottom 高度 就是下边距
         * @type {number}
         */
        bottomHeight() {
            if (!this.get('bottomHeight')) {
                const bottom = getStyle(document.getElementsByTagName('main'), 'margin-bottom');
                /**
                 * 项目内部不均bottom 高度 就是下边距
                 * @type {number}
                 */
                const bottomHeight = bottom ? parseInt(bottom, 10) * 2 : 24 * 2;
                this.set('bottomHeight', bottomHeight);
            }
            return this.get('bottomHeight');
        },
        /**
         * 大屏内部高度title高度
         * @returns {any}
         */
        titleHeight() {
            if (!this.get('titleHeight')) {
                this.set('titleHeight', getHeaderHeight(document.getElementsByClassName('header-screen'), 66));
            }
            return this.get('titleHeight');
        },


        /**
         * 全局大屏
         * @returns {any}
         */
        headlineHeight() {
            if (!this.get('headlineHeight')) {
                this.set('headlineHeight', getHeaderHeight(document.getElementsByClassName('app-headline'), 80));
            }
            return this.get('headlineHeight');
        },
        // header 高度 底部高度 全局title高度 模快预留bottom
        contentHeight() {
            return windowHeight() - this.bottomHeight() - this.headerHeight();
        },
        /**
         * 大屏内部高度
         * @returns {number}
         */
        screenContentHeight() {
            return windowHeight() - this.titleHeight() - 20;
        }
    }
})();

/**
 * 根据dom获取各个高度
 * @param dom
 * @param {number} defauleHeight
 * @returns {number}
 */
function getHeaderHeight(dom, defauleHeight = 0) {
    const _dom = getDom(dom);
    return _dom ? _dom.offsetHeight : defauleHeight;
}

/**
 * 获取dom
 * @param dom
 * @returns {any}
 */
function getDom(dom) {
    return dom && dom[0] ? dom[0] : null
}

/**
 * 获取样式
 * @param dom
 * @param key
 */
function getStyle(dom, key) {
    const _dom = getDom(dom);
    const css = _dom ? window.getComputedStyle(_dom) : {};
    return css[key] || '';
}

/**
 * 获取项目内部内容高度
 * @returns {number}
 */
export function contentHeight() {
    return getKindHeight.contentHeight();
}

/**
 * 获取大屏内部内容区域
 * @returns {number}
 */
export function screenContentHeight() {
    return getKindHeight.screenContentHeight();
}

/**
 * 获取可用高度
 * @constructor
 */
export function AvailableHeight() {

}

/**
 * 获取window的高度
 * @returns {any}
 */
export function windowHeight(): number {
    return getWindowSize().availHeight;
}

/**
 * 获取window的宽高
 * @returns {any}
 */
export function boxSize() {
    return getWindowSize();
}

/**
 * 将图片转换成base64 并返回路径
 * @param img
 * @param {number} width 调用时传入具体像素值，控制大小 ,不传则默认图像大小
 * @param {number} height
 * @returns {string}
 */
function getBase64Image(img, width = 0, height = 0) {
    const canvas = document.createElement('canvas');
    canvas.width = width || img.width;
    canvas.height = height || img.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL();
    return dataURL;
}

/**
 * 检查是不是Base64
 * @param img
 * @returns {boolean}
 */
function IsBase64(img: string) {
    // jpg jpeg png gif
    const _img: string = img.toLowerCase();
    if (_img.endsWith('jpg') || _img.endsWith('jpeg')
        || _img.endsWith('png') || _img.endsWith('gif')
        || _img.startsWith('blob')) return false;
    return true;
}

/**
 * 加载图片 加载成功后经图片返回
 * @param img
 * @returns {Promise<any>}
 */
function getBase64(img: string) {
    let url: string;
    if (IsBase64(img)) {
        // 有一些数据 后台没有返回前缀
        const _base64 = 'data:image/jpeg;base64,';
        if (img.startsWith(_base64)) {
            url = img;
        } else {
            url = _base64 + img;
        }
        return url;
    } 
        url = img;
        const image = new Image();
        image.crossOrigin = '*';
        image.src = url;
        return new Promise(function (resolve, reject) {
            image.onload = function () {
                resolve(getBase64Image(image));// 将base64传给done上传处理
            }
        });
    
}

/**
 * 压缩图片
 */
function setBase64Img(zip, imgFolder, base64, imgArr, index, downloadName) {
    // base64 = base64.split('base64,')[1];
    // imgFolder.file(downloadName + '_' + index + '.png', base64, { base64: true });
    // if (index === imgArr.length - 1) {
    //   zip.generateAsync({ type: 'blob' }).then((blob) => {
    //     saveAs(blob, downloadName + '.zip');
    //   });
    // }
}

/**
 * 下载压缩图片
 * @param {any[]} imgArr  图片合集
 * @param {string} imgKey  如果不是单纯的图片路径 需要传入路径的key
 */
export function downloadZipImage(imgArr: any[], imgKey = '', downloadName = 'img') {
    if (!imgArr || !imgArr.length) {
        return;
    }
    const zip = new JSZip();
    // 创建images文件夹
    const imgFolder = zip.folder('images');
    // test
    // imgArr = ['assets/img/charts/return-upper-level.png',
    // 'assets/img/tree/arrow_right.png',
    // 'assets/img/tree/arrow_left.png',
    // 'assets/img/charts/map_ShadowMap.png'];

    let index = 0; //  判断加载了几张图片的标识
    for (let i = 0; i < imgArr.length; i++) {
        const itemImg: string = imgKey ? imgArr[i][imgKey] : imgArr[i];
        /**
         * 如果是Base64就不需要再做异步处理了
         */
        const Base64Img: any = getBase64(itemImg);
        if (Base64Img.then) {
            Base64Img.then(function (base64: string) {
                setBase64Img(zip, imgFolder, base64, imgArr, index, downloadName);
                index++;
            }, function (err) {
                console.log(err);// 打印异常信息
            });
        } else {
            setBase64Img(zip, imgFolder, Base64Img, imgArr, index, downloadName);
            index++;
        }
    }
}


/**
 * 获取文本宽度
 * @param {string} text
 */
export function getTextWidth(ctx: any, text: string, size: number = 12, font: string = 'Arial') {
    if (!ctx) {
        ctx = document.createElement('canvas').getContext('2d');
    }
    ctx.font = `${size  }px ${  font}`; // sans-serif
    return ctx.measureText(text).width;
}

/**
 * 字符串截取...显示
 * @param {string} text
 * @param {number} width
 * @param {number} size
 * @param {string} font
 * @returns {string}
 */
export function ellipsps(text: string = '', width: number, size: number = 12, font: string = 'Arial',) {
    const w = getTextWidth(null, text, size, font);
    if (w < width) return text;
    let ellipspsText = '';
    const len = text.length;
    for (let i = 0; i < len; i++) {
        ellipspsText += text[i];
        if (getTextWidth(null, `${ellipspsText  }...`, size, font) > width) return `${ellipspsText  }...`;
    }
    return text;
}

/**
 * 去掉url的参数
 * @param url
 * @returns {any}
 */
export function removeUlrParames(url: string) {
    if (url) {
        url = url.replace(/#/, '')
        if (url.indexOf('?') !== -1) {
            return url.substring(0, url.indexOf('?'));
        }
    }
    return url;
}

export function isEmptyObject(val: any) {
    return JSON.stringify(val) === '{}';
}


/**
 * @desc 函数防抖
 * @param fn 函数
 * @param timeout 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
export function debounceImmediately(fn: any, timeout = 200, immediate = true) {
    let _timeout;
    return function () {
        const context = this;
        const args = arguments;

        if (_timeout) clearTimeout(_timeout);
        if (immediate) {
            const callNow = !_timeout;
            _timeout = setTimeout(() => {
                _timeout = null;
            }, timeout);
            if (callNow) fn.apply(context, args)
        } else {
            _timeout = setTimeout(function () {
                fn.apply(context, args)
            }, timeout);
        }
    }
}

/**
 * @desc 函数节流
 * @param fn 函数
 * @param timeout 延迟执行毫秒数
 * @param type 1 表时间戳版，2 表定时器版
 */
export function __throttle(fn: any, timeout = 200, type = 1) {
    let previous = 0;
    let _timeout: any;

    return function () {
        const context = this;
        const args = arguments;
        if (type === 1) {
            const now = Date.now();

            if (now - previous > timeout) {
                fn.apply(context, args);
                previous = now;
            }
        } else if (type === 2) {
            if (!_timeout) {
                _timeout = setTimeout(() => {
                    _timeout = null;
                    fn.apply(context, args)
                }, timeout)
            }
        }
    }
}

/**
 * 根据file获取图片的url
 * @param file
 * @param {string} tyle
 * @returns {string | Promise<any>}
 */
export function getImgURLByFile(file: any, base64 = true) {
    let url: any;
    // 下面函数执行的效果是一样的，只是需要针对不同的浏览器执行不同的 js 函数而已
    const w: any = window;
    if (w.createObjectURL !== undefined) {   // basic
        url = w.createObjectURL(file);
    } else if (w.URL !== undefined) {        // mozilla(firefox)
        url = w.URL.createObjectURL(file);
    } else if (w.webkitURL !== undefined) {  // webkit or chrome
        url = w.webkitURL.createObjectURL(file);
    }
    return base64 ? getBase64(url) : url;
}