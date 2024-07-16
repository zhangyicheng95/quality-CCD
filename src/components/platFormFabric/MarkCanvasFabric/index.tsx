import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as fabric from 'fabric';
import styles from './index.less';
import { Button } from 'antd';

export type DocumentReductionImageProps = {
  data?: any;
  width?: number;
  height?: number;
  orientation?: number;
  url?: string;
  activeBoxIndex?: string;
  regions?: any[];
  setImageInfo?: (imageInfo: any) => void;
  updateZoom?: (zoom: number) => void;
};
const commonStyle: any = {
  padding: 4,
  borderColor: "dodgerblue",
  cornerStyle: "circle",
  cornerColor: "white",
  cornerSize: 8,
  transparentCorners: false,
  cornerStrokeColor: 'gray',
};

const MarkCanvasFabric: React.FC<DocumentReductionImageProps> = (props) => {
  const { url = '' } = props;
  const canvasRef = useRef<any>(null);
  const boxRef = useRef<any>(null);
  const canvasWheeled = useRef<number>(0);

  const updateImageScale = (isDown: any) => {
    let off = 0.1;
    if (isDown) {
      off = -0.1;
    }

    let zoom: number = canvasRef.current?.getZoom() + off;
    if (zoom <= 0.1) {
      zoom = 0.1;
    }
    if (canvasWheeled.current === 0) {
      canvasWheeled.current = canvasRef.current?.getZoom();
    }
    canvasRef.current?.setZoom(zoom);
  };

  useEffect(() => {
    const width = boxRef.current.clientWidth;
    const height = boxRef.current.clientHeight;
    canvasRef.current = new fabric.Canvas('canvasFabric', {
      width,
      height,
      // backgroundColor: '#e5e5e5',
      selection: false,
    });
    fabric.Image.fromURL(url, {}).then((oImg) => {
      const scaleH = height / oImg.height;
      const scaleW = width / oImg.width;
      const scale = Math.min(scaleH, scaleW);
      oImg.hasControls = false;
      oImg.hasBorders = false;
      // oImg._setWidthHeight({ width: scale * height, height: height });
      oImg.set({ left: 0, top: 0, angle: 0 }).scale(scale);
      oImg.set('selectable', false); // 单个对象不可选
      canvasRef.current.setHeight(oImg.height * scale);
      canvasRef.current.setWidth(oImg.width * scale);
      canvasRef.current.add(oImg);
      canvasRef.current?.setBackgroundImage?.(oImg);
    });
    canvasRef.current.on('object:moving', function (e: any) {
      var obj = e.target;
      // if object is too big ignore
      if (obj.currentHeight > obj.canvas.height || obj.currentWidth > obj.canvas.width) {
        return;
      }
      obj.setCoords();
      // top-left  corner
      if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
        obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top);
        obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left);
      }
      // bot-right corner
      if (obj.getBoundingRect().top + obj.getBoundingRect().height > obj.canvas.height || obj.getBoundingRect().left + obj.getBoundingRect().width > obj.canvas.width) {
        obj.top = Math.min(obj.top, obj.canvas.height - obj.getBoundingRect().height + obj.top - obj.getBoundingRect().top);
        obj.left = Math.min(obj.left, obj.canvas.width - obj.getBoundingRect().width + obj.left - obj.getBoundingRect().left);
      }
    });
    // const handleWheel = (handle: any) => {
    //   const { e } = handle;
    //   const isDown = e.deltaY > 0;
    //   e.preventDefault();
    //   updateImageScale(isDown);
    // };
    // canvasRef.current?.on('mouse:wheel', handleWheel);

    return () => {
      // canvasRef.current?.off('mouse:wheel', handleWheel);
    };
  }, []);
  const editControls = (grap: any) => {
    const renderIcon = (image: any, initialAngle: any) => {
      return function (ctx: any, left: any, top: any, styleOverride: any, fabricObject: any) {
        let size = 16;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle + initialAngle));
        ctx.drawImage(image, -size / 2, -size / 2, size, size);
        ctx.restore();
      };
    };
    grap.controls.mtr.withConnection = false;
    grap.controls.mtr.offsetY = -20;
    grap.controls.mtr.cursorStyle = "move";
    grap.controls.mtr.touchSizeX = 24;
    grap.controls.mtr.touchSizeY = 24;
    grap.controls.mtr.sizeX = 12;
    grap.controls.mtr.sizeY = 12;

    // 从画布中删除当前选中的对象
    function deleteObject(canvas: any) {
      // 获取画布当前选中的对象
      let activeObject = canvas.getActiveObject();
      if (activeObject) {
        canvas.remove(activeObject);
        canvas.renderAll();
      }
    }
    // 垃圾桶图标
    const deleteIconURL = "./images/delete.png";
    // @ts-ignore
    fabric.Image.fromURL(deleteIconURL, {}).then((img: { _element: any; }, isError: any) => {
      if (!isError) {
        grap.controls.delete = new fabric.Control({
          // x和y设置该控制点和第二列中间的控制点重合
          x: 0.5,
          y: -0.5,
          // offsetX和offsetY设置该控制点在水平和竖直两个方向上
          // 偏移的距离（单位px）
          offsetX: 0,
          offsetY: -20,
          // 光标移动到该控制点时变为一个手的图标
          cursorStyle: 'pointer',
          // 自定义的值，可忽略
          actionName: "delete",
          // 设置当点击了该控制点，鼠标弹起是执行的动作处理方法
          mouseUpHandler: () => deleteObject(canvasRef.current),
          //渲染图标
          render: renderIcon(img._element, 0),
        });
      }
    });
  };
  // 添加标注
  const addLayer = (type?: string) => {
    let grap = null;
    if (type === 'rect') {
      grap = new fabric.Rect({
        ...commonStyle,
        left: 100,
        top: 100,
        stroke: 'green',
        strokeWidth: 1,
        fill: 'red',
        width: 100,
        height: 100,
        angle: 0,
      });
    } else if (type === 'circle') {
      grap = new fabric.Circle({
        ...commonStyle,
        radius: 20,
        lineWidth: 10,
        fill: 'yellow',
        left: 100,
        top: 100,
      });
    } else if (type === 'triangle') {
      grap = new fabric.Triangle({
        ...commonStyle,
        width: 20,
        height: 30,
        fill: 'blue',
        left: 50,
        top: 50,
      });
    } else if (type === 'semicircle') {
      // 创建半圆对象，继承 fabric.Object
      let Semicircle: any = fabric.util.createClass(fabric.Object, {
        // 初始化
        initialize(options: any) {
          this.callSuper('initialize', options);
          this.width = 100;
          this.height = 50;
        },
        // 渲染
        _render(ctx: any) {
          ctx.strokeStyle = this.stroke || '#333'; // 初始化描边颜色
          ctx.lineWidth = this.strokeWidth || 1; // 初始化描边宽度
          ctx.fillStyle = this.fill || '#333'; // 初始化填充色
          ctx.beginPath(); // 开始绘制路径
          ctx.arc(0, -25, 50, 0, 180 * Math.PI / 180); // 绘制半圆
          ctx.closePath(); // 结束绘制路径
          ctx.stroke(); // 描边
          ctx.fill(); // 填充
        }
      });
      grap = new Semicircle({
        top: 10,
        left: 10,
        stroke: '#7bcfa6', // 描边色
        fill: '#ed5736', // 填充色
        strokeWidth: 10 // 描边宽度
      })
    }
    editControls(grap);
    canvasRef.current.add(grap);
  };
  // 获取画布数据
  const getAllLayer = () => {
    const all = canvasRef.current.getObjects()?.filter((i: any) => !i.imageSmoothing);
    console.log(all);
  };

  return (
    <div className={styles.markCanvas}>
      <div className="flex-box" style={{ gap: 8, height: 40 }}>
        <Button onClick={() => addLayer('rect')}>正方形</Button>
        <Button onClick={() => addLayer('semicircle')}>半圆</Button>
        <Button onClick={() => getAllLayer()}>获取所有数据</Button>
      </div>
      <div className="flex-box-center mark-fabric-box" ref={boxRef}>
        <canvas id="canvasFabric" className="sample-canvas"></canvas>
      </div>
      {/* <button onClick={onAddCircle}>Add circle</button>
      <button onClick={onAddRectangle}>Add Rectangle</button>
      <FabricJSCanvas className="sample-canvas" onReady={onReady} /> */}
    </div>
  );
};

export default MarkCanvasFabric;
