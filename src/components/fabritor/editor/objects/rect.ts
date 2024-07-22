import { fabric } from 'fabric';
import { uuid } from '@/utils/utils';

export default function createRect(options: any) {
  const { canvas, ...rest } = options || {};
  const rect = new fabric.Rect({
    id: uuid(),
    width: 200,
    height: 200,
    ...rest,
  });

  canvas.viewportCenterObject(rect);
  canvas.add(rect);
  canvas.setActiveObject(rect);
  canvas.requestRenderAll();
  return rect;
}