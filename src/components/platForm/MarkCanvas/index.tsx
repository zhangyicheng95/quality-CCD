import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Button, Form, InputNumber, message, Popover, Select, Spin } from 'antd';
import Icon, {
  AimOutlined, BorderInnerOutlined, BorderOutlined, DownloadOutlined, DragOutlined, HighlightOutlined, MinusCircleOutlined,
  PictureOutlined, PlusCircleOutlined, StockOutlined
} from "@ant-design/icons";
// @ts-ignore
import { saveAs } from "file-saver";
import html2canvas from 'html2canvas';
import * as _ from "lodash";
import styles from "./index.less";
import markIcon from '@/assets/imgs/marker.png';
import deleteIcon from '@/assets/imgs/delete.png';
import directionTopIcon from '@/assets/imgs/direction-top.png';
import directionRightIcon from '@/assets/imgs/direction-right.png';
import directionBottomIcon from '@/assets/imgs/direction-bottom.png';
import directionLeftIcon from '@/assets/imgs/direction-left.png';
import { BASE_IP, btnFetch } from "@/services/api";
import { FormatWidgetToDom } from "@/pages/control";
import { downFileFun, getNewPoint, guid, rotatePoint, twoPointDistance, } from "@/utils/utils";
import Measurement from "@/components/Measurement";
import useEyeDropper from "@/hooks/useEyeDropper";

interface Props {
  data?: any;
  setGetDataFun?: any;
  getDataFun?: any;
  selectedFeature: any;
  setSelectedFeature: any;
}
const AILabel = require('ailabel');
const CONTAINER_ID = 'mark-canvas';

const arrowStyle = {
  fillStyle: 'transparent',
  strokeStyle: 'transparent',
  background: true,
  globalAlpha: 1,
  fontWeight: 10,
  fontColor: '#0f0'
};

