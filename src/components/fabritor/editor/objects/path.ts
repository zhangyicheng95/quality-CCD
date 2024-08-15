import { fabric } from 'fabric';
import { uuid } from '@/utils/utils';

export const loadSvgFromString = async (string: any) => {
  return new Promise((resolve) => {
    fabric.loadSVGFromString(string, (objects, options) => {
      const svg = fabric.util.groupSVGElements(objects, options);
      resolve(svg);
    });
  });
}

export const loadSvgFromUrl = async (url: any) => {
  return new Promise((resolve) => {
    fabric.loadSVGFromURL(url, (objects, options) => {
      const svg = fabric.util.groupSVGElements(objects, options);
      resolve(svg);
    });
  });
}

export const createPathFromSvg = async (options: any, notAddCanvas?: boolean) => {
  const { svgString, canvas, ...rest } = options || {};

  const svg = await loadSvgFromString(svgString) as fabric.Path;

  svg.set({
    ...rest,
    id: uuid()
  });
  canvas.viewportCenterObject(svg);
  if (notAddCanvas) {
    return svg;
  }

  canvas.add(svg);
  canvas.setActiveObject(svg);
  canvas.requestRenderAll();

  return svg;
}