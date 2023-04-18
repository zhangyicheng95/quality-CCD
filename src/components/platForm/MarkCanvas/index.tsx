import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Button, Form, message, Popover, Select, Spin } from 'antd';
import Icon, {
  AimOutlined, BorderOutlined, DownloadOutlined, DragOutlined, HighlightOutlined, MinusCircleOutlined,
  PictureOutlined, PlusCircleOutlined, StockOutlined
} from "@ant-design/icons";
// @ts-ignore
import { saveAs } from "file-saver";
import html2canvas from 'html2canvas';
import * as _ from "lodash";
import styles from "./index.less";
import markIcon from '@/assets/imgs/marker.png';
import deleteIcon from '@/assets/imgs/delete.png';
import { BASE_IP } from "@/services/api";
import { FormatWidgetToDom } from "@/pages/control";
import { downFileFun, guid, } from "@/utils/utils";
import Measurement from "@/components/Measurement";
import useEyeDropper from "@/hooks/useEyeDropper";

interface Props {
  data?: any;
  setGetDataFun?: any;
  getDataFun?: any;
}
const AILabel = require('ailabel');
const CONTAINER_ID = 'mark-canvas';
// let timer: NodeJS.Timeout | null = null;
let img: any = null;
let gMap: any | null = null;
let gFirstTextLayer: any | null = null;
let gFirstFeatureLayer: any | null = null;
let gFirstMaskLayer: any | null = null;
let gFirstImageLayer: any | null = null;
let drawingStyle: any = { strokeStyle: '#F00' }; // 绘制过程中样式

