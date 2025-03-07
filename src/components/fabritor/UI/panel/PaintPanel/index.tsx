import { Tooltip, Button } from 'antd';
import Title from '@/components/fabritor/components/Title';
import { useContext, useEffect, useState } from 'react';
import { fabric } from 'fabric';
import { DRAW_MODE_CURSOR, DRAG_ICON } from '@/common/constants/globalConstants';
import BrushList from '@/components/fabritor/UI/panel/PaintPanel/brush-list';
import { GloablStateContext } from '@/context';
import PathSetterForm from '../../setter/PathSetter/PathSetterForm';

export default function PaintPanel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDrawingMode, setIsDrawingMode] = useState(true);
  const { editor } = useContext<any>(GloablStateContext);
  const [penFormValues, setPenFormValues] = useState({});

  const handleBrushChange = (options: any) => {
    if (options.color) {
      editor.canvas.freeDrawingBrush.color = options.color;
    }
    if (options.width) {
      editor.canvas.freeDrawingBrush.width = options.width;
    }
    if (options.strokeLineCap) {
      editor.canvas.freeDrawingBrush.strokeLineCap = options.strokeLineCap;
    }
    if (options.shadow) {
      const shadow: any = editor.canvas.freeDrawingBrush.shadow;
      const originalShadowObject = shadow ? shadow.toObject() : {};
      const newShadowObject = {
        blur: options.shadow.width || originalShadowObject.blur,
        offsetX: options.shadow.offset || originalShadowObject.offsetX,
        offsetY: options.shadow.offset || originalShadowObject.offsetY,
        affectStroke: true,
        color: options.shadow.color || originalShadowObject.color,
      }
      editor.canvas.freeDrawingBrush.shadow = new fabric.Shadow(newShadowObject);
    }
  }

  const stopFreeDrawMode = () => {
    editor.canvas.isDrawingMode = !editor.canvas.isDrawingMode;
    setIsDrawingMode(!isDrawingMode);
  }

  const initBrush = () => {
    if (editor) {
      editor.canvas.isDrawingMode = true;
      editor.canvas.freeDrawingCursor = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(DRAW_MODE_CURSOR)}") 4 12, crosshair`;
      const freeDrawingBrush = new fabric.PencilBrush(editor.canvas);
      editor.canvas.freeDrawingBrush = freeDrawingBrush;
      const { color, width } = BrushList[0].options;
      freeDrawingBrush.color = color;
      freeDrawingBrush.width = width;
      freeDrawingBrush.shadow = new fabric.Shadow({
        blur: 0,
        offsetX: 0,
        offsetY: 0,
        affectStroke: true,
        color: '#000000',
      });

      setPenFormValues({
        color,
        width,
        shadow: {
          color: '#000000',
          width: 0,
          offset: 0
        }
      });
    }

    return () => {
      if (editor?.canvas) {
        editor.canvas.isDrawingMode = false;
      }
    }
  }

  useEffect(() => {
    return initBrush();
  }, []);

  return (
    <div className="fabritor-panel-wrapper">
      <div className='flex-box-justify-around' style={{ flexWrap: 'wrap' }}>
        {
          BrushList.map((item, index) => (
            <Tooltip trigger="hover" title={item.title}>
              <div
                key={item.key}
                className="fabritor-panel-shape-item"
                onClick={() => {
                  handleBrushChange(item.options);
                  setActiveIndex(index);
                  setPenFormValues({
                    ...penFormValues,
                    ...item.options
                  });
                }}
                style={{
                  padding: '4px 8px',
                  backgroundColor: activeIndex === index ? '#eeeeee' : 'rgba(0,0,0,0)',
                  borderRadius: 8
                }}
              >
                <img src={`data:image/svg+xml,${encodeURIComponent(item.svg)}`} alt="" style={{ width: 56, height: 56 }} />
              </div>
            </Tooltip>
          ))
        }
      </div>
      <PathSetterForm
        onChange={handleBrushChange}
        value={penFormValues}
        showPenTip
      />
      <Title>{'操作'}</Title>
      <div className='flex-box-justify-around' style={{ flexWrap: 'wrap' }}>
        <Button
          style={{ width: 64 }}
          onClick={stopFreeDrawMode}
          type={isDrawingMode ? 'default' : 'primary'}
          title={isDrawingMode ? '停止绘图' : '开始绘图'}
        >
          <img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(DRAG_ICON)}`} style={{ width: 22, height: 22 }} />
        </Button>
      </div>
    </div>
  )
}