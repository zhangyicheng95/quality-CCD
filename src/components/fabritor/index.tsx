import { fabric } from 'fabric';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Layout, Spin } from 'antd';
import Header from './UI/header';
import Panel from './UI/panel';
import Setter from './UI/setter';
import Editor from './editor';
import { GloablStateContext } from '@/context';
import ContextMenu from './components/ContextMenu';
import { CALIPER_RULE_FORMAT, SKETCH_ID } from '@/common/constants/globalConstants';
import ObjectRotateAngleTip from './components/ObjectRotateAngleTip';
import rough from 'roughjs';
import { createPathFromSvg } from '@/components/fabritor/editor/objects/path';
import { createTextbox } from '@/components/fabritor/editor/objects/textbox';
import { createFImage } from '@/components/fabritor/editor/objects/image';
import { drawArrowLine, drawLine, drawTriArrowLine } from '@/components/fabritor/editor/objects/line';
import ShapeTypeList from '@/components/fabritor/UI/panel/ShapePanel/shape-type-list';
import styles from './index.less';
import { useModel } from 'umi';
import { groupSelection, removeObject } from '@/utils/helper';
import { guid } from '@/utils/utils';

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
  fetchType?: any;
  xName?: any;
  yName?: any;
}

export default function Fabritor(props: Props) {
  const {
    shapeFromData,
    fetchType,
    xName,
    yName,
  } = props;
  const { initialState } = useModel<any>('@@initialState');
  const { params } = initialState;
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const workspaceEl = useRef<HTMLDivElement>(null);
  const roughSvgEl = useRef(null);
  const timerRef = useRef<any>();
  const [dataSource, setDataSOurce] = useState<any>({});
  const [editor, setEditor] = useState<any>(null);
  const [isInit, setIsInit] = useState(false);
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
    const selection = editor.canvas?.getActiveObject();
    setActiveObject(selection);
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
    // editor.canvas?.on('selection:created', selectionHandler);
    // editor.canvas?.on('selection:updated', selectionHandler);
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
    setIsInit(true);
    setReady(true);
    setActiveObject(_editor.sketch);

    const jsonStr = localStorage.getItem('fabritor_web_json')
    if (jsonStr) {
      const json = JSON.parse(jsonStr);
      setDataSOurce(json || {});
      const string = JSON.stringify({
        ...json,
        background: theme === "realDark" ? "#000" : "#fff",
        objects: (json.objects || [])
          ?.map((item: any) => {
            return Object.assign({}, item,
              ((item?.type === 'path' && item?.path?.length <= 3) || item?.sub_type === 'image') ? {
                hasControls: false,
              } : {}
            )
          })
      })
      await _editor.loadFromJSON(string);
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
    await createFImage({
      ...options,
      canvas: editor.canvas
    });
  }
  // 返回轨迹点渲染
  useEffect(() => {
    if (!isInit || !editor || !shapeFromData) {
      return;
    }
    if (!!timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      console.log('标定组件接受到数据', shapeFromData);
      if (!!editor && !!shapeFromData && !!Object.keys(shapeFromData)?.length) {
        // 渲染之前，先把前一次算法结果删除
        const json = editor.canvas?.getObjects();
        json?.forEach((item: any) => {
          if (
            item?.sub_type === 'outer_point'
            || item?.sub_type?.indexOf('line_result') > -1
            || item?.sub_type === 'image_result'
            || (item?.sub_type?.indexOf('average') > -1 && item?.sub_type?.indexOf('average_half_') < 0)
          ) {
            removeObject(item, editor.canvas);
          }
        });
        // 然后开始渲染新的结果
        const { type, data = [] } = shapeFromData;
        (data || [])?.forEach((i: any) => {
          if (i.type === 'image') {
            addImage({
              imageSource: i.url,
              ...!!i.top ? {
                top: i.top,
                left: i.left,
                width: i.width,
                height: i.height,
                backgroundColor: i.backgroundColor,
              } : {},
              selectable: false,
              hasControls: false,
              opacity: i.opacity ? i.opacity : 1,
              sub_type: 'image',
            });
          } else if (i.type === "line") {
            const { result } = i;
            const ID = guid();
            drawLine({
              points: [result.x1, result.y1, result.x2, result.y2],
              left: Math.min(result.x1, result.x2),
              top: Math.min(result.y1, result.y2),
              stroke: '#f00',
              strokeWidth: 2,
              canvas: editor.canvas,
              selectable: false,
              hasControls: false,
              mark_type: type,
              id: ID,
              sub_type: 'line_result',
              caliperRule: {
                name: i.name,
                ...Object.keys(CALIPER_RULE_FORMAT)?.reduce((pre: any, cen: string) => {
                  return Object.assign({}, pre, {
                    [cen]: i[cen]
                  })
                }, {})
              }
            });
            if (result.value) {
              const x = Math.min(result.x1, result.x2) + 200;
              handleAddText({
                top: (result.y1 + result.y2) / 2 - 13,
                left: x,
                backgroundColor: result.type === 1 ? '#b8831b' : result.type === 2 ? '#f00' : '#0f0',
                fill: '#fff',
                width: (result.value + '')?.length * 16,
                text: result.value?.toFixed(2),
                // selectable: false,
                hasControls: false,
                sub_type: `line_result-${ID}`
              });
              drawLine({
                points: [
                  (result.x1 + result.x2) / 2, (result.y1 + result.y2) / 2,
                  x, (result.y1 + result.y2) / 2
                ],
                left: (result.x1 + result.x2) / 2,
                top: (result.y1 + result.y2) / 2,
                stroke: '#f00',
                strokeWidth: 2,
                strokeDashArray: [8, 8],
                canvas: editor.canvas,
                selectable: false,
                hasControls: false,
                sub_type: `line_result-${ID}`
              });
            }
          } else if (i.type === 'point') {
            drawLine({
              points: [i.x, i.y, i.x + 1, i.y + 1],
              left: i.x,
              top: i.y,
              stroke: '#f00',
              strokeWidth: 2,
              canvas: editor.canvas,
              selectable: false,
              hasControls: false,
              mark_type: type,
              sub_type: 'outer_point'
            });
            // createPathFromSvg({
            //   svgString: '<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="2" fill="#f00" stroke="#f00" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
            //   canvas: editor.canvas,
            //   selectable: false,
            //   hasControls: false,
            //   top: i.y,
            //   left: i.x,
            //   y: i.y,
            //   x: i.x,
            //   strokeWidth: 2,
            //   sub_type: 'outer_point',
            //   mark_type: type
            // });
          } else if (i.type === 'rect') {
            createPathFromSvg({
              top: i.top,
              left: i.left,
              width: i.width,
              height: i.height,
              svgString: ShapeTypeList?.filter((i: any) => i.key === 'rect')?.[0]?.elem,
              canvas: editor.canvas,
              sub_type: 'rect',
              strokeWidth: 4,
              mark_type: type
            });
          } else if (i.type === 'circle') {
            createPathFromSvg({
              top: i.top,
              left: i.left,
              radius: i.radius,
              svgString: ShapeTypeList?.filter((i: any) => i.key === 'circle')?.[0]?.elem,
              canvas: editor.canvas,
              sub_type: 'circle',
              strokeWidth: 4,
              mark_type: type
            });
          } else if (i.type === 'image_result') {
            const target = json?.filter((ic: any) => ic.sub_type === 'image')?.[0] || {};
            addImage({
              imageSource: i.url,
              ...!!i.top ? {
                top: i.top,
                left: i.left,
                width: i.width,
                height: i.height,
                backgroundColor: i.backgroundColor,
              } : !!target ? {
                top: target.top,
                left: target.left,
                width: target.width,
                height: target.height,
              } : {},
              selectable: false,
              hasControls: false,
              opacity: i.opacity ? i.opacity : 0.5,
              sub_type: 'image_result',
            });
          }
        });
        setActiveObject(editor.sketch);
      }
    }, 500);
  }, [isInit, shapeFromData]);

  return (
    <GloablStateContext.Provider
      value={{
        data: dataSource,
        object: activeObject,
        setActiveObject,
        isReady,
        setReady,
        editor,
        roughSvg,
        fetchType,
        xName,
        yName,
        theme,
        addImage,
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