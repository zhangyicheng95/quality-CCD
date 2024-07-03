import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as fabric from 'fabric';
import { FabricJSCanvas, useFabricJSEditor } from 'fabricjs-react';
import styles from './index.less';
import { Button } from 'antd';

export type DocumentReductionImageProps = {
  width: number;
  height: number;
  orientation: number;
  url: string;
  activeBoxIndex: string;
  regions: any[];
  setImageInfo?: (imageInfo: any) => void;
  updateZoom?: (zoom: number) => void;
};

const MarkCanvasFabric: React.FC<DocumentReductionImageProps> = (props) => {
  const { url } = props;
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

  const { editor, onReady } = useFabricJSEditor();
  const onAddCircle = () => {
    editor?.addCircle();
  };
  const onAddRectangle = () => {
    editor?.addRectangle();
  };

  useEffect(() => {
    const width = boxRef.current.clientWidth;
    const height = boxRef.current.clientHeight;
    canvasRef.current = new fabric.Canvas('canvasFabric', {
      width,
      height,
      backgroundColor: '#e5e5e5',
      selection: false,
    });
    fabric.Image.fromURL(url, {}).then((oImg) => {
      // const scale = oImg.width / oImg.height;
      // console.log(width, height, scale);
      // oImg.hasControls = false;
      // oImg.hasBorders = false;
      // oImg._setWidthHeight({ width: scale * height, height });
      // oImg.set({ left: width * 0.2, top: height * 0.3, angle: 0 }); //.scale(0.75);
      // console.log(oImg);
      // canvasRef.current.add(oImg);
      canvasRef.current?.setBackgroundImage?.(oImg);
    });

    const handleWheel = (handle: any) => {
      const { e } = handle;
      const isDown = e.deltaY > 0;
      e.preventDefault();
      updateImageScale(isDown);
    };
    canvasRef.current?.on('mouse:wheel', handleWheel);

    return () => {
      // @ts-ignore
      canvasRef.current?.off('mouse:wheel', handleWheel);
    };
  }, []);

  const addLayer = (type?: string) => {
    var rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: 'red',
      width: 20,
      height: 20,
      angle: 45,
      zIndex: 1,
    });
    var circle = new fabric.Circle({
      radius: 20,
      fill: 'green',
      left: 100,
      top: 100,
    });
    var triangle = new fabric.Triangle({
      width: 20,
      height: 30,
      fill: 'blue',
      left: 50,
      top: 50,
    });

    canvasRef.current.add(rect, circle, triangle);
  };

  const getAllLayer = () => {
    const all = canvasRef.current.getObjects();
    console.log(all);
  };

  return (
    <div className={styles.markCanvas}>
      <Button onClick={() => addLayer()}>添加</Button>
      <Button onClick={() => getAllLayer()}>获取所有数据</Button>
      <div className="mark-fabric-box" ref={boxRef}>
        <canvas id="canvasFabric" className="sample-canvas" ref={canvasRef}></canvas>
      </div>
      {/* <button onClick={onAddCircle}>Add circle</button>
      <button onClick={onAddRectangle}>Add Rectangle</button>
      <FabricJSCanvas className="sample-canvas" onReady={onReady} /> */}
    </div>
  );
};

export default MarkCanvasFabric;
