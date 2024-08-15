import { Tag } from 'antd';
import LineTypeList from '@/components/fabritor/UI/panel/ShapePanel/line-type-list';
import ShapeTypeList from '@/components/fabritor/UI/panel/ShapePanel/shape-type-list';
import RoughTypeList from '@/components/fabritor/UI/panel/ShapePanel/rough-type-list';
import { drawArrowLine, drawLine, drawTriArrowLine } from '@/components/fabritor/editor/objects/line';
import createRect from '@/components/fabritor/editor/objects/rect';
import createShape from '@/components/fabritor/editor/objects/shape';
import { fabric } from 'fabric';
import { useContext, useEffect } from 'react';
import { GloablStateContext } from '@/context';
import { createPathFromSvg } from '@/components/fabritor/editor/objects/path';
import Title from '@/components/fabritor/components/Title';
import sectorIcon from '@/assets/imgs/sector.svg';

export default function ShapePanel() {
  const { editor, roughSvg } = useContext<any>(GloablStateContext);

  function makeCurveCircle(left: number, top: number, line1: any, line2: any, line3: any) {
    const c: any = new fabric.Circle({
      left: left,
      top: top,
      strokeWidth: 5,
      radius: 12,
      fill: '#fff',
      stroke: '#666'
    });
    c.hasBorders = c.hasControls = false;
    c.line1 = line1;
    c.line2 = line2;
    c.line3 = line3;
    return c;
  };
  function makeCurvePoint(left: number, top: number, line1: any, line2: any, line3: any) {
    const c: any = new fabric.Circle({
      left: left,
      top: top,
      strokeWidth: 8,
      radius: 14,
      fill: '#fff',
      stroke: '#666'
    });
    c.hasBorders = c.hasControls = false;
    c.line1 = line1;
    c.line2 = line2;
    c.line3 = line3;
    return c;
  };
  // 添加曲线
  function drawQuadratic() {
    const cParams = {
      sub_type: 'curve',
    }
    const line: any = new fabric.Path('M 65 0 Q 100, 100, 200, 0', {
      fill: '', stroke: 'red',
      //  objectCaching: false,
      ...cParams
    });
    line.path[0][1] = 100;
    line.path[0][2] = 100;

    line.path[1][1] = 200;
    line.path[1][2] = 200;

    line.path[1][3] = 300;
    line.path[1][4] = 100;
    line.selectable = false;
    editor?.canvas?.add?.(line);
    const p1 = makeCurvePoint(200, 200, null, line, null)
    p1.name = "p1";
    editor?.canvas?.add(p1);
    const p0 = makeCurveCircle(100, 100, line, p1, null);
    p0.name = "p0";
    editor?.canvas?.add(p0);
    const p2 = makeCurveCircle(300, 100, null, p1, line);
    p2.name = "p2";
    editor?.canvas?.add(p2);
  };
  // 添加直线
  const addLine = (item: any) => {
    const { type, key, options = {} } = item;
    const canvas = editor.canvas;
    switch (type) {
      case 'f-line':
        drawLine({ ...options, canvas, sub_type: key, });
        break;
      case 'f-arrow':
        drawArrowLine({ ...options, canvas, sub_type: key, });
        break;
      case 'f-tri-arrow':
        drawTriArrowLine({ ...options, canvas, sub_type: key, });
        break;
      default:
        break;
    }
  };
  // 添加图形
  const addShape = (item: any) => {
    const { key, elem, shape, options } = item;
    const common = {
      left: 200,
      top: 100,
      cornerColor: "white",
      cornerSize: 10,
      transparentCorners: false,
      cornerStrokeColor: 'gray',
      radius: 3,
      fill: 'red',
    };
    switch (key) {
      case 'point':
        const hParams = {
          sub_type: `point`,
        };
        const horizationLine = new fabric.Circle({
          ...common,
          ...hParams,
        });
        editor.canvas?.add?.(horizationLine);
        break;
      case 'rect':
        const borderParams = {
          sub_type: `rect`,
        };
        const rectBorder = new fabric.Rect({
          ...common,
          width: 100,
          height: 100,
          fill: 'transparent',
          strokeWidth: 1,
          stroke: "#f00",
          ...borderParams
        });
        editor.canvas?.add?.(rectBorder);
        break;
      case 'circle':
        const cParams = {
          sub_type: `point`,
          radius: 48,
          fill: 'transparent',
          strokeWidth: 1,
          stroke: "#f00",
        };
        const circle = new fabric.Circle({
          ...common,
          ...cParams,
        });
        editor.canvas?.add?.(circle);
        break;
      case 'curve':
        drawQuadratic();
        break;
      // case 'rect-r':
      //   createRect({ ...options, canvas });
      //   break;
      // case 'star':
      // case 'heart':
      // break;
      default:
        //   createShape(item.shape, { ...options, canvas });
        createPathFromSvg({
          svgString: elem,
          canvas: editor.canvas,
          sub_type: key,
          hasControls: key !== 'point',
          strokeWidth: 4,
          ...options
        });
        break;
    }
  }
  // 添加自定义图像
  const addRough = (item: any) => {
    const { key, options } = item;
    const canvas = editor.canvas;
    let svg;
    switch (key) {
      case 'rough-line':
        svg = roughSvg.line(0, 0, 300, 0, options);
        break;
      case 'rough-rect':
        svg = roughSvg.rectangle(0, 0, 400, 400, options);
        break;
      case 'rough-circle':
        svg = roughSvg.circle(0, 0, 300, options);
        break;
      case 'rough-ellipse':
        svg = roughSvg.ellipse(0, 0, 300, 150, options);
        break;
      case 'rough-right-angle':
        svg = roughSvg.polygon([[0, 0], [0, 300], [300, 300]], options);
        break;
      case 'rough-diamond':
        svg = roughSvg.polygon([[0, 150], [150, 300], [300, 150], [150, 0]], options);
        break;
      case 'rough-diamond123':
        svg = roughSvg.polygon([[0, 150], [150, 300], [300, 150], [150, 0]], options);
        break;
      default:
        break;
    }

    console.log(svg)
    const svgString = `<svg fill="none" xmlns="http://www.w3.org/2000/svg">${svg.innerHTML}</svg>`
    createPathFromSvg({ svgString, canvas, sub_type: 'rough' });
  }

  return (
    <div className="fabritor-panel-wrapper">
      <Title>{'线条'}</Title>
      <div className='flex-box-justify-around' style={{ gap: 10, flexWrap: 'wrap' }}>
        {
          LineTypeList.map(item => (
            <div
              key={item.key}
              onClick={() => { addLine(item) }}
              className="fabritor-panel-shape-item"
            >
              <img src={`data:image/svg+xml,${encodeURIComponent(item.svg)}`} alt="" style={{ width: 48, height: 48 }} />
            </div>
          ))
        }
      </div>
      <Title>{'形状'}</Title>
      <div className='flex-box-justify-around' style={{ gap: 10, flexWrap: 'wrap' }}>
        {
          ShapeTypeList.map(item => (
            <div
              key={item.key}
              onClick={() => { addShape(item) }}
              className="fabritor-panel-shape-item"
            >
              {
                item.key === 'sector' ?
                  <img src={sectorIcon} alt="" style={{ width: 64, height: 64 }} />
                  :
                  <img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(item.elem)}`} style={{ width: 64, height: 64 }} />
              }
            </div>
          ))
        }
      </div>
      {/* <Title>
        <div style={{ position: 'relative' }}>
          <span>{'手绘风格'}</span>
          <Tag color='#f50' style={{ position: 'absolute', right: -48, top: -5, padding: '0 4px' }}>beta</Tag>
        </div>
      </Title>
      <div className='flex-box-justify-around' style={{ gap: 10, flexWrap: 'wrap' }}>
        {
          RoughTypeList.map(item => (
            <div
              key={item.key}
              onClick={() => { addRough(item) }}
              className="fabritor-panel-shape-item"
            >
              <Center style={{ width: 64, height: 64 }}>
                <img src={item.elem} style={{ width: 64 }} />
              </Center>
            </div>
          ))
        }
      </div> */}
    </div>
  )
}