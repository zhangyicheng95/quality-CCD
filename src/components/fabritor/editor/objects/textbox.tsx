import { fabric } from 'fabric';
import { TEXTBOX_DEFAULT_CONFIG } from '@/common/constants/globalConstants';
import { uuid } from '@/utils/utils';
import { loadFont } from '@/utils/fabrictorUtils';

export const getTextboxWidth = (textbox: any) => {
  const textLines = textbox.textLines || [];
  if (!textLines || !textLines.length) return 0;
  let width = 0;
  for (let i = 0; i < textLines.length; i++) {
    width += textbox.measureLine(i).width;
  }
  return width + 4;
}

export const getPathOffset = (textbox: any) => {
  if (!textbox.path) {
    return 100;
  }
  const path = textbox.path.path;
  const offset = Math.ceil(path[1][2] / (getTextboxWidth(textbox) / 2) * 100);
  return offset > 100 ? 100 : offset;
}

export const drawTextPath = (textbox: any, offset: any) => {
  if (textbox.isEditing) return;

  // textbox should 1 line when use path
  const width = getTextboxWidth(textbox);
  const path = new fabric.Path(`M 0 0 Q ${width / 2} ${width / 2 * offset / 100} ${width} 0`, {
    visible: false,
    stroke: '#000000',
    fill: '#00000000'
  });
  textbox.set({
    path,
    width
  });
  textbox.canvas.requestRenderAll();
}

// 移除 path 属性位置错误，拖动一下才会更新。
export const removeTextPath = (textbox: any) => {
  textbox.set({
    path: null
  });
  textbox.canvas.requestRenderAll();
}

export const createTextbox = async (options: any) => {
  let { text = '', fontFamily = TEXTBOX_DEFAULT_CONFIG.fontFamily, canvas, ...rest } = options || {};

  if (typeof text === 'function') {
    text = text();
  }

  let tmpPathInfo = { hasPath: false, offset: 100 };
  // @ts-ignore
  const textBox = new fabric.FText(text || '添加文本框', {
    sub_type: 'text',
    ...TEXTBOX_DEFAULT_CONFIG,
    backgroundColor: 'rgba(144,144,144,1)',
    lineHeight: 1.1,
    fontSize: 24,
    fontFamily,
    pathAlign: 'center',
    id: uuid(),
    ...rest,
  });

  textBox.on('editing:entered', () => {
    if (textBox.path) {
      tmpPathInfo.hasPath = true;
      tmpPathInfo.offset = getPathOffset(textBox);
      textBox.set('path', null);
      textBox.initDimensions();
      canvas.requestRenderAll();
    } else {
      tmpPathInfo.hasPath = false;
    }
  });

  textBox.on('editing:exited', () => {
    if (tmpPathInfo.hasPath) {
      drawTextPath(textBox, tmpPathInfo.offset);
      canvas.requestRenderAll();
    }
  });

  if (options.left == null && options.top == null) {
    canvas.viewportCenterObject(textBox);
  } else if (options.left == null) {
    canvas.viewportCenterObjectH(textBox);
  }
  canvas.add(textBox);
  canvas.setActiveObject(textBox);
  canvas.requestRenderAll();

  if (fontFamily) {
    try {
      await loadFont(fontFamily);
    } finally {
      textBox.set('fontFamily', fontFamily);
      canvas.requestRenderAll();
    }
  }

  return textBox;
}