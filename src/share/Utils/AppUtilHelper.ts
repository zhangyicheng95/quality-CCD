//  import * as CryptoJS from 'crypto-js';
// import { saveAs } from 'file-saver';
// @ts-nocheck
/**
 * 通过自定义标签获取所有的dom集合
 * @param el  要查询dom范围
 * @param tag  要查询的标签
 * @param attr  要查询的属性名称
 * @param value  要匹配的属性值
 * @returns {Array}
 */
function getElementByAttr(el: any, tag: any, attr: any, value: any) {
  const aElements = el || document.getElementsByTagName("div");
  const aEle = [];
  const len = aElements.length;
  for (let i = 0; i < len; i++) {
    if (aElements[i].getAttribute(attr) === value) aEle.push(aElements[i]);
  }
  return aEle;
}

/**
 * 将图片转换成base64 并返回路径
 * @param img
 * @param {number} width 调用时传入具体像素值，控制大小 ,不传则默认图像大小
 * @param {number} height
 * @returns {string}
 */
function getBase64Image(img, width = 0, height = 0) {
  const canvas = document.createElement("canvas");
  canvas.width = width ? width : img.width;
  canvas.height = height ? height : img.height;

  const ctx = canvas.getContext("2d");
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
  if (
    _img.endsWith("jpg") ||
    _img.endsWith("jpeg") ||
    _img.endsWith("png") ||
    _img.endsWith("gif") ||
    _img.startsWith("blob")
  )
    return false;
  return true;
}

/**
 * 加载图片 加载成功后经图片返回
 * @param img
 * @returns {Promise<any>}
 */
export function getBase64(img: string) {
  let url: string;
  if (IsBase64(img)) {
    // 有一些数据 后台没有返回前缀
    const _base64 = "data:image/jpeg;base64,";
    if (img.startsWith(_base64)) {
      url = img;
    } else {
      url = _base64 + img;
    }
    return url;
  } else {
    url = img;
    const image = new Image();
    image.crossOrigin = "*";
    image.src = url;
    return new Promise(function (resolve, reject) {
      image.onload = function () {
        resolve(getBase64Image(image)); //将base64传给done上传处理
      };
    });
  }
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
export function downloadZipImage(
  imgArr: any[],
  imgKey = "",
  downloadName = "img"
) {
  if (!imgArr || !imgArr.length) {
    return;
  }
  const zip = new JSZip();
  // 创建images文件夹
  const imgFolder = zip.folder("images");
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
    if (Base64Img["then"]) {
      Base64Img["then"](
        function (base64: string) {
          setBase64Img(zip, imgFolder, base64, imgArr, index, downloadName);
          index++;
        },
        function (err) {
          console.log(err); //打印异常信息
        }
      );
    } else {
      setBase64Img(zip, imgFolder, Base64Img, imgArr, index, downloadName);
      index++;
    }
  }
}

export const downloadIamge = (imgsrc: string, name: string) => {
  //下载图片地址和图片名
  const image = new Image();
  // 解决跨域 Canvas 污染问题
  image.setAttribute("crossOrigin", "anonymous");
  image.onload = function () {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context: any = canvas.getContext("2d");
    context.drawImage(image, 0, 0, image.width, image.height);
    const url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
    const a = document.createElement("a"); // 生成一个a元素
    const event = new MouseEvent("click"); // 创建一个单击事件
    a.download = name || "photo"; // 设置图片名称
    a.href = url; // 将生成的URL设置为a.href属性
    a.dispatchEvent(event); // 触发a的单击事件
  };
  image.src = imgsrc;
};

// 生成唯一id
export const guid = () => {
  return 'xxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 # STARTING：节点正在启动中
 # FATAL：进程无法成功启动
 # RUNNING：节点正常运行中
 # ERROR: 节点运行出现异常
 # STOPPING：进程正在处理用户的停止请求
 # STOPPED：节点已经被用户主动停止，或从未启动过
 # UNKNOWN：未知状态
 * */
export const nodeStatusColor: any = {
  STARTING: '#52c41a',
  RUNNING: '#52c41a', // 'rgba(24, 144, 255, 1)',
  CREATED: '#ff4d4f',
  STOPPING: '#52c41a',
  STOPPED: '#30a2a3',
  UNKNOWN: '#ffba00',
  EXITED: '#ff4d4f',
  FATAL: '#ff4d4f',
  ERROR: '#ff4d4f',
  default: '',
};