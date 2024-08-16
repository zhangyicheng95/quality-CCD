import { fabric } from 'fabric';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Layout, Spin } from 'antd';
import Header from './UI/header';
import Panel from './UI/panel';
import Setter from './UI/setter';
import Editor from './editor';
import { GloablStateContext } from '@/context';
import ContextMenu from './components/ContextMenu';
import { CALIPER_RULE_FORMAT, SKETCH_ID, TEXTBOX_DEFAULT_CONFIG } from '@/common/constants/globalConstants';
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
  const domBoxRef = useRef<any>();
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
  // 元素被点击
  const clickHandler = (opt: any) => {
    const { target } = opt;
    console.log(target);

    setActiveObject(target);
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
    if (!!selection) {
      setActiveObject(selection);
    }
  };
  // 框选选中
  const selectionHandler = (opt: any) => {
    const { selected, sketch } = opt;

    if (selected && selected.length) {
      const selection = editor.canvas?.getActiveObject();
      setActiveObject(selection);
    } else {
      // @ts-ignore
      setActiveObject(sketch);
    }
    onSelectionCleared(opt);
  };
  // 框选结组
  const groupHandler = () => {
    const selection = editor.canvas?.getActiveObject();
    setActiveObject(selection);
  };
  // 窗口大小改变，动态修改画布大小
  const resizeCanvas = () => {
    editor?.canvas?.setWidth?.(workspaceEl?.current?.offsetWidth);
    editor?.canvas?.setHeight?.(workspaceEl?.current?.offsetHeight);
  };
  // 初始化绑定事件
  const initEvent = () => {
    editor.canvas?.on({
      // 'selection:created': selectionHandler,
      // 'selection:updated': selectionHandler,
      'selection:cleared': selectionHandler,
      'mouse:down': clickHandler,
      'fabritor:group': groupHandler,
      'fabritor:ungroup': groupHandler,
      // 绑定贝塞尔曲线
      'object:selected': onObjectSelected,
      'object:moving': onObjectMoving,
    });
    window.addEventListener('resize', resizeCanvas);
  };
  const removeEvent = () => {
    editor.canvas?.off({
      // 'selection:created': selectionHandler,
      // 'selection:updated': selectionHandler,
      'selection:cleared': selectionHandler,
      'mouse:down': clickHandler,
      'fabritor:group': groupHandler,
      'fabritor:ungroup': groupHandler,
      // 绑定贝塞尔曲线
      'object:selected': onObjectSelected,
      'object:moving': onObjectMoving,
    });
    window.removeEventListener('resize', resizeCanvas);
  }
  // 曲线被选中
  function onObjectSelected(e: any) {
    var activeObject = e.target;
    if (activeObject.name == "p0" || activeObject.name == "p2") {
      activeObject.line2.animate('opacity', '1', {
        duration: 200,
        onChange: editor?.canvas?.renderAll.bind(editor?.canvas),
      });
      activeObject.line2.selectable = true;
    }
  };
  // 清理
  function onSelectionCleared(e: any) {
    var activeObject = e.target;
    if (!activeObject) return;
    console.log(activeObject);

    if (activeObject.name == "p0" || activeObject.name == "p2") {
      activeObject.line2.animate('opacity', '0', {
        duration: 200,
        onChange: editor?.canvas?.renderAll.bind(editor?.canvas),
      });
      activeObject.line2.selectable = false;
    }
    else if (activeObject.name == "p1") {
      activeObject.animate('opacity', '0', {
        duration: 200,
        onChange: editor?.canvas?.renderAll.bind(editor?.canvas),
      });
      activeObject.selectable = false;
    }
  };
  // 移动
  function onObjectMoving(e: any) {
    if (e.target.name == "p0" || e.target.name == "p2") {
      var p = e.target;
      if (p.line1) {
        p.line1.path[0][1] = p.left;
        p.line1.path[0][2] = p.top;
      }
      else if (p.line3) {
        p.line3.path[1][3] = p.left;
        p.line3.path[1][4] = p.top;
      }
    }
    else if (e.target.name == "p1") {
      var p = e.target;
      if (p.line2) {
        p.line2.path[1][1] = p.left;
        p.line2.path[1][2] = p.top;
      }
    }
    else if (e.target.name == "p0" || e.target.name == "p2") {
      var p = e.target;
      p.line1 && p.line1.set({ 'x2': p.left, 'y2': p.top });
      p.line2 && p.line2.set({ 'x1': p.left, 'y1': p.top });
      p.line3 && p.line3.set({ 'x1': p.left, 'y1': p.top });
      p.line4 && p.line4.set({ 'x1': p.left, 'y1': p.top });
    }
  };
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
    _editor.canvas.selectionBorderColor = "transparent" // 画布鼠标框选时的边框颜色
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
        clipPath: {
          ...json.clipPath,
          left: 0,
          top: 0,
          scaleX: 1,
          scaleY: 1,
          ...!!domBoxRef.current?.clientHeight ? {
            height: domBoxRef.current?.clientHeight,
            width: domBoxRef.current?.clientWidth,
          } : {}
        },
        objects: (json.objects || [])
          ?.map((item: any) => {
            return Object.assign({}, item,
              ((item?.type === 'path' && item?.path?.length <= 3) || item?.sub_type === 'image') ? {
                hasControls: false,
              } : {}
            )
          })
      });
      await _editor.loadFromJSON(string).then(() => {
        _editor.canvas?.discardActiveObject?.();
      });

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
    const text = await createTextbox({ ...options, canvas: editor.canvas });
    return text;
  }
  // 根据返回的数据渲染图片
  const addImage = async (options: any) => {
    await createFImage({
      ...options,
      canvas: editor.canvas
    });
  }
  // 批量load图形
  const loadShapes = async (jsonString: any) => {
    await editor.loadFromJSON(jsonString);
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
        const canvasWidth = editor.canvas?.width;
        // 渲染之前，先把前一次算法结果删除
        const json = editor.canvas?.getObjects();
        json?.forEach((item: any) => {
          if (
            item?.sub_type?.indexOf('outer_point') > -1
            || item?.sub_type?.indexOf('line_result') > -1
            || item?.sub_type?.indexOf('image_result') > -1
            // || (item?.sub_type?.indexOf('average') > -1 && item?.sub_type?.indexOf('average_half_') < 0)
          ) {
            removeObject(item, editor.canvas);
          }
        });
        let pointFormatList: any = [];
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
            const ID = i.sub_type;
            const points = [result.x1, result.y1, result.x2, result.y2];
            const params = {
              left: Math.min(result.x1, result.x2),
              top: Math.min(result.y1, result.y2),
              stroke: '#0f0',
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
            };
            // @ts-ignore
            // const line = new fabric.FLine(points, {
            //   strokeLineJoin: 'round',
            //   strokeLineCap: 'round',
            //   borderColor: '#00000000',
            //   ...params
            // });
            if (result.value) {
              result.x1 = i.x1;
              result.y1 = i.y1;
              result.x2 = i.x2;
              result.y2 = i.y2;
              const x = (result.x1 + result.x2) / 2 > canvasWidth / 2 ?
                Math.max(result.x1, result.x2) + 200
                :
                Math.min(result.x1, result.x2) - 200;
              // @ts-ignore
              const dashLine = new fabric.FLine([
                x, (result.y1 + result.y2) / 2,
                (result.x1 + result.x2) / 2, (result.y1 + result.y2) / 2
              ], {
                strokeLineJoin: 'round',
                strokeLineCap: 'round',
                borderColor: '#00000000',
                left: Math.min(x, (result.x1 + result.x2) / 2),
                top: (result.y1 + result.y2) / 2,
                stroke: '#0f0',
                strokeWidth: 2,
                strokeDashArray: [8, 8],
                canvas: editor.canvas,
                selectable: false,
                hasControls: false,
                sub_type: `line_result-${ID}`
              });
              // @ts-ignore
              const text = new fabric.FText(result.value?.toFixed(2), {
                ...TEXTBOX_DEFAULT_CONFIG,
                lineHeight: 1.1,
                fontSize: 24,
                pathAlign: 'center',
                id: guid(),
                top: (result.y1 + result.y2) / 2 - 13,
                left: x - ((result.x1 + result.x2) / 2 > canvasWidth / 2 ? 0 : (result.value?.toFixed(2) + '')?.length * 16),
                backgroundColor: result.type === 1 ? '#b8831b' : result.type === 2 ? '#f00' : '#0f0',
                fill: '#fff',
                width: (result.value?.toFixed(2) + '')?.length * 16,
                selectable: false,
                hasControls: false,
                sub_type: `line_result-${ID}`
              });
              try {
                const groupType = {
                  sub_type: `line_result-${ID}`,
                  caliperRule: Object.keys(CALIPER_RULE_FORMAT)?.reduce((pre: any, cen: any) => {
                    return Object.assign({}, pre, {
                      [cen]: i[cen]
                    });
                  }, { name: i.name })
                };
                const group = new fabric.Group([
                  // line,
                  text, dashLine], {
                  type: 'group',
                  angle: 0,
                  selectable: false,
                  hasControls: false,
                  ...groupType
                });
                editor.canvas?.add?.(group);
              } catch (err) { }
            }
          } else if (i.type === 'point') {
            pointFormatList.push({
              ...shapeFormat['point'],
              left: i.x,
              top: i.y,
            });
            // drawLine({
            //   points: [i.x, i.y, i.x + 1, i.y + 1],
            //   left: i.x,
            //   top: i.y,
            //   stroke: '#0f0',
            //   strokeWidth: 2,
            //   canvas: editor.canvas,
            //   selectable: false,
            //   hasControls: false,
            //   mark_type: type,
            //   sub_type: 'outer_point'
            // });
          } else if (i.type === 'rect') {
            const rectParams = {
              sub_type: 'rect_result',
            }
            const rect = new fabric.Rect({
              top: i.top,
              left: i.left,
              width: i.width,
              height: i.height,
              fill: 'transparent',
              strokeWidth: 1,
              strokeDashArray: [8, 8],
              stroke: "#0f0",
              ...rectParams
            });
            editor.canvas?.add?.(rect);
          } else if (i.type === 'circle') {
            const circleParams = {
              sub_type: 'circle_result',
            }
            const circle = new fabric.Circle({
              cornerColor: "white",
              cornerSize: 4,
              transparentCorners: false,
              cornerStrokeColor: 'gray',
              fill: 'green',
              top: i.top,
              left: i.left,
              radius: i.radius || 4,
              ...circleParams,
            });
            editor.canvas?.add?.(circle);
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
        console.log(pointFormatList);
        // const json1 = editor.canvas2Json();
        // loadShapes(JSON.stringify({
        //   ...json1,
        //   objects: (json1.objects || []).concat(pointFormatList)
        // }));
        editor.canvas?.discardActiveObject?.();
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
            <Content style={contentStyle} ref={domBoxRef}>
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


const shapeFormat = {
  point: {
    "type": "circle",
    "version": "5.3.0",
    "originX": "left",
    "originY": "top",
    "left": 10,
    "top": 10,
    "width": 2,
    "height": 2,
    "fill": "#0f0",
    "stroke": "#0f0",
    "strokeWidth": 1,
    "strokeDashArray": null,
    "strokeLineCap": "round",
    "strokeDashOffset": 0,
    "strokeLineJoin": "round",
    "strokeUniform": true,
    "strokeMiterLimit": 1,
    "scaleX": 1,
    "scaleY": 1,
    "angle": 0,
    "flipX": false,
    "flipY": false,
    "opacity": 1,
    "shadow": null,
    "visible": true,
    "backgroundColor": "",
    "fillRule": "nonzero",
    "paintFirst": "stroke",
    "globalCompositeOperation": "source-over",
    "skewX": 0,
    "skewY": 0,
    "radius": 1,
    "startAngle": 0,
    "endAngle": 360,
    "id": "7a99af53",
    "selectable": true,
    "hasControls": false,
    "sub_type": "point"
  },
  circle: {
    "type": "circle",
    "version": "5.3.0",
    "originX": "left",
    "originY": "top",
    "left": 10,
    "top": 10,
    "width": 20,
    "height": 20,
    "fill": "",
    "stroke": "#0f0",
    "strokeWidth": 4,
    "strokeDashArray": null,
    "strokeLineCap": "round",
    "strokeDashOffset": 0,
    "strokeLineJoin": "round",
    "strokeUniform": true,
    "strokeMiterLimit": 4,
    "scaleX": 4.17,
    "scaleY": 4.17,
    "angle": 0,
    "flipX": false,
    "flipY": false,
    "opacity": 1,
    "shadow": null,
    "visible": true,
    "backgroundColor": "",
    "fillRule": "nonzero",
    "paintFirst": "stroke",
    "globalCompositeOperation": "source-over",
    "skewX": 0,
    "skewY": 0,
    "radius": 10,
    "startAngle": 0,
    "endAngle": 360,
    "id": "2b9c0408",
    "selectable": true,
    "hasControls": true,
    "sub_type": "circle"
  },
  rect: {
    "type": "path",
    "version": "5.3.0",
    "originX": "left",
    "originY": "top",
    "left": 10,
    "top": 10,
    "width": 36,
    "height": 36,
    "fill": "",
    "stroke": "#0f0",
    "strokeWidth": 4,
    "strokeDashArray": null,
    "strokeLineCap": "round",
    "strokeDashOffset": 0,
    "strokeLineJoin": "round",
    "strokeUniform": true,
    "strokeMiterLimit": 4,
    "scaleX": 4.17,
    "scaleY": 4.17,
    "angle": 0,
    "flipX": false,
    "flipY": false,
    "opacity": 1,
    "shadow": null,
    "visible": true,
    "backgroundColor": "",
    "fillRule": "nonzero",
    "paintFirst": "stroke",
    "globalCompositeOperation": "source-over",
    "skewX": 0,
    "skewY": 0,
    "id": "f88e0498",
    "selectable": true,
    "hasControls": true,
    "sub_type": "rect",
    "path": [
      [
        "M",
        42,
        6
      ],
      [
        "L",
        6,
        6
      ],
      [
        "L",
        6,
        42
      ],
      [
        "L",
        42,
        42
      ],
      [
        "L",
        42,
        6
      ],
      [
        "Z"
      ]
    ]
  }
}