const MarkCanvas: React.FC<Props> = (props: any) => {
  const [form] = Form.useForm();
  const { validateFields, resetFields } = form;
  const { data, setGetDataFun, getDataFun } = props;
  const { platFormValue, localPath, zoom, widget } = data;
  const { options } = widget;
  const [{ color }, open] = useEyeDropper();
  const markRef = useRef<any>();
  const [loading, setLoading] = useState(false);
  const [selectedBtn, setSelectedBtn] = useState('RECT');
  const [featureList, setFeatureList] = useState({});
  const [selectedFeature, setSelectedFeature] = useState('');
  const [selectedOptionType, setSelectedOptionType] = useState({});

  useEffect(() => {
    // const dom: any = document.getElementById(CONTAINER_ID);
    // const width = dom?.clientWidth,
    // height = dom?.clientHeight;
    img = new Image();
    img.src = localPath?.indexOf('http') === 0 ? localPath : `${BASE_IP}file${(localPath?.indexOf('\\') === 0 || localPath?.indexOf('/') === 0) ? '' : '\\'}${localPath}`;
    img.title = 'img.png';
    img.onload = (res: any) => {
      const { width = 1, height = 1 } = img;
      // img.width = width;
      // img.height = height;
      gMap && gMap.destroy();
      // 声明容器
      gMap = new AILabel.Map(CONTAINER_ID, {
        // size: { width: dom?.clientWidth, height: dom?.clientHeight },
        center: { x: width / 2, y: height / 2 },
        zoom: zoom ? zoom : height * 3.5,
        mode: 'RECT', // 绘制线段
        refreshDelayWhenZooming: true, // 缩放时是否允许刷新延时，性能更优

        zoomWhenDrawing: true,
        zoomWheelRatio: 8, // 控制滑轮缩放缩率[0, 10), 值越小，则缩放越快，反之越慢
        withHotKeys: true // 关闭快捷键
      });
      // 不同的标记功能
      gMap.events.on('drawDone', (type: any, data: any) => {
        console.log('--type, data--', type, data, gMap.zoom);
        if (
          Math.min(data.x, data.y) < 0 ||
          (data.x + data.width) > width ||
          (data.y + data.height) > height ||
          Math.min(data?.start?.x, data?.end?.y) < 0 ||
          data?.start?.x > width ||
          data?.start?.y > height ||
          data?.end?.x > width ||
          data?.end?.y > height
        ) {
          message.warning('标注位置 不能超出图片范围！');
          return;
        }
        setGetDataFun((prev: any) => ({ ...prev, zoom: gMap.zoom }));
        const relatedTextId = `label-text-id-${+new Date()}`;
        const relatedDeleteMarkerId = `label-marker-id-${+new Date()}`;
        if (type === 'MARKER') {
          const marker = new AILabel.Marker(
            `${+new Date()}`, // id
            {
              src: markIcon,
              position: data,
              offset: {
                x: -16,
                y: 32
              }
            }, // markerInfo
            { name: 'marker注记' } // props
          );
          marker.events.on('dragEnd', (marker: any, newPosition: any) => {
            console.log('marker dragEnd');
            marker.updatePosition(newPosition);
          });
          marker.events.on('rightClick', (marker: any) => {
            console.log('marker click');
            gMap.markerLayer.removeMarkerById(marker.id);
          });
          marker.enableDragging();
          gMap.markerLayer.addMarker(marker);
        } else if (type === 'POINT') {
          const pointFeature = new AILabel.Feature.Point(
            `${+new Date()}`, // id
            { ...data, sr: 3 }, // shape
            { name: '点状矢量图层', textId: relatedTextId, deleteMarkerId: relatedDeleteMarkerId, label: '瑕疵' }, // props
            drawingStyle // style
          );
          gFirstFeatureLayer.addFeature(pointFeature);
          addFeatureText(data, relatedTextId, '瑕疵');
        } else if (type === 'LINE') {
          const scale = gMap.getScale();
          const width = drawingStyle.lineWidth / scale;
          const lineFeature = new AILabel.Feature.Line(
            `${+new Date()}`, // id
            { ...data, width }, // shape
            { name: '线段矢量图层', textId: relatedTextId, deleteMarkerId: relatedDeleteMarkerId }, // props
            drawingStyle // style
          );
          gFirstFeatureLayer.addFeature(lineFeature);
          const { start, end } = data;
          let position = { x: 0, y: 0 };
          if (start.y <= end.y) {
            position = { x: start.x, y: start.y - 2 };
          } else {
            position = { x: end.x, y: end.y - 2 };
          }
          addFeatureText(position, relatedTextId, 'label');
        } else if (type === 'POLYLINE') {
          const scale = gMap.getScale();
          const width = drawingStyle.lineWidth / scale;
          const polylineFeature = new AILabel.Feature.Polyline(
            `${+new Date()}`, // id
            { points: data, width }, // shape
            { name: '多线段矢量图层', textId: relatedTextId, deleteMarkerId: relatedDeleteMarkerId }, // props
            drawingStyle // style
          );
          gFirstFeatureLayer.addFeature(polylineFeature);
        } else if (type === 'CIRCLE') {
          // data 代表r半径shape；data1代表sr半径shape
          const circleFeature = new AILabel.Feature.Circle(
            `${+new Date()}`, // id
            data, // data1代表屏幕坐标 shape
            { name: '圆形矢量图层', textId: relatedTextId, deleteMarkerId: relatedDeleteMarkerId, label: 'label' }, // props 
            drawingStyle // style
          );
          gFirstFeatureLayer.addFeature(circleFeature);
          addFeatureText({ x: data.cx - data.r, y: data.cy - data.r }, relatedTextId, 'label');
        } else if (type === 'RECT') {
          const rectFeature = new AILabel.Feature.Rect(
            `${+new Date()}`, // id
            data, // shape
            { name: '矩形矢量图形', textId: relatedTextId, deleteMarkerId: relatedDeleteMarkerId, label: 'label' }, // props
            drawingStyle // style
          );
          gFirstFeatureLayer.addFeature(rectFeature);
          addFeatureText(data, relatedTextId, 'label');
        } else if (type === 'POLYGON') {
          let xList: any = [],
            yList: any = [];
          data?.forEach((item: any) => {
            xList.push(item.x);
            yList.push(item.y);
          })
          const polygonFeature = new AILabel.Feature.Polygon(
            `${+new Date()}`, // id
            { points: data, location: { x: _.min(xList), y: _.min(yList) } }, // shape
            { name: '多边形矢量图形', textId: relatedTextId, deleteMarkerId: relatedDeleteMarkerId, label: 'label' }, // props
            drawingStyle // style
          );
          gFirstFeatureLayer.addFeature(polygonFeature);
          addFeatureText({ x: _.min(xList), y: _.min(yList) }, relatedTextId, '多边形');
        } else if (type === 'DRAWMASK') {
          const scale = gMap.getScale();
          const width = drawingStyle.lineWidth / scale;
          const drawMaskAction = new AILabel.Mask.Draw(
            `${+new Date()}`, // id
            '铅笔',
            { points: data, width }, // shape
            { name: '铅笔' }, // props
            drawingStyle, // style
          );
          gFirstMaskLayer.addAction(drawMaskAction);
        } else if (type === 'CLEARMASK') {
          const scale = gMap.getScale();
          const width = drawingStyle.lineWidth / scale;
          const clearMaskAction = new AILabel.Mask.Clear(
            `${+new Date()}`, // id
            { points: data, width }, // shape
            { name: '橡皮擦' },
            drawingStyle
          );
          gFirstMaskLayer.addAction(clearMaskAction);
        }
      });
      // 背景图拖动/缩放
      gMap.events.on('boundsChanged', (data: any) => {
        return 2222;
      });
      // 双击选中
      gMap.events.on('featureSelected', (feature: any) => {
        const { id, type, shape, props } = feature;

        if (type === 'LINE') {
          // 线段，把label显示为两点坐标
          let { start, end } = shape;
          start = {
            x: start.x.toFixed(2),
            y: start.y.toFixed(2)
          };
          end = {
            x: end.x.toFixed(2),
            y: end.y.toFixed(2)
          };
          // 线段长度
          const length = AILabel.Util.MathUtil.distance(start, end);
          const text = `(${start.x}, ${start.y}), (${end.x}, ${end.y}),  ${(length.toFixed(2))}`;
          const targetText = gFirstTextLayer.getTextById(props?.textId);
          if (targetText) {
            targetText?.updateText(text);
          } else {
            const { id, shape, props, style, type } = feature;
            gFirstFeatureLayer.removeFeatureById(id);
            gFirstTextLayer.removeTextById(props?.textId);
            addFeature(type, id, shape, { ...props, label: text }, style);
          }
        };

        setSelectedFeature(id);
        gMap.setActiveFeature(feature);
        const markerId = feature.props.deleteMarkerId;
        const textId = feature.props.textId;

        const mappedMarker = gMap.markerLayer.getMarkerById(markerId);
        if (mappedMarker) {
          return;
        }
        // 添加delete-icon
        const gFirstMarker = new AILabel.Marker(
          markerId, // id
          {
            src: deleteIcon,
            position: type === 'RECT' ? feature.getPoints()[1] :
              type === 'CIRCLE' ? { x: shape.cx + shape.r, y: shape.cy - shape.r } :
                type === 'POLYGON' ? shape.location :
                  type === 'LINE' ? shape.start :
                    type === 'POLYLINE' ? shape.points[0] :
                      type === 'POINT' ? shape : {},
            offset: {
              x: -20,
              y: -4
            }
          }, // markerInfo
          { name: 'marker注记' } // props
        );
        gFirstMarker.events.on('click', (marker: any) => {
          // 首先删除当前marker
          gMap.markerLayer.removeMarkerById(marker.id);
          // 删除对应text
          gFirstTextLayer.removeTextById(textId);
          // 删除对应feature
          gFirstFeatureLayer.removeFeatureById(feature.id);
        });

        gMap.markerLayer.addMarker(gFirstMarker);
      });
      // 取消featureSelected
      gMap.events.on('featureUnselected', (feature: any) => {
        const { props } = feature;
        gMap.setActiveFeature(null);
        const targetText = gFirstTextLayer.getTextById(props?.textId);
        targetText?.updateText(!!props?.initParams?.option_type ? props?.initParams?.option_type?.value : 'label');
        gMap.markerLayer.removeMarkerById(props.deleteMarkerId);
        onCancel();
      });
      // 圆形/矩形 框选更新
      gMap.events.on('featureUpdated', (feature: any, shape: any) => {
        const { id, type } = feature;
        feature.updateShape(shape);
        if (type === 'RECT') {
          setFeatureList((prev: any) => {
            return Object.entries(prev).reduce((pre: any, cen: any) => {
              const range = cen[1]?.['旋转角度']?.value;
              return Object.assign({}, pre, {
                [cen[0]]: Object.assign({}, cen[1], cen[0] === id ? {
                  roi: {
                    realValue: [90, 270].includes(range) ? {
                      // 矩形，有旋转
                      x: { alias: "cx", value: shape.x + shape.width / 2 },
                      y: { alias: "cy", value: shape.y + shape.height / 2 },
                      width: { alias: "width", value: shape.height },
                      height: { alias: "height", value: shape.width }
                    } : {
                      x: { alias: "cx", value: shape.x + shape.width / 2 },
                      y: { alias: "cy", value: shape.y + shape.height / 2 },
                      width: { alias: "width", value: shape.width },
                      height: { alias: "height", value: shape.height }
                    },
                    value: !!cen[1]?.roi?.value ?
                      Object.entries(cen[1]?.roi?.value).reduce((p: any, c: any) => {
                        return Object.assign({}, p, {
                          [c[0]]: { ...c[1], value: shape[c[0]] }
                        });
                      }, {})
                      :
                      Object.entries(shape).reduce((p: any, c: any) => {
                        return Object.assign({}, p, {
                          [c[0]]: { alias: c[0], value: c[1] }
                        });
                      }, {})
                  }
                } : {})
              });
            }, {});
          });
        }
        const markerId = feature.props.deleteMarkerId;
        const textId = feature.props.textId;
        // 更新marker位置
        const targetMarker = gMap.markerLayer.getMarkerById(markerId);
        const deleteMarkPosition = type === 'RECT' ? feature.getPoints()[1] :
          type === 'CIRCLE' ? { x: shape.cx + shape.r, y: shape.cy - shape.r } :
            type === 'POLYGON' ? shape.location :
              type === 'LINE' ? shape.start :
                type === 'POLYLINE' ? shape.points[0] :
                  type === 'POINT' ? shape : {};
        const textPosition = type === 'RECT' ? feature.getPoints()[0] :
          type === 'CIRCLE' ? { x: shape.cx - shape.r, y: shape.cy - shape.r } :
            type === 'POLYGON' ? shape.location :
              type === 'LINE' ? shape.start :
                type === 'POLYLINE' ? shape.points[0] :
                  type === 'POINT' ? shape : {};
        targetMarker.updatePosition(deleteMarkPosition);
        // 更新text位置
        const targetText = gFirstTextLayer.getTextById(textId);
        targetText?.updatePosition(textPosition);
      });
      gMap.events.on('featureDeleted', (feature: any) => {
        console.log('featureDeleted');
        const { id: featureId } = feature;
        gFirstFeatureLayer.removeFeatureById(featureId);
      });
      // 显示一张图片
      gFirstImageLayer = new AILabel.Layer.Image(
        'first-layer-image', // id
        {
          src: img.src,
          width: img.width,
          height: img.height,
          crossOrigin: false, // 图片是否跨域
          position: { // 图片左上角坐标
            x: 0,
            y: 0
          },
          // grid: { // 3 * 3
          //   columns: [{ color: '#9370DB' }, { color: '#9370DB' }, { color: '#9370DB' }],
          //   rows: [{ color: '#FF6347' }, { color: '#FF6347' },]
          // }
        }, // imageInfo
        { name: '图片图层' }, // props
        { zIndex: 5 } // style
      );
      // 图片层相关事件监听
      gFirstImageLayer.events.on('loadStart', (a: any, b: any) => {
        setLoading(true);
      });
      gFirstImageLayer.events.on('loadEnd', (a: any, b: any) => {
        // console.log(b.imageInfo);
        setLoading(false);
      });
      gFirstImageLayer.events.on('loadError', (a: any, b: any) => {
        message.error('图片加载失败');
        setLoading(false);
      });
      // 添加到gMap对象
      gMap.addLayer(gFirstImageLayer);
      // 用于添加涂层
      gFirstFeatureLayer = new AILabel.Layer.Feature(
        'first-layer-feature', // id
        { name: '矢量图层' }, // props
        { zIndex: 10 } // style
      );
      gMap.addLayer(gFirstFeatureLayer);
      // 用于添加铅笔涂层
      gFirstMaskLayer = new AILabel.Layer.Mask(
        'first-layer-mask', // id
        { name: '涂抹图层' }, // props
        { zIndex: 11, opacity: .5 } // style
      );
      gMap.addLayer(gFirstMaskLayer);
      // 用于添加text层
      gFirstTextLayer = new AILabel.Layer.Text(
        'first-layer-text', // id
        { name: '文本图层' }, // props
        { zIndex: 12, opacity: 1 } // style
      );
      gMap.addLayer(gFirstTextLayer);
      let obj = {};
      if (_.isArray(platFormValue)) {
        (platFormValue || [])?.forEach((plat: any) => {
          const { type, id, shape, props, style } = plat;
          obj = Object.assign({}, obj, {
            [id]: {
              roi: {
                realValue: {
                  x: { alias: "cx", value: shape.x + shape.width / 2 },
                  y: { alias: "cy", value: shape.y + shape.height / 2 },
                  width: { alias: "width", value: shape.width },
                  height: { alias: "height", value: shape.height }
                },
                value: {
                  x: { alias: "cx", value: shape.x },
                  y: { alias: "cy", value: shape.y },
                  width: { alias: "width", value: shape.width },
                  height: { alias: "height", value: shape.height }
                },
              }, ...(props?.initParams)
            },
          });
          addFeature(type, id, shape, props, style);
        });
        setFeatureList(obj);
      };
      setGetDataFun((prev: any) => {
        const feat = getFeatures;
        const pen = getRle;
        return {
          feat, pen, zoom: gMap.zoom,
          value: Object.assign({}, prev?.value, obj),
          gMap,
        };
      });

      window.addEventListener('resize', () => gMap && gMap.resize());
    }
    return () => {
      destroy();
    }
  }, [localPath, platFormValue]);
  // 添加text公共方法
  const addFeatureText = (data: any, relatedTextId: string, text: string) => {
    // 添加feature标签名
    const { x: ltx, y: lty, } = data;
    const gFirstText = new AILabel.Text(
      relatedTextId, // id
      { text, position: { x: ltx, y: lty }, offset: { x: 0, y: 0 } }, // shape, 左上角
      { name: '文本对象' }, // props
      {
        fillStyle: 'rgba(1,1,1,.9)',
        strokeStyle: '#D2691E',
        background: true,
        globalAlpha: 1,
        fontWeight: 3,
        fontColor: '#0f0'
      } // style
    );
    gFirstTextLayer.addText(gFirstText);
  };
  // 添加feature公共方法
  const addFeature = (type: any, id: any, shape: any, props: any, style: any) => {
    if (type === "LINE") {
      const gFirstFeatureLine = new AILabel.Feature.Line(
        id, shape, props, style
      );
      gFirstFeatureLayer.addFeature(gFirstFeatureLine);
      const { start, end } = shape;
      let position = { x: 0, y: 0 };
      if (start.y <= end.y) {
        position = { x: start.x, y: start.y - 2 };
      } else {
        position = { x: end.x, y: end.y - 2 };
      }
      addFeatureText(position, props.textId, props.label);
    } else if (type === "POLYLINE") {
      const polylineFeature = new AILabel.Feature.Polyline(
        id, shape, props, style
      );
      gFirstFeatureLayer.addFeature(polylineFeature);
    } else if (type === "RECT") {
      const gFirstFeatureRect = new AILabel.Feature.Rect(
        id, shape, props, style
      );
      gFirstFeatureLayer.addFeature(gFirstFeatureRect);
      addFeatureText(shape, props.textId, props.label);
    } else if (type === "POLYGON") {
      const gFirstFeaturePolygon = new AILabel.Feature.Polygon(
        id, shape, props, style
      );
      gFirstFeatureLayer.addFeature(gFirstFeaturePolygon);
    } else if (type === "CIRCLE") {
      const gFirstFeatureCircle = new AILabel.Feature.Circle(
        id, shape, props, style
      );
      gFirstFeatureLayer.addFeature(gFirstFeatureCircle);
      addFeatureText({ x: shape.cx - shape.r, y: shape.cy - shape.r }, props.textId, props.label);
    } else if (type === "POINT") {
      const polylineFeature = new AILabel.Feature.Point(
        id, shape, props, style
      );
      gFirstFeatureLayer.addFeature(polylineFeature);
      addFeatureText(shape, props.textId, props.label);
    } else {
      // const scale = gMap.getScale();
      // const width = drawingStyle.lineWidth / scale;
      // const drawMaskAction = new AILabel.Mask.Draw(
      //   `${+new Date()}`, // id
      //   { ...rest },
      // );
      // gFirstMaskLayer.addAction(drawMaskAction);
    }
  };
  // featureList更新
  useEffect(() => {
    setGetDataFun((prev: any) => {
      return {
        ...prev,
        value: Object.assign({}, prev?.value, featureList)
      };
    });
  }, [featureList]);
  function zoomIn() {
    gMap.zoomIn();
    setGetDataFun((prev: any) => ({
      ...prev, zoom: gMap.zoom
    }));
  }
  function zoomOut() {
    gMap.zoomOut();
    setGetDataFun((prev: any) => ({
      ...prev, zoom: gMap.zoom
    }));
  }
  function getRle() {
    const rleData = gFirstMaskLayer.getRleData({ x: 0, y: 0, width: 500, height: 354 });
    // console.log('--rleData--', rleData);
    return rleData;
  }
  function setMode(mode: any) {
    setSelectedBtn(mode);
    gMap.setMode(mode);
    // 后续对应模式处理
    switch (gMap.mode) {
      case 'PAN': {
        break;
      }
      case 'MARKER': {
        // 忽略
        break;
      }
      case 'POINT': {
        drawingStyle = { fillStyle: '#9370DB' };
        gMap.setDrawingStyle(drawingStyle);
        break;
      }
      case 'CIRCLE': {
        drawingStyle = { fillStyle: '#9370DB', strokeStyle: '#F00', lineWidth: 2 };
        gMap.setDrawingStyle(drawingStyle);
        break;
      }
      case 'LINE': {
        drawingStyle = { strokeStyle: '#F00', lineJoin: 'round', lineCap: 'round', lineWidth: 1, arrow: false };
        gMap.setDrawingStyle(drawingStyle);
        break;
      }
      case 'POLYLINE': {
        drawingStyle = { strokeStyle: '#F00', lineJoin: 'round', lineCap: 'round', lineWidth: 10 }
        gMap.setDrawingStyle(drawingStyle);
        break;
      }
      case 'RECT': {
        drawingStyle = { strokeStyle: '#F00', lineWidth: 1 }
        gMap.setDrawingStyle(drawingStyle);
        break;
      }
      case 'POLYGON': {
        drawingStyle = { strokeStyle: '#F00', fillStyle: '#0f0', globalAlpha: .3, lineWidth: 1, fill: true, stroke: true }
        gMap.setDrawingStyle(drawingStyle);
        break;
      }
      case 'DRAWMASK': {
        drawingStyle = { strokeStyle: 'rgba(255, 0, 0, .5)', fillStyle: '#00f', lineWidth: 20 }
        gMap.setDrawingStyle(drawingStyle);
        break;
      }
      case 'CLEARMASK': {
        drawingStyle = { fillStyle: '#00f', lineWidth: 30 }
        gMap.setDrawingStyle(drawingStyle);
        break;
      }
      default:
        break;
    }
  }
  // 选中的图层
  const feature = useMemo(() => {
    return gFirstFeatureLayer?.getFeatureById?.(selectedFeature);
  }, [gFirstFeatureLayer, selectedFeature]);

  // 导出数据
  const exportData = () => {
    const data1 = ((getFeatures().map((item: any) => _.omit(item, 'layer'))) || []).map((item: any) => {
      return Object.assign({}, item, {
        props: Object.assign({}, item?.props, {
          initParams: getDataFun?.value?.[item.id]
        }, !!getDataFun?.value?.[item.id]?.option_type ? {
          label: getDataFun?.value?.[item.id]?.option_type?.value
        } : {})
      })
    });
    const data2 = getRle() || [];
    const params = _.uniqBy(data1, 'id').concat(data2).map((item: any) => {
      const { props, shape, type, id } = item;
      const { initParams = {} } = props;
      const initValue = Object.entries(initParams)?.reduce((pre: any, cen: any) => {
        return Object.assign({}, pre, {
          [cen[0]]: cen[1]?.value,
        });
      }, {});
      if (type === 'RECT') {
        return {
          id,
          type: "RECT",
          roi: {
            cx: { alias: "cx", value: shape.x + shape.width / 2 },
            cy: { alias: "cy", value: shape.y + shape.height / 2 },
            width: { alias: "width", value: shape.width },
            height: { alias: "height", value: shape.height }
          },
          ...initValue
        }
      } else if (type === 'LINE') {
        return {
          id,
          type: "LINE",
          roi: shape,
          ...initValue
        }
      } else if (type === 'CIRCLE') {
        return {
          id,
          type: "CIRCLE",
          roi: shape,
          ...initValue
        }
      } else if (type === 'POINT') {
        return {
          id,
          type: "POINT",
          roi: shape,
          ...initValue
        }
      }
    });
    downFileFun(JSON.stringify(params), `${data?.nodeName}_ROI.json`);
  }

  // 导出图片上护具
  async function exportImage(type: any) {
    const shareContent: any = document.getElementById(CONTAINER_ID);
    const width = shareContent?.offsetWidth;
    const height = shareContent?.offsetHeight;
    const scale = 2 || window.devicePixelRatio; // 也可以使用设备像素比
    html2canvas(shareContent, {
      scale: scale,
      useCORS: true, // 是否尝试使⽤CORS从服务器加载图像
      allowTaint: false, // 是否允许跨域图像。会污染画布，导致⽆法使⽤canvas.toDataURL ⽅法
      width: width,
      height: height,
    }).then((canvas: any) => {
      saveAs(canvas.toDataURL('image/png', { quality: 1 }), 'export.png');
    });

    const imagedata = await gMap.exportLayersToImage(
      { x: 0, y: 0, width: 500, height: 354 },
      { type, format: 'image/png' }
    );
    const imageDom = new Image();
    if (type === 'base64') {
      // 导出base64格式
      imageDom.src = imagedata;
    } else {
      // 导出blob格式
      const url = URL.createObjectURL(imagedata);
      imageDom.src = url;
      imageDom.onload = () => { URL.revokeObjectURL(url); }
    }
    let aLink = document.createElement('a');
    aLink.style.display = 'none';
    aLink.href = imageDom.src;
    aLink.download = 'export.png';
    // 触发点击-然后移除
    document.body.appendChild(aLink);
    aLink.click();
    document.body.removeChild(aLink);
  }

  // 获取所有features
  function getFeatures() {
    const allFeatures = gFirstFeatureLayer.getAllFeatures();
    // console.log('--allFeatures--', allFeatures);
    return allFeatures;
  }

  // 实例销毁
  function destroy() {
    gMap && gMap.destroy();
    window.removeEventListener('resize', () => gMap && gMap.resize());
  }
  // 关闭
  const onCancel = () => {
    setSelectedFeature('');
    setSelectedOptionType({});
    resetFields();
  };

  return <div className={`${styles.markCanvas} flex-box`} ref={markRef}>
    {/* <div className="canvas-header flex-box-justify-end">
      <Button onClick={() => getFeatures()} style={{ marginRight: 10 }} >获取标注数据</Button>
      <Button onClick={() => getRle()} style={{ marginRight: 10 }} >获取rle数据</Button>
      <Button onClick={() => exportImage('blob')} style={{ marginRight: 10 }} >导出blob图片</Button>
    </div> */}
    <div className="canvas-body flex-box-start">
      <div className="btn-box">
        <div className="top background-ubv">
          <Popover placement="right" content={"拾色器"} >
            <HighlightOutlined
              onClick={() => { open() }}
              className={`img-icon flex-box-center ${selectedBtn === 'LINE' ? "selected" : ''}`}
            />
          </Popover>
          <StockOutlined
            onClick={() => { setMode('LINE') }}
            className={`img-icon flex-box-center ${selectedBtn === 'LINE' ? "selected" : ''}`}
          />
          {/* <Popover placement="right" content={lineMenu} style={{ padding: 0 }}>
            {
              selectedBtn === 'LINE' ?
                <img src={lineIcon} alt="line" className="selected" />
                :
                <img src={polyLineIcon} alt="poly-line" className={selectedBtn === 'POLYLINE' ? "selected" : ''} />
            }
          </Popover> */}
          <div className={`img-icon flex-box-center ${selectedBtn === 'CIRCLE' ? "selected" : ''}`}
            onClick={() => { setMode('CIRCLE') }}
          >
            <div className="img-icon-circle" />
          </div>
          <BorderOutlined
            className={`img-icon flex-box-center ${selectedBtn === 'RECT' ? "selected" : ''}`}
            onClick={() => setMode('RECT')}
          />
          {/* <Popover placement="right" content={rectMenu} >
            {
              selectedBtn === 'CIRCLE' ?
                <img src={circleIcon} alt="circle" className="selected" />
                :
                selectedBtn === 'RECT' ?
                  <img src={rectIcon} alt="RECT" className="selected" />
                  :
                  <img src={polygonIcon} alt="POLYGON" className={selectedBtn === 'POLYGON' ? "selected" : ''} />
            }
          </Popover> */}
          <AimOutlined
            className={`img-icon flex-box-center ${selectedBtn === 'POINT' ? "selected" : ''}`}
            onClick={() => setMode('POINT')}
          />
          {/* <Popover placement="right" content={"画笔"} >
            <img
              src={maskIcon}
              alt="mask"
              className={selectedBtn === 'DRAWMASK' ? "selected" : ''}
              onClick={() => setMode('DRAWMASK')}
            />
          </Popover> */}
        </div>
        <div className="center background-ubv">
          {/* <img src={clearIcon} alt="cursor-default" onClick={() => setMode('POINT')} /> */}
          {/* <Popover placement="right" content={"橡皮擦"} >
            <img
              src={clearMaskIcon}
              alt="mask"
              className={selectedBtn === 'CLEARMASK' ? "selected" : ''}
              onClick={() => setMode('CLEARMASK')}
            />
          </Popover> */}
          <Icon
            component={() => <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="983" width="200" height="200">
              <path d="M607.274667 612.992l88.661333 190.122667a21.333333 21.333333 0 0 1-10.325333 28.373333l-77.312 36.053333a21.333333 21.333333 0 0 1-28.373334-10.325333l-90.666666-194.474667-111.488 111.488A21.333333 21.333333 0 0 1 341.333333 759.168V218.88a21.333333 21.333333 0 0 1 35.669334-15.786667l397.056 360.96a21.333333 21.333333 0 0 1-12.714667 37.077334l-154.069333 11.861333z" fill="#000000" p-id="984">
              </path>
            </svg>
            }
            className={`img-icon flex-box-center ${selectedBtn === '' ? "selected" : ''}`}
            onClick={() => setMode('')}
          />
          <DragOutlined
            className={`img-icon flex-box-center ${selectedBtn === 'PAN' ? "selected" : ''}`}
            onClick={() => setMode('PAN')}
          />
        </div>
        <div className="bottom background-ubv" style={{ marginBottom: 0 }}>
          <PlusCircleOutlined
            className={`img-icon flex-box-center`}
            onClick={() => zoomIn()}
          />
          <MinusCircleOutlined
            className={`img-icon flex-box-center`}
            onClick={() => zoomOut()}
          />
          <Popover placement="right" content={"导出数据"} >
            <DownloadOutlined
              className={`img-icon flex-box-center`}
              onClick={() => exportData()}
            />
          </Popover>
        </div>
      </div>
      <Spin spinning={loading} tip="Loading...">
        <div className="rule-box background-ubv">
          <div className="rule rule1" />
          <div className="rule rule4" />
          <div className="canvas-box" id={CONTAINER_ID} />
        </div>
      </Spin>
      <div className="config-box background-ubv">
        {
          !!selectedFeature ?
            <Fragment>
              <div className="condif-body">
                <Form
                  form={form}
                  scrollToFirstError
                >
                  <Form.Item
                    name={`option_type`}
                    label="参数类型"
                    initialValue={featureList?.[selectedFeature] ? featureList?.[selectedFeature]?.['option_type']?.value : undefined}
                    rules={[{ required: true, message: "参数类型" }]}
                  >
                    <Select
                      style={{ width: '100%' }}
                      options={_.isObject(options) ? Object.entries(options)?.map((res: any) => {
                        return { label: res[0], value: res[0], };
                      }) : []}
                      placeholder="参数类型"
                      onChange={(val, option: any) => {
                        setSelectedOptionType({ roi: feature?.shape, ..._.cloneDeep(options)[val] });
                      }}
                    />
                  </Form.Item>
                  {
                    // feature?.type === 'RECT' ?
                    <Form.Item
                      name={`旋转角度`}
                      label="旋转角度"
                      initialValue={featureList?.[selectedFeature] ? featureList?.[selectedFeature]?.['旋转角度']?.value : 0}
                      rules={[{ required: true, message: "旋转角度" }]}
                    >
                      <Select
                        style={{ width: '100%' }}
                        options={[0, 90, 180, 270, 360].map((res: any) => {
                          return { label: res, value: res, };
                        })}
                        placeholder="旋转角度"
                      />
                    </Form.Item>
                    // :
                    // null
                  }
                  {
                    _.isEmpty(selectedOptionType) ?
                      (!!featureList[selectedFeature] ?
                        Object.entries(featureList[selectedFeature])?.map((item: any) => {
                          if (item[0] === '找线方向') return null;
                          if (item[0] === 'roi') {
                            let value = {};
                            if (_.isObject(item[1]?.realValue) && !_.isEmpty(item[1].realValue)) {
                              if (!!item[1]?.realValue?.x && !!item[1]?.realValue?.width) {
                                // 矩形
                                value = {
                                  ...item[1].realValue,
                                  x: {
                                    alias: "cx",
                                    value: item[1].realValue?.x?.value
                                  },
                                  y: {
                                    alias: "cy",
                                    value: item[1].realValue?.y?.value
                                  }
                                }
                              } else if (!!item[1]?.realValue?.x2) {
                                // 线
                                value = {
                                  "x1": { alias: "起点x", value: item[1]?.realValue?.x1?.value },
                                  "y1": { alias: "起点y", value: item[1]?.realValue?.y1?.value },
                                  "x2": { alias: "终点x", value: item[1]?.realValue?.x2?.value },
                                  "y2": { alias: "终点y", value: item[1]?.realValue?.y2?.value }
                                };
                              } else {
                                value = Object.entries(_.omit(item[1], "value")).reduce((pre: any, cen: any) => {
                                  return Object.assign({}, pre, {
                                    [cen[0]]: {
                                      alias: cen[0],
                                      value: cen[1]
                                    }
                                  });
                                }, {});
                              }
                            }
                            return <Form.Item
                              name={`${item[0]}$$${guid()}`}
                              label={"位置信息"}
                              initialValue={value || {
                                num_0: { alias: 'num_0', value: undefined },
                                num_1: { alias: 'num_1', value: undefined },
                                num_2: { alias: 'num_2', value: undefined },
                                num_3: { alias: 'num_3', value: undefined },
                              }}
                              rules={[{ required: true, message: "位置信息" }]}
                            >
                              <Measurement />
                            </Form.Item>
                          }
                          return <FormatWidgetToDom
                            key={item[0]}
                            id={item[0]}
                            label={item?.[1]?.alias || item[0]}
                            config={item}
                            form={form}
                            disabled={false}
                          />
                        })
                        : null)
                      :
                      Object.entries(selectedOptionType)?.map((item: any) => {
                        if (item[0] === '找线方向') return null;
                        if (item[0] === 'roi') {
                          let value = {};
                          if (!_.isEmpty(item[1])) {
                            if (!!item[1]?.x && !!item[1]?.width) {
                              // 矩形
                              value = {
                                x: {
                                  alias: "cx",
                                  value: item[1]?.x + item[1]?.width / 2
                                },
                                y: {
                                  alias: "cy",
                                  value: item[1]?.y + item[1]?.height / 2
                                },
                                width: {
                                  alias: "width",
                                  value: item[1]?.width
                                },
                                height: {
                                  alias: "height",
                                  value: item[1]?.height
                                }
                              }
                            } else if (!!item[1]?.start) {
                              // 线
                              value = {
                                "x1": { alias: "起点x", value: item[1]?.start?.x },
                                "y1": { alias: "起点y", value: item[1]?.start?.y },
                                "x2": { alias: "终点x", value: item[1]?.end?.x },
                                "y2": { alias: "终点y", value: item[1]?.end?.y }
                              };
                            } else {
                              value = Object.entries(_.omit(item[1], "value")).reduce((pre: any, cen: any) => {
                                return Object.assign({}, pre, {
                                  [cen[0]]: {
                                    alias: cen[0],
                                    value: cen[1]
                                  }
                                });
                              }, {});
                            }
                          }
                          return <Form.Item
                            name={`${item[0]}$$${guid()}`}
                            label={"位置信息"}
                            initialValue={value || {
                              num_0: { alias: 'num_0', value: undefined },
                              num_1: { alias: 'num_1', value: undefined },
                              num_2: { alias: 'num_2', value: undefined },
                              num_3: { alias: 'num_3', value: undefined },
                            }}
                            rules={[{ required: true, message: "位置信息" }]}
                          >
                            <Measurement />
                          </Form.Item>
                        }
                        return <FormatWidgetToDom
                          key={item[0]}
                          id={item[0]}
                          label={item?.[1]?.alias || item[0]}
                          config={item}
                          form={form}
                          disabled={false}
                        />
                      })
                  }
                </Form>

              </div>
              <div className="flex-box-center config-footer">
                <Button onClick={() => {
                  onCancel()
                }}>关闭</Button>
                <Button type="primary" onClick={() => {
                  validateFields()
                    .then((values) => {
                      const value = Object.entries(values).reduce((pre: any, cen: any) => {
                        const key = cen[0].split('$$');
                        const item = Object.assign({}, selectedOptionType[key[0]],
                          (key[0] === 'option_type' && _.isObject(cen[1])) ? cen[1] : { value: cen[1] }
                        );
                        return Object.assign({}, pre, {
                          [key[0]]: item
                        })
                      }, {});
                      // 更新text
                      const targetText = gFirstTextLayer.getTextById(feature?.props?.textId);
                      if (targetText) {
                        targetText?.updateText(value?.['option_type']?.value);
                      } else {
                        const { id, shape, props, style, type } = feature;
                        gFirstFeatureLayer.removeFeatureById(id);
                        gFirstTextLayer.removeTextById(props?.textId);
                        addFeature(type, id, shape, { ...props, label: value?.['option_type']?.value }, style);
                      }
                      // 
                      const range = value?.['旋转角度']?.value;
                      const result = {
                        ...featureList,
                        [selectedFeature]: Object.entries(!_.isEmpty(selectedOptionType) ? selectedOptionType : featureList[selectedFeature])
                          ?.reduce((pre: any, cen: any) => {
                            if (cen[0] === 'roi') {
                              let { value: val, } = value[cen[0]];
                              // realValue：没旋转的 中心点x,y
                              let realValue = val;

                              // 矩形
                              if (val?.x && val?.height) {
                                val = {
                                  ...val,
                                  x: { ...val?.x, value: val?.x?.value - val?.width?.value / 2 },
                                  y: { ...val?.y, value: val?.y?.value - val?.height?.value / 2 }
                                }
                                if ([90, 270].includes(range)) {
                                  // 有旋转
                                  val = {
                                    x: { ...val?.x, value: val?.x?.value + val?.width?.value / 2 - val?.height?.value / 2 },
                                    y: { ...val?.y, value: val?.y?.value - val?.width?.value / 2 + val?.height?.value / 2 },
                                    width: { ...val?.width, value: val?.height?.value },
                                    height: { ...val?.height, value: val?.width?.value }
                                  };
                                };
                                /****************通过roi更新图层******************/
                                const feature = gFirstFeatureLayer.getFeatureById(selectedFeature);
                                const shape = Object.entries(val).reduce((pre: any, cen: any) => {
                                  return Object.assign({}, pre, {
                                    [cen[0]]: cen[1]?.value
                                  });
                                }, {});
                                if (
                                  Math.min(shape?.x, shape?.y) < 0 ||
                                  (shape?.x + shape?.width) > img?.width ||
                                  (shape?.y + shape?.height) > img?.height
                                ) {
                                  message.warning('标注位置 不能超出图片范围！');
                                } else {
                                  feature.updateShape(shape);
                                  const targetText = gFirstTextLayer.getTextById(feature?.props?.textId);
                                  targetText?.updatePosition({ x: shape.x, y: shape.y });
                                  gMap.markerLayer.removeMarkerById(feature.props.deleteMarkerId);
                                }
                                /****************通过roi更新图层******************/
                              };

                              return Object.assign({}, pre, {
                                [cen[0]]: {
                                  // ...cen[1],
                                  value: val,
                                  realValue: realValue
                                }
                              });
                            };
                            return Object.assign({}, pre, {
                              [cen[0]]: {
                                ...cen[1],
                                value: value[cen[0]]?.value
                              }
                            })
                          }, { option_type: { value: value?.['option_type']?.value }, "旋转角度": { value: range } })
                      };
                      setGetDataFun((prev: any) => ({
                        ...prev, zoom: gMap.zoom, value: Object.assign({}, prev?.value, result)
                      }));
                      setFeatureList(result);
                      onCancel();
                    }).catch((err) => {
                      console.log(err)
                    });
                }}>保存</Button>
              </div>
            </Fragment>
            : null
        }
      </div>
    </div>
    <div className="canvas-footer flex-box-center">
      <div className="img-box" onClick={() => window.open(img?.src)}>
        <PictureOutlined style={{ marginRight: 8, color: 'rgb(60, 124, 255)' }} />
        {img && img?.title || 'img'}
      </div>
    </div>
  </div>;
};

export default MarkCanvas;
