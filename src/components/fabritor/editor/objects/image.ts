import { fabric } from 'fabric';
import { uuid } from '@/utils/utils';
import { message } from 'antd';

export const loadImageDom = async (url: any) => {
  return new Promise((resolve, reject) => {
    fabric.util.loadImage(url, (img) => {
      if (img) {
        return resolve(img);
      }
      message.error('加载图片失败');
      return reject();
    }, null, 'anonymous');
  });
}

export const loadImage = async (imageSource: any, canvas: any) => {
  if (typeof imageSource === 'string') {
    return new Promise<fabric.Image>((resolve, reject) => {
      fabric.Image.fromURL(
        imageSource,
        () => {
          fabric.util.loadImage(imageSource, (img: any) => {
            if (!img || !img.width) {
              message.error('加载图片失败');
              reject();
              return;
            } else {
              const { width, height } = canvas;
              let scale = (img.width / width >= 0.9 || img.height / height >= 0.9) ?
                Math.min(width / img.width, height / img.height) : 1;

              const result = new fabric.Image(img, {
                scaleX: scale,
                scaleY: scale
              });
              resolve(result);
            }
          }, { crossOrigin: 'anonymous' });
        },
        { crossOrigin: 'anonymous' }
      );
    });
  }
  return Promise.resolve(new fabric.Image(imageSource));
}

export const createClipRect = (object: any, options = {}) => {
  const width = object.getScaledWidth();
  const height = object.getScaledHeight();
  return new fabric.Rect({
    left: -width / 2,
    top: -height / 2,
    width,
    height,
    ...options
  });
}

export const createImage = async (options: any) => {
  const { imageSource, canvas, ...rest } = options || {};

  let img!: fabric.Image;
  try {
    img = await loadImage(imageSource, canvas);
  } catch (e) { console.log(e); }

  if (!img) return;

  img.set({
    ...rest,
    paintFirst: 'fill',
    id: uuid()
  });

  canvas.viewportCenterObject(img);
  canvas.add(img);
  canvas.setActiveObject(img);
  canvas.requestRenderAll();

  return img;
}

export const createFImage = async (options: any) => {
  const { imageSource, canvas } = options || {};

  let img!: fabric.Image;
  try {
    img = await loadImage(imageSource, canvas);
  } catch (e) {
    console.log(e);
  }

  if (!img) return;
  // @ts-ignore
  const fimg = new fabric.FImage({
    image: img,
    id: uuid(),
    sub_type: 'image'
  });

  canvas.viewportCenterObject(fimg);
  canvas.add(fimg);
  canvas.setActiveObject(fimg);
  canvas.requestRenderAll();
}