const MarkCanvas: React.FC<Props> = (props: any) => {
  const [form] = Form.useForm();
  const { validateFields, setFieldsValue, resetFields } = form;
  const { data, setGetDataFun, getDataFun, selectedFeature, setSelectedFeature } = props;
  const {
    platFormValue, localPath, zoom, widget, ifFetch, fetchType, xName, fontSize,
    inHome
  } = data;

  const { options } = widget;
  const [{ color }, open] = useEyeDropper();
  const dom = useRef<any>();
  let img = useRef<any>(null);
  let gMap = useRef<any>(null);
  let gFirstFeatureLayer = useRef<any>(null);
  let gFirstImageLayer = useRef<any>(null);
  let gFirstTextLayer = useRef<any>(null);
  let gFirstMaskLayer = useRef<any>(null);
  let drawingStyle = useRef<any>({ strokeStyle: '#F00' }); // 绘制过程中样式

  const markRef = useRef<any>();
  const featureListRef = useRef<any>({});
  const ctrlDown = useRef(false);
  const [loading, setLoading] = useState(false);
  const [selectedBtn, setSelectedBtn] = useState('RECT');
  const [featureList, setFeatureList] = useState({});
  const [selectedOptionType, setSelectedOptionType] = useState({});
  const [features, setFeatures] = useState([]);

  const initDom = () => {
    img.current = new Image();
    if (process.env.NODE_ENV === 'development') {
      img.current.src = 'https://img95.699pic.com/xsj/0k/o5/ie.jpg%21/fw/700/watermark/url/L3hzai93YXRlcl9kZXRhaWwyLnBuZw/align/southeast';
    } else {
      img.current.src = `${localPath?.indexOf('http') === 0 ? localPath : `${BASE_IP}file${(localPath?.indexOf('\\') === 0 || localPath?.indexOf('/') === 0) ? '' : '\\'}${localPath}`}?__timestamp=${+new Date()}`;
    }
    img.current.title = 'img.png';
    img.current.onload = (res: any) => {
      const { width = 1, height = 1 } = img.current;
      const scale = !!zoom ? zoom : ((dom?.current?.clientWidth / dom?.current?.clientHeight) > (width / height)) ?
        height * (dom?.current?.clientWidth / dom?.current?.clientHeight)
        :
        Math.max(width, height);

      // img.current.width = width;
      // img.current.height = height;
      gMap.current && gMap.current.destroy();
      // 声明容器
      gMap.current = new AILabel.Map(CONTAINER_ID, {
        // size: { width: dom?.clientWidth, height: dom?.clientHeight },
        center: { x: width / 2, y: height / 2 },
        zoom: scale,
        mode: 'RECT', // 绘制线段
        refreshDelayWhenZooming: true, // 缩放时是否允许刷新延时，性能更优
        zoomWhenDrawing: true,
        zoomWheelRatio: 8, // 控制滑轮缩放缩率[0, 10), 值越小，则缩放越快，反之越慢
        withHotKeys: true // 关闭快捷键
      });
      // 不同的标记功能
      gMap.current.events.on('drawDone', (type: any, data: any) => {
        let btn = '';
        setSelectedBtn((prev: string) => {
          btn = prev;
          return prev;
        });
        // 判断有没有画出图形之外
        if (type === 'RECT') {
          if (
            Math.min(data.x, data.y) < 0 ||
            (data.x + data.width) > width ||
            (data.y + data.height) > height
          ) {
            message.warning('标注位置 不能超出图片范围！');
            return;
          }
        } else if (type === 'CIRCLE') {
          if (
            Math.min(data.cx - data.r, data.cy - data.r) < 0 ||
            (data.cx + data.r) > width ||
            (data.cy + data.r) > height
          ) {
            message.warning('标注位置 不能超出图片范围！');
            return;
          }
        } else if (type === 'LINE') {
          if (
            Math.min(data?.start?.x, data?.start?.y) < 0 ||
            Math.min(data?.end?.x, data?.end?.y) < 0 ||
            data?.start?.x > width ||
            data?.start?.y > height ||
            data?.end?.x > width ||
            data?.end?.y > height
          ) {
            message.warning('标注位置 不能超出图片范围！');
            return;
          }
        } else if (type === 'POINT') {
          if (
            Math.min(data.x, data.y) < 0 ||
            data.x > width ||
            data.y > height
          ) {
            message.warning('标注位置 不能超出图片范围！');
            return;
          }
        };
        setGetDataFun((prev: any) => ({ ...prev, zoom: gMap.current.zoom }));
        const relatedTextId = `label-text-id-${+new Date()}`;
        const relatedDeleteMarkerId = `label-marker-id-${+new Date()}`;
        const directionMarkerId = `label-direction-marker-id-${+new Date()}`;
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
            marker.updatePosition(newPosition);
          });
          marker.events.on('rightClick', (marker: any) => {
            gMap.current.markerLayer.removeMarkerById(marker.id);
          });
          marker.enableDragging();
          gMap.current.markerLayer.addMarker(marker);
        } else if (type === 'POINT') {
          const pointFeature = new AILabel.Feature.Point(
            `${+new Date()}`, // id
            { ...data, sr: 3 }, // shape
            { name: '点状矢量图层', textId: relatedTextId, deleteMarkerId: relatedDeleteMarkerId, label: inHome ? '' : 'label' }, // props
            drawingStyle.current // style
          );
          gFirstFeatureLayer.current.addFeature(pointFeature);
          addFeatureText({ x: data.x, y: data.y }, relatedTextId, inHome ? '' : 'label');
        } else if (type === 'LINE') {
          const scale = gMap.current.getScale();
          const width = drawingStyle.current.lineWidth / scale;
          const lineFeature = new AILabel.Feature.Line(
            `${+new Date()}`, // id
            { ...data, width }, // shape
            { name: '线段矢量图层', textId: relatedTextId, deleteMarkerId: relatedDeleteMarkerId }, // props
            drawingStyle.current // style
          );
          gFirstFeatureLayer.current.addFeature(lineFeature);
          const { start, end } = data;
          let position = { x: 0, y: 0 };
          if (start.y <= end.y) {
            position = { x: start.x, y: start.y - 2 };
          } else {
            position = { x: end.x, y: end.y - 2 };
          }
          addFeatureText(position, relatedTextId, inHome ? '' : 'label');
        } else if (type === 'POLYLINE') {
          const scale = gMap.current.getScale();
          const width = drawingStyle.current.lineWidth / scale;
          const polylineFeature = new AILabel.Feature.Polyline(
            `${+new Date()}`, // id
            { points: data, width }, // shape
            { name: '多线段矢量图层', textId: relatedTextId, deleteMarkerId: relatedDeleteMarkerId }, // props
            drawingStyle.current // style
          );
          gFirstFeatureLayer.current.addFeature(polylineFeature);
        } else if (type === 'CIRCLE') {
          const id = +new Date();
          // data 代表r半径shape；data1代表sr半径shape
          const circleFeature = new AILabel.Feature.Circle(
            id, // id
            data, // data1代表屏幕坐标 shape
            Object.assign({}, {
              name: '圆形矢量图层',
              textId: relatedTextId, deleteMarkerId: relatedDeleteMarkerId,
              label: inHome ? '' : 'label',
            }, ['DOUBLE_CIRCLE', 'double_circle'].includes(btn) ? { type: 'DOUBLE_CIRCLE', child: id + 100 } : {}), // props 
            drawingStyle.current // style
          );
          gFirstFeatureLayer.current.addFeature(circleFeature);
          addFeatureText({ x: data.cx - data.r, y: data.cy - data.r }, relatedTextId, inHome ? '' : 'label');

          // 是圆环，手动添加内环
          if (['DOUBLE_CIRCLE', 'double_circle'].includes(btn)) {
            const circleFeature = new AILabel.Feature.Circle(
              id + 100, // id
              { ...data, r: data.r / 2 }, // data1代表屏幕坐标 shape
              { name: '圆形矢量图层', deleteMarkerId: relatedDeleteMarkerId, type: 'DOUBLE_CIRCLE_CHILD', parent: id }, // props 
              drawingStyle.current // style
            );
            gFirstFeatureLayer.current.addFeature(circleFeature);
          }
        } else if (type === 'RECT') {
          const id = +new Date();
          if (['AXIS', 'axis'].includes(btn)) {
            // 坐标系
            const rectFeature = new AILabel.Feature.Rect(
              id, // id
              data, // shape
              {
                name: '矩形矢量图形',
                textId: relatedTextId,
                textXId: relatedTextId + 'x',
                textYId: relatedTextId + 'y',
                deleteMarkerId: relatedDeleteMarkerId,
                arrowXMarkerId: directionMarkerId + 'x',
                arrowYMarkerId: directionMarkerId + 'y',
                label: inHome ? '' : 'label',
                type: 'AXIS',
                initShape: data
              }, // props
              { ...drawingStyle.current, strokeStyle: '#0F0', lineWidth: 1 } // style
            );
            gFirstFeatureLayer.current.addFeature(rectFeature);
            // 横轴
            const line1 = {
              start: { x: data.x + data.width * 3 / 8, y: data.y + data.height / 2 },
              end: { x: data.x + data.width - data.width * 3 / 8, y: data.y + data.height / 2 }
            }
            // 纵轴
            const line2 = {
              start: { x: data.x + data.width / 2, y: data.y + data.height * 3 / 8 },
              end: { x: data.x + data.width / 2, y: data.y + data.height - data.height * 3 / 8 }
            }
            const scale = gMap.current.getScale();
            const width = drawingStyle.current.lineWidth / scale;
            const lineFeature1 = new AILabel.Feature.Line(
              id + 100, // id
              { ...line1, width }, // shape
              {
                name: 'x',
                textXId: relatedTextId + 'x',
                deleteMarkerId: relatedDeleteMarkerId,
                arrowXMarkerId: directionMarkerId + 'x',
                type: 'AXIS_CHILD'
              }, // props
              { ...drawingStyle.current, lineWidth: 1 } // style
            );
            gFirstFeatureLayer.current.addFeature(lineFeature1);
            const lineFeature2 = new AILabel.Feature.Line(
              id + 200, // id
              { ...line2, width }, // shape
              {
                name: 'y',
                textYId: relatedTextId + 'y',
                deleteMarkerId: relatedDeleteMarkerId,
                arrowYMarkerId: directionMarkerId + 'y',
                type: 'AXIS_CHILD'
              }, // props
              { ...drawingStyle.current, lineWidth: 1 } // style
            );
            gFirstFeatureLayer.current.addFeature(lineFeature2);
            addFeatureText(line1.end, relatedTextId + 'x', 'x', arrowStyle);
            addFeatureText(line2.start, relatedTextId + 'y', 'y', arrowStyle);
          } else {
            const rectFeature = new AILabel.Feature.Rect(
              id, // id
              data, // shape
              {
                name: '矩形矢量图形', textId: relatedTextId,
                deleteMarkerId: relatedDeleteMarkerId,
                directionMarkerId: directionMarkerId,
                label: inHome ? '' : 'label'
              }, // props
              drawingStyle.current // style
            );
            gFirstFeatureLayer.current.addFeature(rectFeature);
            // 添加direction-icon
            const gFirstMarker = new AILabel.Marker(
              directionMarkerId, // id
              {
                src: directionTopIcon,
                position: { x: data.x, y: data.y },
                offset: {
                  x: -20,
                  y: -4
                }
              }, // markerInfo
              { name: 'direction-icon注记' }, // props
            );
            gMap.current.markerLayer.addMarker(gFirstMarker);
            addFeatureText(data, relatedTextId, inHome ? '' : 'label');
          }
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
            { name: '多边形矢量图形', textId: relatedTextId, deleteMarkerId: relatedDeleteMarkerId, label: inHome ? '' : 'label' }, // props
            drawingStyle.current // style
          );
          gFirstFeatureLayer.current.addFeature(polygonFeature);
          addFeatureText({ x: _.min(xList), y: _.min(yList) }, relatedTextId, '多边形');
        } else if (type === 'DRAWMASK') {
          const scale = gMap.current.getScale();
          const width = drawingStyle.current.lineWidth / scale;
          const drawMaskAction = new AILabel.Mask.Draw(
            `${+new Date()}`, // id
            '铅笔',
            { points: data, width }, // shape
            { name: '铅笔' }, // props
            drawingStyle.current, // style
          );
          gFirstMaskLayer.current.addAction(drawMaskAction);
        } else if (type === 'CLEARMASK') {
          const scale = gMap.current.getScale();
          const width = drawingStyle.current.lineWidth / scale;
          const clearMaskAction = new AILabel.Mask.Clear(
            `${+new Date()}`, // id
            { points: data, width }, // shape
            { name: '橡皮擦' },
            drawingStyle.current
          );
          gFirstMaskLayer.current.addAction(clearMaskAction);
        }
        if (!ctrlDown.current && ['LINE', 'DOUBLE_CIRCLE', 'CIRCLE', 'RECT', 'POINT', 'AXIS'].includes(btn)) {
          setMode('');
        }
      });
      // 背景图拖动/缩放
      gMap.current.events.on('boundsChanged', (data: any) => {
        return 2222;
      });
      // 双击选中
      gMap.current.events.on('featureSelected', (feature: any) => {
        setSelectedFeature((prev: number) => {
          if (!!prev) {
            message.warning("请先保存设置框");
            return prev;
          }
          const { id, type, shape, props } = feature;
          gMap.current.setActiveFeature(feature);
          const markerId = feature.props.deleteMarkerId;
          const directionMarkerId = feature.props.directionMarkerId;
          const textId = feature.props.textId;

          const mappedMarker = gMap.current.markerLayer.getMarkerById(markerId);
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
            gMap.current.markerLayer.removeMarkerById(marker.id);
            gMap.current.markerLayer.removeMarkerById(directionMarkerId);
            // 删除对应text
            gFirstTextLayer.current.removeTextById(textId);
            // 删除对应feature
            gFirstFeatureLayer.current.removeFeatureById(feature.id);

            if (['DOUBLE_CIRCLE'].includes(props.type)) {
              gFirstFeatureLayer.current.removeFeatureById(feature.id + 100);
            } else if (['AXIS'].includes(props.type)) {
              gFirstFeatureLayer.current.removeFeatureById(feature.id + 100);
              gFirstFeatureLayer.current.removeFeatureById(feature.id + 200);
              gFirstTextLayer.current.removeTextById(props.textXId);
              gFirstTextLayer.current.removeTextById(props.textYId);
            }
            setSelectedFeature(0);
          });

          gMap.current.markerLayer.addMarker(gFirstMarker);
          return id;
        });
      });
      // 取消featureSelected
      gMap.current.events.on('featureUnselected', (feature: any) => {
        const { type, props, shape } = feature;
        gMap.current.setActiveFeature(null);
        const textPosition = type === 'RECT' ? feature.getPoints()[0] :
          type === 'CIRCLE' ? { x: shape.cx - shape.r, y: shape.cy - shape.r } :
            type === 'POLYGON' ? shape.location :
              type === 'LINE' ? shape.start :
                type === 'POLYLINE' ? shape.points[0] :
                  type === 'POINT' ? shape : {};
        const targetText = gFirstTextLayer.current.getTextById(props?.textId);
        targetText?.updatePosition(textPosition);
        gMap.current.markerLayer.removeMarkerById(props.deleteMarkerId);
        onCancel();
      });
      // 圆形/矩形 框选更新
      gMap.current.events.on('featureUpdated', (feature: any, shape: any) => {
        const { id, props, style, type } = feature;
        const data = Object.assign({}, shape);
        // 判断有没有画出图形之外
        if (type === 'RECT') {
          if (
            Math.min(data.x, data.y) < 0 ||
            (data.x + data.width) > width ||
            (data.y + data.height) > height
          ) {
            message.warning('标注位置 不能超出图片范围！');
            return;
          }
        } else if (type === 'CIRCLE') {
          if (
            Math.min(data.cx - data.r, data.cy - data.r) < 0 ||
            (data.cx + data.r) > width ||
            (data.cy + data.r) > height
          ) {
            message.warning('标注位置 不能超出图片范围！');
            return;
          }
        } else if (type === 'LINE') {
          if (
            Math.min(data?.start?.x, data?.start?.y) < 0 ||
            Math.min(data?.end?.x, data?.end?.y) < 0 ||
            data?.start?.x > width ||
            data?.start?.y > height ||
            data?.end?.x > width ||
            data?.end?.y > height
          ) {
            message.warning('标注位置 不能超出图片范围！');
            return;
          }
        } else if (type === 'POINT') {
          if (
            Math.min(data.x, data.y) < 0 ||
            data.x > width ||
            data.y > height
          ) {
            message.warning('标注位置 不能超出图片范围！');
            return;
          }
        }

        feature.updateShape(shape);
        if (type === 'RECT') {
          setFeatureList((prev: any) => {
            return Object.entries(prev).reduce((pre: any, cen: any) => {
              const range = cen[1]?.['找线方向']?.value;
              return Object.assign({}, pre, {
                [cen[0]]: Object.assign({}, cen[1], cen[0] + '' === id + '' ? {
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
        } else {
          setFeatureList((prev: any) => {
            return {
              ...prev,
              [id]: {
                ...prev?.[id],
                roi: {
                  realValue: Object.entries(shape).reduce((p: any, c: any) => {
                    return Object.assign({}, p, {
                      [c[0]]: { alias: c[0], value: c[1] }
                    });
                  }, {}),
                  value: Object.entries(shape).reduce((p: any, c: any) => {
                    return Object.assign({}, p, {
                      [c[0]]: { alias: c[0], value: c[1] }
                    });
                  }, {})
                },
              },
            }
          });
        }
        if (props.type === 'DOUBLE_CIRCLE') {
          const feature2 = gFirstFeatureLayer.current.getFeatureById(id + 100) || gFirstFeatureLayer.current.getFeatureById(id - 100);
          const shape2 = {
            ...shape,
            r: feature2?.shape?.r,
          };
          feature2?.updateShape(shape2);
        }
        if (props.type === 'AXIS') {
          {
            /********** 先还原到旋转角度为0 *********/
            const feature1 = gFirstFeatureLayer.current.getFeatureById(feature.id + 100);
            const feature2 = gFirstFeatureLayer.current.getFeatureById(feature.id + 200);
            // 横轴
            const initLine1 = {
              start: { x: data.x + data.width * 3 / 8, y: data.y + data.height / 2 },
              end: { x: data.x + data.width - data.width * 3 / 8, y: data.y + data.height / 2 }
            };
            // 纵轴
            const initLine2 = {
              start: { x: data.x + data.width / 2, y: data.y + data.height * 3 / 8 },
              end: { x: data.x + data.width / 2, y: data.y + data.height - data.height * 3 / 8 }
            };
            feature1?.updateShape(initLine1);
            feature2?.updateShape(initLine2);
            /********** 先还原到旋转角度为0 *********/
          }
          const feature1 = gFirstFeatureLayer.current.getFeatureById(feature.id + 100);
          const feature2 = gFirstFeatureLayer.current.getFeatureById(feature.id + 200);
          const center: any = {
            x: shape?.x + shape?.width / 2,
            y: shape?.y + shape?.height / 2,
            xLength: twoPointDistance(feature1.shape.start, feature1.shape.end),
            yLength: twoPointDistance(feature2.shape.start, feature2.shape.end),
          };
          const range = style?.direction || 0;
          let line1: any = {},
            line2: any = {};
          line1 = {
            start: getNewPoint(center, range - 180, center.xLength / 2),
            end: getNewPoint(center, range, center.xLength / 2)
          };
          line2 = {
            start: getNewPoint(center, (range - 90), center.yLength / 2),
            end: getNewPoint(center, (range - 90) - 180, center.yLength / 2)
          };
          feature1?.updateShape?.(line1);
          feature2?.updateShape?.(line2);
          // 把位置信息更新到form
          setFieldsValue({
            roi: {
              'x': { alias: '原点x', value: center.x },
              'y': { alias: '原点y', value: center.y },
              // ...feature?.props?.initParams?.roi?.realValue,
              'xLength': { alias: 'x轴长度', value: shape?.width },
              'yLength': { alias: 'y轴长度', value: shape?.height }
            }
          });
          const position1 = line1.end;
          const position2 = line2.start;
          const targetXText = gFirstTextLayer.current.getTextById(props?.textXId);
          targetXText?.updatePosition?.(position1);
          const targetYText = gFirstTextLayer.current.getTextById(props?.textYId);
          targetYText?.updatePosition?.(position2);
        }

        const markerId = feature.props.deleteMarkerId;
        const directionId = feature.props.directionMarkerId;
        const textId = feature.props.textId;
        // 更新marker位置
        const targetMarker = gMap.current.markerLayer.getMarkerById(markerId);
        const directionMarker = gMap.current.markerLayer.getMarkerById(directionId);
        const deleteMarkPosition = type === 'RECT' ? feature.getPoints()[1] :
          type === 'CIRCLE' ? { x: shape.cx + shape.r, y: shape.cy - shape.r } :
            type === 'POLYGON' ? shape.location :
              type === 'LINE' ? shape.start :
                type === 'POLYLINE' ? shape.points[0] :
                  type === 'POINT' ? shape : {};
        targetMarker?.updatePosition?.(deleteMarkPosition);
        // 更新text位置
        const textPosition = type === 'RECT' ? feature.getPoints()[0] :
          type === 'CIRCLE' ? { x: shape.cx - shape.r, y: shape.cy - shape.r } :
            type === 'POLYGON' ? shape.location :
              type === 'LINE' ? shape.start :
                type === 'POLYLINE' ? shape.points[0] :
                  type === 'POINT' ? shape : {};
        const targetText = gFirstTextLayer.current.getTextById(textId);
        targetText?.updatePosition(textPosition);
        directionMarker?.updatePosition?.(textPosition);
        updateToService();
        onCancel();
      });
      gMap.current.events.on('featureDeleted', (feature: any) => {
        const { id: featureId } = feature;
        gFirstFeatureLayer.current.removeFeatureById(featureId);
        updateToService();
        onCancel();
      });
      // 显示一张图片
      gFirstImageLayer.current = new AILabel.Layer.Image(
        'first-layer-image', // id
        {
          src: img.current.src,
          width: img.current.width,
          height: img.current.height,
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
      gFirstImageLayer.current.events.on('loadStart', (a: any, b: any) => {
        setLoading(true);
      });
      gFirstImageLayer.current.events.on('loadEnd', (a: any, b: any) => {
        setLoading(false);
      });
      gFirstImageLayer.current.events.on('loadError', (a: any, b: any) => {
        message.error('图片加载失败');
        setLoading(false);
      });
      // 添加到gMap对象
      gMap.current.addLayer(gFirstImageLayer.current);
      // 用于添加涂层
      gFirstFeatureLayer.current = new AILabel.Layer.Feature(
        'first-layer-feature', // id
        { name: '矢量图层' }, // props
        { zIndex: 10 } // style
      );
      gMap.current.addLayer(gFirstFeatureLayer.current);
      // 用于添加铅笔涂层
      gFirstMaskLayer.current = new AILabel.Layer.Mask(
        'first-layer-mask', // id
        { name: '涂抹图层' }, // props
        { zIndex: 11, opacity: .5 } // style
      );
      gMap.current.addLayer(gFirstMaskLayer.current);
      // 用于添加text层
      gFirstTextLayer.current = new AILabel.Layer.Text(
        'first-layer-text', // id
        { name: '文本图层' }, // props
        { zIndex: 12, opacity: 1 } // style
      );
      gMap.current.addLayer(gFirstTextLayer.current);

      window.addEventListener('resize', () => gMap.current && gMap.current.resize());
      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('keyup', onKeyup);
    }
  }
  useEffect(() => {
    initDom();

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyup);
      window.removeEventListener('resize', () => gMap.current && gMap.current.resize());
      destroy();
    }
  }, []);
  // 监听键盘按下
  const onKeyDown = (event: any) => {
    const { key, keyCode } = event;
    if (key === 'Backspace') {
      setSelectedFeature((prev: any) => {
        const feature = gFirstFeatureLayer.current?.getFeatureById?.(prev);
        if (!!feature) {
          const { props } = feature;
          gMap.current.markerLayer.removeMarkerById(props.deleteMarkerId);
          gMap.current.markerLayer.removeMarkerById(props.directionMarkerId);
          // 删除对应text
          gFirstTextLayer.current.removeTextById(props.textId);
          // 删除对应feature
          gFirstFeatureLayer.current.removeFeatureById(feature.id);

          if (['DOUBLE_CIRCLE'].includes(props.type)) {
            gFirstFeatureLayer.current.removeFeatureById(feature.id + 100);
          } else if (['AXIS'].includes(props.type)) {
            gFirstFeatureLayer.current.removeFeatureById(feature.id + 100);
            gFirstFeatureLayer.current.removeFeatureById(feature.id + 200);
            gFirstTextLayer.current.removeTextById(props.textXId);
            gFirstTextLayer.current.removeTextById(props.textYId);
          }
          return 0;
        };

        return prev;
      });
    } else if (keyCode === 17 || keyCode === 18) {
      ctrlDown.current = true;
    }
  };
  // 键盘抬起时，取消所有标记
  const onKeyup = (event: any) => {
    ctrlDown.current = false;
  };
  useEffect(() => {
    if (!!gMap.current) {
      let obj = {};
      if (!!features?.length || _.isArray(platFormValue)) {
        (!!features?.length ? features : (platFormValue || []))?.forEach((plat: any, index: number) => {
          const { type, id, shape, props, style } = plat;
          obj = Object.assign({}, obj, {
            [id]: {
              roi: {
                realValue: type === 'RECT' ? {
                  x: { alias: "cx", value: shape.x + shape.width / 2 },
                  y: { alias: "cy", value: shape.y + shape.height / 2 },
                  width: { alias: "width", value: shape.width },
                  height: { alias: "height", value: shape.height }
                } : type === 'CIRCLE' ? {
                  cx: { alias: "cx", value: shape.cx },
                  cy: { alias: "cy", value: shape.cy },
                  r: { alias: "r", value: shape.r },
                } : props?.initParams?.roi?.realValue,
                value: type === 'RECT' ? {
                  x: { alias: "cx", value: shape.x },
                  y: { alias: "cy", value: shape.y },
                  width: { alias: "width", value: shape.width },
                  height: { alias: "height", value: shape.height }
                } : type === 'CIRCLE' ? {
                  cx: { alias: "cx", value: shape.cx },
                  cy: { alias: "cy", value: shape.cy },
                  r: { alias: "r", value: shape.r },
                } : props?.initParams?.roi?.value,
              },
              ...(props?.initParams),
            },
          });
          if (!style.direction) {
            style['direction'] = props?.initParams?.['找线方向']?.value || 0
          };
          if (!props.directionMarkerId) {
            props['directionMarkerId'] = `label-direction-marker-id-${+new Date()}${index}`;
          }
          addFeature(type, id, shape, props, style);
        });
        setFeatureList(obj);
      };
      setGetDataFun((prev: any) => {
        const feat = getFeatures;
        const pen = getRle;
        return {
          feat, pen, zoom: gMap.current.zoom,
          value: Object.assign({}, prev?.value, obj),
          gMap: gMap.current,
        };
      });
    }
  }, [gMap.current]);

  // 添加text公共方法
  const addFeatureText = (data: any, relatedTextId: string, text: string, style?: any) => {
    // 添加feature标签名
    const { x: ltx, y: lty, } = data;
    const gFirstText = new AILabel.Text(
      relatedTextId, // id
      {
        text: text || (inHome ? '' : 'label'),
        position: { x: ltx, y: lty },
        offset: { x: 0, y: 0 },
        width: 100,
        maxWidth: 100,
        wrap: true
      }, // shape, 左上角
      { name: '文本对象' }, // props
      !!style ? style : {
        fillStyle: 'rgba(1,1,1,.9)',
        strokeStyle: '#D2691E',
        background: true,
        globalAlpha: 1,
        fontWeight: 3,
        fontColor: '#0f0',
      } // style
    );
    gFirstTextLayer.current.addText(gFirstText);
  };
  // 添加feature公共方法
  const addFeature = (type: any, id: any, shape: any, props: any, style: any) => {
    if (type === "LINE") {
      const range = style.direction || 0;
      const gFirstFeatureLine = new AILabel.Feature.Line(
        id, shape, props, style
      );
      gFirstFeatureLayer.current.addFeature(gFirstFeatureLine);
      if (props?.type === 'AXIS_CHILD') {
        if (props.name === 'x') {
          const position = shape.end;
          addFeatureText(position, props.textXId, props.name, arrowStyle);
        } else {
          const position = shape.start;
          addFeatureText(position, props.textYId, 'y', arrowStyle);
        }
      } else {
        const { start, end } = shape;
        let position = { x: 0, y: 0 };
        if (start.y <= end.y) {
          position = { x: start.x, y: start.y - 2 };
        } else {
          position = { x: end.x, y: end.y - 2 };
        }
        addFeatureText(position, props.textId, props.label);
      }
    } else if (type === "POLYLINE") {
      const polylineFeature = new AILabel.Feature.Polyline(
        id, shape, props, style
      );
      gFirstFeatureLayer.current.addFeature(polylineFeature);
    } else if (type === "RECT") {
      const gFirstFeatureRect = new AILabel.Feature.Rect(
        id, shape, props, style
      );
      gFirstFeatureLayer.current.addFeature(gFirstFeatureRect);
      if (props?.type === 'AXIS') {

      } else {
        // 添加direction-icon
        const gFirstMarker = new AILabel.Marker(
          props.directionMarkerId, // id
          {
            src: style.direction === 90 ?
              directionRightIcon
              :
              style.direction === 180 ?
                directionBottomIcon
                :
                style.direction === 270 ?
                  directionLeftIcon
                  :
                  directionTopIcon,
            position: { x: shape.x, y: shape.y },
            offset: {
              x: -20,
              y: 0
            }
          }, // markerInfo
          { name: 'direction-icon注记' } // props
        );
        gMap.current.markerLayer.addMarker(gFirstMarker);
        addFeatureText(shape, props.textId, props.label);
      }
    } else if (type === "POLYGON") {
      const gFirstFeaturePolygon = new AILabel.Feature.Polygon(
        id, shape, props, style
      );
      gFirstFeatureLayer.current.addFeature(gFirstFeaturePolygon);
    } else if (type === "CIRCLE") {
      const gFirstFeatureCircle = new AILabel.Feature.Circle(
        id, shape, props, style
      );
      gFirstFeatureLayer.current.addFeature(gFirstFeatureCircle);
      if (props?.type !== 'DOUBLE_CIRCLE_CHILD') {
        addFeatureText({ x: shape.cx - shape.r, y: shape.cy - shape.r }, props.textId, props.label);
      }
    } else if (type === "POINT") {
      const polylineFeature = new AILabel.Feature.Point(
        id, shape, props, style
      );
      gFirstFeatureLayer.current.addFeature(polylineFeature);
      addFeatureText(shape, props.textId, props.label);
    } else {
      // const scale = gMap.current.getScale();
      // const width = drawingStyle.current.lineWidth / scale;
      // const drawMaskAction = new AILabel.Mask.Draw(
      //   `${+new Date()}`, // id
      //   { ...rest },
      // );
      // gFirstMaskLayer.current.addAction(drawMaskAction);
    }
  };
  useEffect(() => {
    if (inHome && !!gMap.current && !!localPath) {
      img.current.src = `${localPath?.indexOf('http') === 0 ? localPath : `${BASE_IP}file${(localPath?.indexOf('\\') === 0 || localPath?.indexOf('/') === 0) ? '' : '\\'}${localPath}`}?__timestamp=${+new Date()}`;
    } else {
      initDom();
    }
  }, [localPath]);
  const updateToService = () => {
    if (!!gFirstImageLayer?.current) {
      const feat = getFeatures;
      const pen = getRle;
      console.log(feat());
      const zoom = gMap.current.zoom;
      const value = featureListRef.current || {};
      const data1 = ((feat && feat().map((item: any) => _.omit(item, 'layer'))) || [])
        .map((item: any) => {
          const { id, props, type, shape } = item;
          if (type === 'LINE') {
            if (!shape?.start?.x || !shape?.end?.x) {
              return null;
            }
          } else if (type === 'RECT') {
            if (!shape?.x || !shape?.width) {
              return null;
            }
          } else if (type === 'CIRCLE') {
            if (!shape?.cx || !shape?.cy) {
              return null;
            }
          } else if (type === 'POINT') {
            if (!shape?.x || !shape?.y || !shape?.sr) {
              return null;
            }
          };
          return Object.assign({}, item, {
            props: Object.assign({}, props, {
              initParams: _.omit(value?.[id], '旋转角度'),
            }, !!value?.[id]?.option_type ? {
              label: inHome ? "" : value?.[id]?.option_type?.value
            } : {})
          });
        }).filter(Boolean);
      let ifCangoOn = true;
      try {
        data1.forEach((item: any) => {
          const { id, props, type, shape } = item;
          const { initParams = {} } = props;
          if ((!props?.type || props?.type?.indexOf('AXIS') < 0) && !initParams?.option_type) {
            ifCangoOn = false;
            throw new Error();
          }
        });
      } catch (err) {

      }
      if (!ifCangoOn && process.env.NODE_ENV !== 'development') {
        message.error('画框未进行标注，请返回标注');
        return;
      }
      const data2 = (pen && pen()) || [];
      const params = Object.assign({}, data,
        {
          zoom,
          platFormValue: _.uniqBy(data1, 'id').concat(data2),
          value: _.uniqBy(data1, 'id').concat(data2).map((item: any) => {
            const { props, shape, type, id } = item;
            const { initParams = {} } = props;
            const initValue = Object.entries(initParams)?.reduce((pre: any, cen: any) => {
              return Object.assign({}, pre, (cen[0] === 'roi') ?
                (!!cen[1]?.realValue?.x ?
                  {
                    [cen[0]]: Object.assign({}, {
                      cx: {
                        alias: "cx",
                        value: Number(cen[1]?.realValue?.x?.value?.toFixed(2))
                      },
                      cy: {
                        alias: "cy",
                        value: Number(cen[1]?.realValue?.y?.value?.toFixed(2))
                      },
                    }, type === 'RECT' ? Object.assign(
                      {
                        width: { alias: 'width', value: Number(cen[1]?.realValue?.width?.value?.toFixed(2)) },
                        height: { alias: 'height', value: Number(cen[1]?.realValue?.height?.value?.toFixed(2)) }
                      },
                      props?.type === 'AXIS' ?
                        {
                          xLength: { alias: 'xLength', value: Number(cen[1]?.realValue?.xLength?.value?.toFixed(2)) },
                          yLength: { alias: 'yLength', value: Number(cen[1]?.realValue?.yLength?.value?.toFixed(2)) },
                        }
                        : {}
                    ) : {
                      ..._.omit(_.omit(cen[1]?.realValue, "x"), "y"),
                    })
                  }
                  : {})
                :
                { [cen[0]]: cen[1]?.value, localPath: img.current.src || data.localPath });
            }, {});
            if (type === 'RECT') {
              return {
                // id,
                type: props.type || "RECT",
                roi: {
                  cx: { alias: "cx", value: shape.x + shape.width / 2 },
                  cy: { alias: "cy", value: shape.y + shape.height / 2 },
                  width: { alias: "width", value: Number(shape.width?.toFixed(2)) },
                  height: { alias: "height", value: Number(shape.height?.toFixed(2)) }
                },
                ...initValue
              }
            } else if (type === 'LINE') {
              return {
                // id,
                type: "LINE",
                roi: shape,
                ...initValue
              }
            } else if (type === 'CIRCLE') {
              return {
                // id,
                type: "CIRCLE",
                roi: shape,
                ...initValue
              }
            } else if (type === 'POINT') {
              return {
                // id,
                type: "POINT",
                roi: shape,
                ...initValue
              }
            }
          }).filter(Boolean)
        }
      );
      setFeatures(params?.platFormValue);
      if (ifFetch) {
        btnFetch(fetchType, xName, params.value).then((res: any) => {
          if (!!res && res.code === 'SUCCESS') {
            if (!!res?.data?.img) {
              img.current.src = res?.data?.img;
            }
          } else {
            message.error(res?.msg || res?.message || "接口异常");
          }
        });
      };

    }
  };
  // featureList更新
  useEffect(() => {
    if (!!gMap.current) {
      featureListRef.current = featureList;
      setGetDataFun((prev: any) => {
        return {
          ...prev,
          zoom: gMap.current.zoom,
          value: { ...prev?.value, ...featureList }
        };
      });
    }
  }, [featureList, gMap.current]);

  function zoomIn() {
    gMap.current.zoomIn();
    setGetDataFun((prev: any) => ({
      ...prev, zoom: gMap.current.zoom
    }));
  }
  function zoomOut() {
    gMap.current.zoomOut();
    setGetDataFun((prev: any) => ({
      ...prev, zoom: gMap.current.zoom
    }));
  }
  function getRle() {
    const rleData = gFirstMaskLayer.current.getRleData({ x: 0, y: 0, width: 500, height: 354 });
    return rleData;
  }
  function setMode(mode: any) {
    setSelectedBtn(mode);
    if (['DOUBLE_CIRCLE', 'double_circle'].includes(mode)) {
      gMap.current.setMode('CIRCLE');
    } else if (['AXIS', 'axis'].includes(mode)) {
      gMap.current.setMode('RECT');
    } else {
      gMap.current.setMode(_.toUpper(mode));
    }
    // 后续对应模式处理
    switch (mode) {
      case 'PAN': {
        break;
      }
      case 'MARKER': {
        // 忽略
        break;
      }
      case 'POINT': {
        drawingStyle.current = { fillStyle: '#F00' };//'#9370DB'
        gMap.current.setDrawingStyle(drawingStyle.current);
        break;
      }
      case 'point': {
        drawingStyle.current = { fillStyle: '#F00' };//'#9370DB'
        gMap.current.setDrawingStyle(drawingStyle.current);
        break;
      }
      case 'DOUBLE_CIRCLE': {
        drawingStyle.current = { fillStyle: '#9370DB', strokeStyle: '#F00', lineWidth: 2 };
        gMap.current.setDrawingStyle(drawingStyle.current);
        break;
      }
      case 'double_circle': {
        drawingStyle.current = { fillStyle: '#9370DB', strokeStyle: '#F00', lineWidth: 2 };
        gMap.current.setDrawingStyle(drawingStyle.current);
        break;
      }
      case 'CIRCLE': {
        drawingStyle.current = { fillStyle: '#9370DB', strokeStyle: '#F00', lineWidth: 2 };
        gMap.current.setDrawingStyle(drawingStyle.current);
        break;
      }
      case 'circle': {
        drawingStyle.current = { fillStyle: '#9370DB', strokeStyle: '#F00', lineWidth: 2 };
        gMap.current.setDrawingStyle(drawingStyle.current);
        break;
      }
      case 'LINE': {
        drawingStyle.current = { strokeStyle: '#F00', lineJoin: 'round', lineCap: 'round', lineWidth: 1, arrow: false };
        gMap.current.setDrawingStyle(drawingStyle.current);
        break;
      }
      case 'line': {
        drawingStyle.current = { strokeStyle: '#F00', lineJoin: 'round', lineCap: 'round', lineWidth: 1, arrow: false };
        gMap.current.setDrawingStyle(drawingStyle.current);
        break;
      }
      case 'POLYLINE': {
        drawingStyle.current = { strokeStyle: '#F00', lineJoin: 'round', lineCap: 'round', lineWidth: 10 }
        gMap.current.setDrawingStyle(drawingStyle.current);
        break;
      }
      case 'RECT': {
        drawingStyle.current = { strokeStyle: '#F00', lineWidth: 1 }
        gMap.current.setDrawingStyle(drawingStyle.current);
        break;
      }
      case 'rect': {
        drawingStyle.current = { strokeStyle: '#F00', lineWidth: 1 }
        gMap.current.setDrawingStyle(drawingStyle.current);
        break;
      }
      case 'POLYGON': {
        drawingStyle.current = { strokeStyle: '#F00', fillStyle: '#0f0', globalAlpha: .3, lineWidth: 1, fill: true, stroke: true }
        gMap.current.setDrawingStyle(drawingStyle.current);
        break;
      }
      case 'DRAWMASK': {
        drawingStyle.current = { strokeStyle: 'rgba(255, 0, 0, .5)', fillStyle: '#00f', lineWidth: 20 }
        gMap.current.setDrawingStyle(drawingStyle.current);
        break;
      }
      case 'CLEARMASK': {
        drawingStyle.current = { fillStyle: '#00f', lineWidth: 30 }
        gMap.current.setDrawingStyle(drawingStyle.current);
        break;
      }
      case 'AXIS': {
        drawingStyle.current = { strokeStyle: '#F00', lineWidth: 2 }
        gMap.current.setDrawingStyle(drawingStyle.current);
        break;
      }
      case 'axis': {
        drawingStyle.current = { strokeStyle: '#F00', lineWidth: 2 }
        gMap.current.setDrawingStyle(drawingStyle.current);
        break;
      }
      default:
        break;
    }
  }
  // 选中的图层
  const feature = useMemo(() => {
    return gFirstFeatureLayer.current?.getFeatureById?.(selectedFeature);
  }, [gFirstFeatureLayer.current, selectedFeature]);
  // 导出数据
  const exportData = () => {
    const data1 = ((getFeatures().map((item: any) => _.omit(item, 'layer'))) || []).map((item: any) => {
      return Object.assign({}, item, {
        props: Object.assign({}, item?.props, {
          initParams: getDataFun?.value?.[item.id]
        }, !!getDataFun?.value?.[item.id]?.option_type ? {
          label: inHome ? "" : getDataFun?.value?.[item.id]?.option_type?.value
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

    const imagedata = await gMap.current.exportLayersToImage(
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
    const allFeatures = gFirstFeatureLayer.current.getAllFeatures();
    return allFeatures;
  }
  // 实例销毁
  function destroy() {
    gMap.current && gMap.current.destroy();
    window.removeEventListener('resize', () => gMap.current && gMap.current.resize());
  }
  // 关闭
  const onCancel = () => {
    setSelectedFeature(0);
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
          <StockOutlined
            onClick={() => setMode('LINE')}
            onDoubleClick={() => setMode('line')}
            className={`img-icon flex-box-center ${['LINE', 'line'].includes(selectedBtn) ? "selected" : ''}`}
          />
          <div
            className={`img-icon flex-box-center ${['DOUBLE_CIRCLE', 'double_circle'].includes(selectedBtn) ? "selected" : ''}`}
            onClick={() => { setMode('DOUBLE_CIRCLE') }}
            onDoubleClick={() => setMode('double_circle')}
          >
            <div className="img-icon-circle flex-box-center" >
              <div className="img-icon-circle-inhert" />
            </div>
          </div>
          <div
            className={`img-icon flex-box-center ${['CIRCLE', 'circle'].includes(selectedBtn) ? "selected" : ''}`}
            onClick={() => { setMode('CIRCLE') }}
            onDoubleClick={() => setMode('circle')}
          >
            <div className="img-icon-circle" />
          </div>
          <BorderOutlined
            className={`img-icon flex-box-center ${['RECT', 'rect'].includes(selectedBtn) ? "selected" : ''}`}
            onClick={() => setMode('RECT')}
            onDoubleClick={() => setMode('rect')}
          />
          <AimOutlined
            className={`img-icon flex-box-center ${['POINT', 'point'].includes(selectedBtn) ? "selected" : ''}`}
            onClick={() => setMode('POINT')}
            onDoubleClick={() => setMode('point')}
          />
          <BorderInnerOutlined
            className={`img-icon flex-box-center ${['AXIS', 'axis'].includes(selectedBtn) ? "selected" : ''}`}
            onClick={() => setMode('AXIS')}
            onDoubleClick={() => setMode('axis')}
          />
        </div>
        <div className="center background-ubv">
          <Popover placement="right" content={"拾色器"} >
            <HighlightOutlined
              onClick={() => { open() }}
              className={`img-icon flex-box-center`}
            />
          </Popover>
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
          <div
            className="canvas-box"
            id={CONTAINER_ID}
            ref={dom}
          />
        </div>
      </Spin>
      <div className="config-box background-ubv" style={!!fontSize ? { fontSize } : {}}>
        {
          !!selectedFeature ?
            <Fragment>
              <div className="condif-body">
                {
                  feature?.props?.type === 'AXIS' ?
                    <Form
                      form={form}
                      scrollToFirstError
                    >
                      <Form.Item
                        name={`roi`}
                        label={"位置信息"}
                        initialValue={{
                          'x': { alias: '原点x', value: feature?.shape?.x + feature?.shape?.width / 2 },
                          'y': { alias: '原点y', value: feature?.shape?.y + feature?.shape?.height / 2 },
                          // ...feature?.props?.initParams?.roi?.realValue,
                          'xLength': { alias: 'x轴长度', value: feature?.shape?.width },
                          'yLength': { alias: 'y轴长度', value: feature?.shape?.height }
                        }}
                        rules={[{ required: true, message: "位置信息" }]}
                      >
                        <Measurement />
                      </Form.Item>
                      <Form.Item
                        name={`rotation`}
                        label="旋转角度"
                        initialValue={featureList?.[selectedFeature]?.rotation?.value || 0}
                        rules={[{ required: true, message: "rotation" }]}
                      >
                        <InputNumber />
                      </Form.Item>
                    </Form>
                    :
                    <Form
                      form={form}
                      scrollToFirstError
                    >
                      <Form.Item
                        name={`option_type`}
                        label="参数类型"
                        initialValue={featureList?.[selectedFeature] ? featureList?.[selectedFeature]?.['option_type']?.value : undefined}
                        rules={[{ required: false, message: "参数类型" }]}
                      >
                        <Select
                          style={{ width: '100%' }}
                          options={_.isObject(options) ? Object.entries(options)?.map((res: any) => {
                            return { key: res[0], label: res[0], value: res[0], };
                          }) : []}
                          placeholder="参数类型"
                          onChange={(val, option: any) => {
                            setSelectedOptionType({ roi: feature?.shape, ..._.cloneDeep(options)[val] });
                          }}
                        />
                      </Form.Item>
                      {
                        !['POINT', 'LINE'].includes(feature?.type) ?
                          <Form.Item
                            name={`找线方向`}
                            label="找线方向"
                            tooltip="遵守左手法制，大拇指方向为找线方向"
                            style={['POINT', 'LINE'].includes(feature?.type) ? { display: 'none' } : {}}
                            initialValue={featureList?.[selectedFeature]?.['找线方向']?.value || 0}
                            rules={[{ required: true, message: "找线方向" }]}
                          >
                            <Select
                              style={{ width: '100%' }}
                              options={[
                                { label: '下到上', value: 0 },
                                { label: '左到右', value: 90 },
                                { label: '上到下', value: 180 },
                                { label: '右到左', value: 270 },
                                // { label: '', value: 360 }
                              ].map((res: any) => {
                                const { label, value } = res;
                                return { key: value, label: label, value: value, };
                              })}
                              placeholder="找线方向"
                            />
                          </Form.Item>
                          :
                          null
                      }
                      {
                        _.isEmpty(selectedOptionType) ?
                          (
                            !!featureList?.[selectedFeature] ?
                              Object.entries(featureList?.[selectedFeature])?.map((item: any) => {
                                if (item[0] === 'roi') {
                                  const feature = gFirstFeatureLayer.current.getFeatureById(selectedFeature);
                                  const { type } = feature;
                                  let value = {};
                                  if (_.isObject(item[1]?.realValue) && !_.isEmpty(item[1].realValue)) {
                                    if (type === 'RECT') {
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
                                    } else if (type === 'LINE') {
                                      // 线
                                      value = {
                                        "x1": { alias: "起点x", value: item[1]?.realValue?.x1?.value || item[1]?.realValue?.start?.value?.x },
                                        "y1": { alias: "起点y", value: item[1]?.realValue?.y1?.value || item[1]?.realValue?.start?.value?.y },
                                        "x2": { alias: "终点x", value: item[1]?.realValue?.x2?.value || item[1]?.realValue?.end?.value?.x },
                                        "y2": { alias: "终点y", value: item[1]?.realValue?.y2?.value || item[1]?.realValue?.end?.value?.y }
                                      };
                                    } else if (type === 'CIRCLE') {
                                      // 圆
                                      value = {
                                        ...item[1].realValue
                                      };
                                      // 圆环
                                      if (feature?.props?.type === "DOUBLE_CIRCLE") {
                                        const feature2 = gFirstFeatureLayer.current.getFeatureById(feature?.id + 100) || gFirstFeatureLayer.current.getFeatureById(feature?.id - 100);
                                        value = {
                                          ...value,
                                          "r2": {
                                            alias: "r2",
                                            value: feature2?.shape?.r
                                          }
                                        }
                                      }
                                    } else if (type === 'POINT') {
                                      // 点
                                      value = {
                                        "x": { alias: "x", value: item[1]?.realValue?.x?.value },
                                        "y": { alias: "y", value: item[1]?.realValue?.y?.value },
                                        "sr": { alias: "sr", value: item[1]?.realValue?.sr?.value }
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
                                    key={`${item[0]}$$${guid()}`}
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
                                  display={['POINT', 'LINE'].includes(feature?.type)}
                                />
                              })
                              :
                              null
                          )
                          :
                          Object.entries(selectedOptionType)?.map((item: any) => {
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
                                } else if (!!item[1]?.cx && !!item[1]?.r) {
                                  // 圆
                                  value = {
                                    "cx": { alias: "cx", value: item[1].cx },
                                    "cy": { alias: "cy", value: item[1].cy },
                                    "r": { alias: "r", value: item[1].r },
                                  };
                                  if (feature?.props?.type === "DOUBLE_CIRCLE") {
                                    // 同心圆
                                    const feature2 = gFirstFeatureLayer.current.getFeatureById(feature?.id + 100) || gFirstFeatureLayer.current.getFeatureById(feature?.id - 100);
                                    value = {
                                      ...value,
                                      "r2": {
                                        alias: "r2",
                                        value: feature2?.shape?.r
                                      }
                                    }
                                  }
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
                                key={`${item[0]}$$${guid()}`}
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
                              display={['POINT', 'LINE'].includes(feature?.type)}
                            />
                          })
                      }
                    </Form>
                }
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
                      // 坐标系
                      if (feature?.props?.type === 'AXIS') {
                        const feature1 = gFirstFeatureLayer.current.getFeatureById(feature.id + 100);
                        const feature2 = gFirstFeatureLayer.current.getFeatureById(feature.id + 200);
                        const targetXText = gFirstTextLayer.current.getTextById(feature?.props?.textXId);
                        const targetYText = gFirstTextLayer.current.getTextById(feature?.props?.textYId);
                        const center = {
                          x: value?.['roi']?.value?.x?.value || feature?.shape?.x + feature?.shape?.width / 2,
                          y: value?.['roi']?.value?.y?.value || feature?.shape?.y + feature?.shape?.height / 2,
                          xLength: value?.['roi']?.value?.xLength?.value || feature?.shape?.width / 2,
                          yLength: value?.['roi']?.value?.yLength?.value || feature?.shape?.height / 2
                        };
                        const range = value?.['rotation']?.value || 0;
                        /****************通过roi更新图层******************/
                        const shape = {
                          x: value?.['roi']?.value?.x?.value - value?.['roi']?.value?.xLength?.value / 2,
                          y: value?.['roi']?.value?.y?.value - value?.['roi']?.value?.yLength?.value / 2,
                          width: value?.['roi']?.value?.xLength?.value,
                          height: value?.['roi']?.value?.yLength?.value
                        };
                        let line1: any = {
                          start: { x: shape.x + shape.width * 3 / 8, y: shape.y + shape.height / 2 },
                          end: { x: shape.x + shape.width * 5 / 8, y: shape.y + shape.height / 2 }
                        },
                          line2: any = {
                            start: { x: shape.x + shape.width / 2, y: shape.y + shape.height * 3 / 8 },
                            end: { x: shape.x + shape.width / 2, y: shape.y + shape.height * 5 / 8 },
                          };

                        line1 = {
                          start: rotatePoint(line1?.start, center, range),
                          end: rotatePoint(line1?.end, center, range)
                        };
                        line2 = {
                          start: rotatePoint(line2?.start, center, range),
                          end: rotatePoint(line2?.end, center, range)
                        };
                        if (
                          Math.min(shape?.x, shape?.y) < 0 ||
                          (shape?.x + shape?.width) > img.current?.width ||
                          (shape?.y + shape?.height) > img.current?.height
                        ) {
                          message.warning('标注位置 不能超出图片范围！');
                        } else {
                          feature.style['direction'] = range;
                          // 更新矩形框位置
                          feature.updateShape(shape);
                          // 删除delete-icon
                          gMap.current.markerLayer.removeMarkerById(feature.props.deleteMarkerId);
                          feature1.style['direction'] = range;
                          feature1?.updateShape?.(line1);
                          feature2.style['direction'] = range;
                          feature2?.updateShape?.(line2);

                          const position1 = line1.end;
                          const position2 = line2.start;
                          targetXText?.updatePosition?.(position1);
                          targetYText?.updatePosition?.(position2);
                        }
                        /****************通过roi更新图层******************/
                        const result = {
                          ...featureList,
                          [selectedFeature]: {
                            roi: {
                              value: {
                                x: { alias: 'x', value: center.x },
                                y: { alias: 'y', value: center.y },
                                xLength: { alias: 'xLength', value: twoPointDistance(line1.start, line1.end) },
                                yLength: { alias: 'yLength', value: twoPointDistance(line2.start, line2.end) },
                                width: { alias: "width", value: feature?.shape?.width },
                                height: { alias: "height", value: feature?.shape?.height }
                              },
                              realValue: {
                                x: { alias: 'x', value: center.x },
                                y: { alias: 'y', value: center.y },
                                xLength: { alias: 'xLength', value: twoPointDistance(line1.start, line1.end) },
                                yLength: { alias: 'yLength', value: twoPointDistance(line2.start, line2.end) },
                                width: { alias: "width", value: feature?.shape?.width },
                                height: { alias: "height", value: feature?.shape?.height }
                              }
                            },
                            ..._.omit(value, 'roi')
                          }
                        };
                        setGetDataFun((prev: any) => ({
                          ...prev,
                          zoom: gMap.current.zoom,
                          value: { ...prev?.value, ...result }
                        }));
                        setFeatureList(result);
                        updateToService();
                        onCancel();
                      } else {
                        if (value?.['option_type']?.value) {
                          // 更新text
                          const targetText = gFirstTextLayer.current.getTextById(feature?.props?.textId);
                          if (targetText && !inHome) {
                            targetText?.updateText(value?.['option_type']?.value);
                          } else {
                            const { id, shape, props, style, type } = feature;
                            gFirstFeatureLayer.current.removeFeatureById(id);
                            gFirstTextLayer.current.removeTextById(props?.textId);
                            addFeature(type, id, shape, { ...props, label: inHome ? "" : value?.['option_type']?.value }, style);
                          };
                        }
                        const range = value?.['找线方向']?.value || 0;
                        if (value?.['roi']?.value?.cx && value?.['roi']?.value?.r) {
                          const val = value?.['roi']?.value;
                          // 圆
                          const shape1 = {
                            cx: val?.cx?.value,
                            cy: val?.cy?.value,
                            r: val?.r?.value,
                          };
                          feature.updateShape(shape1);
                          if (val.r2) {
                            // 圆环
                            const feature2 = gFirstFeatureLayer.current.getFeatureById(selectedFeature + 100) || gFirstFeatureLayer.current.getFeatureById(selectedFeature - 100);
                            const shape2 = {
                              cx: val?.cx?.value,
                              cy: val?.cy?.value,
                              r: val?.r2?.value,
                            };
                            feature2?.updateShape(shape2);
                          }
                        };
                        const result = {
                          ...featureList,
                          [selectedFeature]: (!_.isEmpty(selectedOptionType) || !_.isEmpty(featureList?.[selectedFeature])) ?
                            Object.entries(!_.isEmpty(selectedOptionType) ? selectedOptionType : featureList?.[selectedFeature])
                              ?.reduce((pre: any, cen: any) => {
                                if (cen[0] === 'roi') {
                                  const feature = gFirstFeatureLayer.current.getFeatureById(selectedFeature);
                                  const { type } = feature;
                                  let { value: val, } = value?.[cen[0]] || {};
                                  // realValue：没旋转的 中心点x,y
                                  let realValue = val;
                                  if (type === 'RECT') {
                                    // 矩形
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
                                    const feature = gFirstFeatureLayer.current.getFeatureById(selectedFeature);
                                    const shape = Object.entries(val).reduce((pre: any, cen: any) => {
                                      return Object.assign({}, pre, {
                                        [cen[0]]: cen[1]?.value
                                      });
                                    }, {});
                                    if (
                                      (Math.min(shape?.x, shape?.y) < 0 ||
                                        (shape?.x + shape?.width) > img.current?.width ||
                                        (shape?.y + shape?.height) > img.current?.height)
                                      &&
                                      process.env.NODE_ENV !== 'development'
                                    ) {
                                      message.warning('标注位置 不能超出图片范围！');
                                    } else {
                                      feature.style['direction'] = range;
                                      feature.updateShape(shape);
                                      const targetText = gFirstTextLayer.current.getTextById(feature?.props?.textId);
                                      targetText?.updatePosition({ x: shape.x, y: shape.y });
                                      // 删除delete-icon
                                      gMap.current.markerLayer.removeMarkerById(feature.props.deleteMarkerId);
                                      // 先删除direction-icon
                                      gMap.current.markerLayer.removeMarkerById(feature.props.directionMarkerId);
                                      // 后添加direction-icon
                                      const gFirstMarker = new AILabel.Marker(
                                        feature?.props?.directionMarkerId, // id
                                        {
                                          src: range === 90 ?
                                            directionRightIcon
                                            :
                                            range === 180 ?
                                              directionBottomIcon
                                              :
                                              range === 270 ?
                                                directionLeftIcon
                                                :
                                                directionTopIcon,
                                          position: { x: shape.x, y: shape.y },
                                          offset: {
                                            x: -20,
                                            y: 0
                                          }
                                        }, // markerInfo
                                        { name: 'direction-icon注记' } // props
                                      );
                                      gMap.current.markerLayer.addMarker(gFirstMarker);
                                    }
                                    /****************通过roi更新图层******************/
                                  } else if (type === 'LINE') {
                                    // 线
                                    /****************通过roi更新图层******************/
                                    const feature = gFirstFeatureLayer.current.getFeatureById(selectedFeature);
                                    const shape = {
                                      ...feature?.shape,
                                      start: {
                                        x: value?.['roi']?.value?.x1?.value,
                                        y: value?.['roi']?.value?.y1?.value
                                      },
                                      end: {
                                        x: value?.['roi']?.value?.x2?.value,
                                        y: value?.['roi']?.value?.y2?.value
                                      }
                                    };
                                    feature.updateShape(shape);
                                    const targetText = gFirstTextLayer.current.getTextById(feature?.props?.textId);
                                    targetText?.updatePosition({ ...shape?.start });
                                    // 删除delete-icon
                                    gMap.current.markerLayer.removeMarkerById(feature.props.deleteMarkerId);
                                    /****************通过roi更新图层******************/
                                  } else if (type === 'POINT') {
                                    // 点
                                    /****************通过roi更新图层******************/
                                    const feature = gFirstFeatureLayer.current.getFeatureById(selectedFeature);
                                    const shape = {
                                      ...feature?.shape,
                                      x: value?.['roi']?.value?.x?.value,
                                      y: value?.['roi']?.value?.y?.value,
                                      sr: value?.['roi']?.value?.sr?.value
                                    };
                                    feature.updateShape(shape);
                                    const targetText = gFirstTextLayer.current.getTextById(feature?.props?.textId);
                                    targetText?.updatePosition({ ...shape?.start });
                                    // 删除delete-icon
                                    gMap.current.markerLayer.removeMarkerById(feature.props.deleteMarkerId);
                                    /****************通过roi更新图层******************/
                                  }

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
                              }, {
                                option_type: { value: value?.['option_type']?.value },
                                "找线方向": { value: range },
                              })
                            :
                            {
                              roi: {
                                value: value?.['roi']?.value,
                                realValue: value?.['roi']?.value
                              },
                            }
                        };
                        setGetDataFun((prev: any) => ({
                          ...prev,
                          zoom: gMap.current.zoom,
                          value: { ...prev?.value, ...result }
                        }));
                        setFeatureList(result);
                        updateToService();
                        onCancel();
                      }
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
      {
        (ifFetch && !inHome) ?
          <div className="img-box" onClick={() => {
            btnFetch(fetchType, xName, {}).then((res: any) => {
              if (!!res && res.code === 'SUCCESS') {
                if (!!res?.data?.img) {
                  img.current.src = res?.data?.img;
                }
              } else {
                message.error(res?.msg || res?.message || "接口异常");
              }
            });
          }}>
            开始标注
          </div>
          : null
      }
      <div className="img-box" onClick={() => window.open(img.current?.src)}>
        <PictureOutlined style={{ marginRight: 8, color: 'rgb(60, 124, 255)' }} />
        {img.current && img.current?.title || 'img.png'}
      </div>
    </div>
  </div>;
};

export default MarkCanvas;
