import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Button, Form, message, Popover, Select, Spin } from 'antd';
import { PictureOutlined } from "@ant-design/icons";
// @ts-ignore
import { saveAs } from "file-saver";
import html2canvas from 'html2canvas';
import * as _ from "lodash";
import styles from "./index.less";
import markIcon from '@/assets/imgs/marker.png';
import deleteIcon from '@/assets/imgs/delete.png';
import cursorIcon from '@/assets/imgs/cursor.svg';
import grabHandIcon from '@/assets/imgs/grabHand.svg';
import plusIcon from '@/assets/imgs/magnifier-plus.svg';
import minusIcon from '@/assets/imgs/magnifier-minus.svg';
import circleIcon from '@/assets/imgs/circle.svg';
import polyLineIcon from '@/assets/imgs/poly-line.svg';
import rectIcon from '@/assets/imgs/rect.svg';
import aimIcon from '@/assets/imgs/aim.svg';
import loadIcon from '@/assets/imgs/down-load.svg';
import { BASE_IP } from "@/services/api";
import e from "express";
import { FormatWidgetToDom } from "@/pages/control";
import { downFileFun, guid } from "@/utils/utils";

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
            { name: '圆形矢量图层', textId: relatedTextId, deleteMarkerId: relatedDeleteMarkerId, label: '缺陷' }, // props 
            drawingStyle // style
          );
          gFirstFeatureLayer.addFeature(circleFeature);
          addFeatureText({ x: data.cx - data.r, y: data.cy - data.r }, relatedTextId, '缺陷');
        } else if (type === 'RECT') {
          const rectFeature = new AILabel.Feature.Rect(
            `${+new Date()}`, // id
            data, // shape
            { name: '矩形矢量图形', textId: relatedTextId, deleteMarkerId: relatedDeleteMarkerId, label: '缺陷' }, // props
            drawingStyle // style
          );
          gFirstFeatureLayer.addFeature(rectFeature);
          addFeatureText(data, relatedTextId, '缺陷');
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
            { name: '多边形矢量图形', textId: relatedTextId, deleteMarkerId: relatedDeleteMarkerId, label: '缺陷' }, // props
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
        const { id, type, shape, } = feature;
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
        gMap.setActiveFeature(null);
        gMap.markerLayer.removeMarkerById(feature.props.deleteMarkerId);
        onCancel();
      });
      // 圆形/矩形 框选更新
      gMap.events.on('featureUpdated', (feature: any, shape: any) => {
        const { type } = feature;
        feature.updateShape(shape);

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
      const gFirstTextLayer = new AILabel.Layer.Text(
        'first-layer-text', // id
        { name: '文本图层' }, // props
        { zIndex: 12, opacity: 1 } // style
      );
      gMap.addLayer(gFirstTextLayer);
      // 添加text公共方法
      const addFeatureText = (data: any, relatedTextId: string, text: string) => {
        // 添加feature标签名
        const { x: ltx, y: lty, } = data;
        const gFirstText = new AILabel.Text(
          relatedTextId, // id
          { text, position: { x: ltx, y: lty }, offset: { x: 0, y: 0 } }, // shape, 左上角
          { name: '文本对象' }, // props
          { fillStyle: '#F4A460', strokeStyle: '#D2691E', background: true, globalAlpha: 1, fontColor: '#0f0' } // style
        );
        gFirstTextLayer.addText(gFirstText);
      };
      let obj = {};
      if (_.isArray(platFormValue)) {
        (platFormValue || [])?.forEach((plat: any) => {
          const { type, id, shape, props, style, ...rest } = plat;
          obj = Object.assign({}, obj, {
            [id]: props?.initParams,
          })
          // const position = type === 'RECT' ? feature.getPoints()[1] :
          // type === 'CIRCLE' ? { x: shape.cx + shape.r, y: shape.cy - shape.r } :
          //   type === 'POLYGON' ? location : {},
          if (type === "LINE") {
            const gFirstFeatureLine = new AILabel.Feature.Line(
              id, shape, props, style
            );
            gFirstFeatureLayer.addFeature(gFirstFeatureLine);
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
        });
        setFeatureList(obj);
      }
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

  // 导出数据
  const exportData = () => {
    const data1 = ((getFeatures().map((item: any) => _.omit(item, 'layer'))) || []).map((item: any) => {
      return Object.assign({}, item, {
        props: Object.assign({}, item?.props, {
          initParams: getDataFun?.value?.[item.id]
        })
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
          roi: shape,
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
          <img src={polyLineIcon} alt="poly-line" onClick={() => { setMode('LINE') }} className={selectedBtn === 'LINE' ? "selected" : ''} />
          {/* <Popover placement="right" content={lineMenu} style={{ padding: 0 }}>
            {
              selectedBtn === 'LINE' ?
                <img src={lineIcon} alt="line" className="selected" />
                :
                <img src={polyLineIcon} alt="poly-line" className={selectedBtn === 'POLYLINE' ? "selected" : ''} />
            }
          </Popover> */}
          <img src={circleIcon} alt="circle" onClick={() => { setMode('CIRCLE') }} className={selectedBtn === 'CIRCLE' ? "selected" : ''} />
          <img src={rectIcon} alt="RECT" onClick={() => { setMode('RECT') }} className={selectedBtn === 'RECT' ? "selected" : ''} />
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
          {/* <Popover placement="right" content={"点"} > */}
          <img
            src={aimIcon}
            alt="cursor-default"
            className={selectedBtn === 'POINT' ? "selected" : ''}
            onClick={() => setMode('POINT')}
          />
          {/* </Popover> */}
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
          <img
            src={cursorIcon}
            alt="cursor"
            className={selectedBtn === '' ? "selected" : ''}
            onClick={() => setMode('')}
          />
          <Popover placement="right" content={"移动"} >
            <img
              src={grabHandIcon}
              alt="grab-hand"
              className={selectedBtn === 'PAN' ? "selected" : ''}
              onClick={() => setMode('PAN')}
            />
          </Popover>
          <img
            src={cursorIcon}
            alt="cursor"
            className={selectedBtn === 'drawRect' ? "selected" : ''}
            onClick={() => setMode('drawRect')}
          />
        </div>
        <div className="bottom background-ubv" style={{ marginBottom: 0 }}>
          <img src={plusIcon} alt="plus" onClick={() => zoomIn()} />
          <img src={minusIcon} alt="minus" onClick={() => zoomOut()} />
          <Popover placement="right" content={"导出数据"} >
            <img src={loadIcon} alt="down-load" onClick={() => exportData()} />
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
                    initialValue={featureList[selectedFeature] ? featureList[selectedFeature]?.['option_type'] : undefined}
                    rules={[{ required: true, message: "参数类型" }]}
                  >
                    <Select
                      style={{ width: '100%' }}
                      options={_.isObject(options) ? Object.entries(options)?.map((res: any) => {
                        return { label: res[0], value: res[0], };
                      }) : []}
                      placeholder="参数类型"
                      onChange={(val, option: any) => {
                        setSelectedOptionType(_.cloneDeep(options)[val]);
                      }}
                    />
                  </Form.Item>
                  {
                    _.isEmpty(selectedOptionType) ?
                      (!!featureList[selectedFeature] ?
                        Object.entries(featureList[selectedFeature])?.map((item: any) => {
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
                      const result = {
                        ...featureList,
                        [selectedFeature]: Object.entries(featureList[selectedFeature] || selectedOptionType)?.reduce((pre: any, cen: any) => {
                          return Object.assign({}, pre, {
                            [cen[0]]: {
                              ...cen[1],
                              value: value[cen[0]]?.value
                            }
                          })
                        }, { option_type: { value: value?.['option_type']?.value } })
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
