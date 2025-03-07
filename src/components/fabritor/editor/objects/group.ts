import { fabric } from 'fabric';
import { uuid } from '@/utils/utils';

export const createGroup = (options: any) => {
  const { items, canvas, ...rest } = options;

  const group = new fabric.Group(items, {
    id: uuid(),
    sub_type: 'group',
    ...rest
  });

  canvas.add(group);
  return group;
}