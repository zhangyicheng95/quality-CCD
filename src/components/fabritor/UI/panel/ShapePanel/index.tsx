import { Tag } from 'antd';
import LineTypeList from './line-type-list';
import ShapeTypeList from './shape-type-list';
import RoughTypeList from './rough-type-list';
import { drawArrowLine, drawLine, drawTriArrowLine } from '@/components/fabritor/editor/objects/line';
import createRect from '@/components/fabritor/editor/objects/rect';
import createShape from '@/components/fabritor/editor/objects/shape';
import { useContext } from 'react';
import { GloablStateContext } from '@/context';
import { createPathFromSvg } from '@/components/fabritor/editor/objects/path';
import Title from '@/components/fabritor/components/Title';
import Center from '@/components/fabritor/components/Center';

export default function ShapePanel() {
  const { editor, roughSvg } = useContext(GloablStateContext);

  const addLine = (item: any) => {
    const { type, options = {} } = item;
    const canvas = editor.canvas;
    switch (type) {
      case 'f-line':
        drawLine({ ...options, canvas });
        break;
      case 'f-arrow':
        drawArrowLine({ ...options, canvas });
        break;
      case 'f-tri-arrow':
        drawTriArrowLine({ ...options, canvas });
        break;
      default:
        break;
    }
  }

  const addShape = (item: any) => {
    const { key, elem, options } = item;
    const canvas = editor.canvas;
    switch (key) {
      case 'rect':
      case 'rect-r':
        createRect({ ...options, canvas });
        break;
      case 'star':
      case 'heart':
        createPathFromSvg({ svgString: elem, canvas, sub_type: key, strokeWidth: 20 });
        break;
      default:
        createShape(item.shape, { ...options, canvas });
        break;
    }
  }

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
              <img src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(item.elem)}`} style={{ width: 64, height: 64 }} />
            </div>
          ))
        }
      </div>
      <Title>
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
      </div>
    </div>
  )
}