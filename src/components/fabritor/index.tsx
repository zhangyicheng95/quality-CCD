import { fabric } from 'fabric';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Layout, Spin } from 'antd';
import Header from './UI/header';
import Panel from './UI/panel';
import Setter from './UI/setter';
import Editor from './editor';
import { GloablStateContext } from '@/context';
import ContextMenu from './components/ContextMenu';
import { SKETCH_ID } from '@/common/constants/globalConstants';
import ObjectRotateAngleTip from './components/ObjectRotateAngleTip';
import rough from 'roughjs';
import { createPathFromSvg } from '@/components/fabritor/editor/objects/path';
import { createTextbox } from '@/components/fabritor/editor/objects/textbox';
import { createFImage } from '@/components/fabritor/editor/objects/image';
import { drawArrowLine, drawLine, drawTriArrowLine } from '@/components/fabritor/editor/objects/line';
import ShapeTypeList from '@/components/fabritor/UI/panel/ShapePanel/shape-type-list';
import styles from './index.less';
import { useModel } from 'umi';

const { Content } = Layout;

const workspaceStyle: React.CSSProperties = {
  // background: '#ddd',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  flex: 1
}

const contentStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%'
}

interface Props {
  shapeFromData: any;
  onLoadTypeChange?: any;
}

export default function Fabritor(props: Props) {
  const { shapeFromData, onLoadTypeChange } = props;
  const { initialState } = useModel<any>('@@initialState');
  const { params } = initialState;
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const workspaceEl = useRef<HTMLDivElement>(null);
  const roughSvgEl = useRef(null);
  const [editor, setEditor] = useState<any>(null);
  const [roughSvg, setRoughSvg] = useState<any>();
  const [activeObject, setActiveObject] = useState<fabric.Object | null | undefined>(null);
  const [isReady, setReady] = useState(false);
  const contextMenuRef = useRef<any>(null);

  const theme = useMemo(() => {
    return params?.contentData?.theme || 'realDark';
  }, [params?.contentData?.theme]);
  const clickHandler = (opt: any) => {
    const { target } = opt;
    if (editor.getIfPanEnable()) return;

    if (!target) {
      contextMenuRef.current?.hide();
      return;
    }

    if (opt.button === 3) { // 右键
      if (target.id !== SKETCH_ID) {
        editor.canvas?.setActiveObject(target);
      }
      setTimeout(() => {
        contextMenuRef.current?.show();
      }, 50);
    } else {
      contextMenuRef.current?.hide();
    }
  }

  const selectionHandler = (opt: any) => {
    const { selected, sketch } = opt;
    if (selected && selected.length) {
      const selection = editor.canvas?.getActiveObject();
      setActiveObject(selection);
    } else {
      // @ts-ignore
      setActiveObject(sketch);
    }
  }

  const groupHandler = () => {
    const selection = editor.canvas?.getActiveObject();
    setActiveObject(selection);
  }

  const loadJsonHandler = (opt: any) => {
    const { lastActiveObject } = opt;
    if (lastActiveObject) {
      editor.canvas?.setActiveObject(lastActiveObject);
      setActiveObject(lastActiveObject);
    }
  };
  // 窗口大小改变，动态修改画布大小
  const resizeCanvas = () => {
    editor?.canvas?.setWidth?.(workspaceEl?.current?.offsetWidth);
    editor?.canvas?.setHeight?.(workspaceEl?.current?.offsetHeight);
  };
  // 初始化绑定事件
  const initEvent = () => {
    editor.canvas?.on('selection:created', selectionHandler);
    editor.canvas?.on('selection:updated', selectionHandler);
    editor.canvas?.on('selection:cleared', selectionHandler);
    editor.canvas?.on('mouse:down', clickHandler);
    editor.canvas?.on('fabritor:group', groupHandler);
    editor.canvas?.on('fabritor:ungroup', groupHandler);
    editor.canvas?.on('fabritor:load:json', loadJsonHandler);
    window.addEventListener('resize', resizeCanvas);
  };
  const removeEvent = () => {
    editor.canvas?.off('selection:created', selectionHandler);
    editor.canvas?.off('selection:updated', selectionHandler);
    editor.canvas?.off('selection:cleared', selectionHandler);
    editor.canvas?.off('mouse:down', clickHandler);
    editor.canvas?.off('fabritor:group', groupHandler);
    editor.canvas?.off('fabritor:ungroup', groupHandler);
    editor.canvas?.off('fabritor:load:json', loadJsonHandler);
    window.removeEventListener('resize', resizeCanvas);
  }
  // 初始化画布
  const initEditor = async () => {
    const _editor: any = new Editor({
      canvasEl: canvasEl.current,
      workspaceEl: workspaceEl.current,
      sketchEventHandler: {
        groupHandler: () => {
          setActiveObject(_editor.canvas?.getActiveObject());
        }
      },
      theme
    });

    await _editor.init();
    setEditor(_editor);
    setReady(true);
    setActiveObject(_editor.sketch);

    const jsonStr = localStorage.getItem('fabritor_web_json')
    if (jsonStr) {
      await _editor.loadFromJSON(jsonStr);
    }

    _editor.canvas?.on('object:moving', function (e: any) {
      var obj = e.target;

      // if object is too big ignore
      if (obj?.cacheHeight > obj?.canvas?.height || obj?.cacheWidth > obj?.canvas?.width) {
        return;
      }
      obj?.setCoords();
      // top-left  corner
      if (obj?.getBoundingRect()?.top < 0) {
        obj.top = 0; //Math.max(obj?.top, obj?.top - obj?.getBoundingRect()?.top);
      }
      if (obj?.getBoundingRect()?.left < 0) {
        obj.left = 0; //Math.max(obj?.left, obj?.left - obj?.getBoundingRect()?.left);
      }
      // bot-right corner
      if (
        (obj?.getBoundingRect()?.top + obj?.getBoundingRect()?.height / (_editor?.sketch?.zoomY || 1)) > obj?.canvas?.height
      ) {
        obj.top = obj?.canvas?.height - obj?.getBoundingRect()?.height / (_editor?.sketch?.zoomY || 1); //Math.min(obj?.top, obj?.canvas?.height - obj?.getBoundingRect()?.height + obj?.top - obj?.getBoundingRect()?.top);
      }
      if (
        (obj?.getBoundingRect()?.left + obj?.getBoundingRect()?.width / (_editor?.sketch?.zoomX || 1)) > obj?.canvas?.width
      ) {
        obj.left = _editor.sketch?.width - obj?.getBoundingRect()?.width / (_editor?.sketch?.zoomX || 1); //Math.min(obj?.left, obj?.canvas?.width - obj?.getBoundingRect()?.width + obj?.left - obj?.getBoundingRect()?.left);
      }
    });
  }
  // 初始化图形画布
  const initRoughSvg = () => {
    // @ts-ignore rough svg
    setRoughSvg(rough.svg(roughSvgEl.current));
  }
  // 初始化所有事件
  useEffect(() => {
    if (editor) {
      initEvent();
      initRoughSvg();
    }

    return () => {
      if (editor) {
        removeEvent();
      }
    }
  }, [editor]);
  // 初始化 画布
  useEffect(() => {
    setTimeout(() => {
      initEditor();
    }, 200)

    return () => {
      if (editor) {
        editor.destroy();
      }
    }
  }, []);
  // 根据返回的数据渲染文字
  const handleAddText = async (options: any) => {
    await createTextbox({ ...options, canvas: editor.canvas });
  }
  // 根据返回的数据渲染图片
  const addImage = async (options: any) => {
    const { url, ...rest } = options;
    await createFImage({
      ...rest,
      imageSource: url,
      canvas: editor.canvas
    });
  }
  // 返回轨迹点渲染
  useEffect(() => {
    console.log(new Date(), '标定组件接受到数据', shapeFromData);
    if (!!editor && !!shapeFromData?.length) {
      (shapeFromData || [])?.forEach((i: any) => {
        if (i.type === 'text') {
          handleAddText({
            top: i.top,
            left: i.left,
            width: i.width,
            height: i.height,
            backgroundColor: i.backgroundColor,
            fill: i.color,
            text: i.text
          });
        } else if (i.type === 'image') {
          addImage({
            url: i.url,
            top: i.top,
            left: i.left,
            width: i.width,
            height: i.height,
            backgroundColor: i.backgroundColor,
          });
        } else if (i.type === "line") {
          drawLine({
            x1: i.x1,
            y1: i.y1,
            x2: i.x2,
            y2: i.y2,
            stroke: i.color,
            canvas: editor.canvas,
            sub_type: 'line'
          });
        } else if (i.type === "dash-line") {
          drawLine({
            x1: i.x1,
            y1: i.y1,
            x2: i.x2,
            y2: i.y2,
            stroke: i.color,
            canvas: editor.canvas,
            sub_type: 'dash-line'
          });
        } else if (i.type === "arrow-line-1") {
          drawArrowLine({
            x1: i.x1,
            y1: i.y1,
            x2: i.x2,
            y2: i.y2,
            stroke: i.color,
            canvas: editor.canvas,
            sub_type: 'arrow-line-1'
          });
        } else if (i.type === "arrow-line-2") {
          drawTriArrowLine({
            x1: i.x1,
            y1: i.y1,
            x2: i.x2,
            y2: i.y2,
            stroke: i.color,
            canvas: editor.canvas,
            sub_type: 'arrow-line-2'
          });
        } else if (i.type === 'point') {
          createPathFromSvg({
            top: i.top,
            left: i.left,
            svgString: '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="2" fill="#f00" stroke="#f00" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
            canvas: editor.canvas,
            sub_type: 'point',
            hasControls: false,
            strokeWidth: 4,
          });
        } else if (i.type === 'rect') {
          createPathFromSvg({
            top: i.top,
            left: i.left,
            svgString: ShapeTypeList?.filter((i: any) => i.key === 'rect')?.[0]?.elem,
            canvas: editor.canvas,
            sub_type: 'rect',
            strokeWidth: 4,
          });
        } if (i.type === 'circle') {
          createPathFromSvg({
            top: i.top,
            left: i.left,
            svgString: ShapeTypeList?.filter((i: any) => i.key === 'circle')?.[0]?.elem,
            canvas: editor.canvas,
            sub_type: 'circle',
            strokeWidth: 4,
          });
        }
      });
    }
  }, [shapeFromData]);

  return (
    <GloablStateContext.Provider
      value={{
        object: activeObject,
        setActiveObject,
        isReady,
        setReady,
        editor,
        roughSvg,
        onLoadTypeChange,
        theme,
      }}
    >
      <div className={styles["fabritor-layout"]}>
        <Spin spinning={!isReady}>
          <ObjectRotateAngleTip />
          <Header />
          <div style={{ height: 'calc(100% - 51px)' }} className="flex-box">
            <Panel />
            <Content style={contentStyle}>
              <ContextMenu ref={contextMenuRef} object={activeObject}>
                <div style={workspaceStyle} ref={workspaceEl} className="fabritor-workspace">
                  <canvas ref={canvasEl} />
                </div>
              </ContextMenu>
            </Content>
            <Setter />
          </div>
        </Spin>
        <svg id="fabritor-rough-svg" ref={roughSvgEl} />
      </div>
    </GloablStateContext.Provider>
  )
}