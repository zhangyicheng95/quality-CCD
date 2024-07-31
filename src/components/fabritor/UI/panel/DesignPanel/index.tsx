import { List, Empty, Button, Divider } from 'antd';
import { useEffect, useContext, useState } from 'react';
import { GloablStateContext } from '@/context';
import { SKETCH_ID } from '@/common/constants/globalConstants';
import { GroupOutlined, HeartTwoTone } from '@ant-design/icons';
import ContextMenu from '@/components/fabritor/components/ContextMenu';
import DEMOJSON from '@/components/fabritor/demo.json';

export default function Layer() {
  const { isReady, setReady, object: activeObject, setActiveObject, editor } = useContext<any>(GloablStateContext);
  const [layers, setLayers] = useState([]);

  const getCanvasLayers = (objects: any) => {
    const _layers: any = [];
    const length = objects.length;
    if (!length) {
      setLayers([]);
      return;
    }
    for (let i = length - 1; i >= 0; i--) {
      let object = objects[i];
      if (object && object.id !== SKETCH_ID) {
        if (object.sub_type === 'image') {
          object.__cover = object?.img?.src;
        } else {
          object.__cover = object?.toDataURL?.();
        }

        _layers.push({
          cover: object.__cover,
          group: object.type === 'group',
          object
        });
      }
    }
    setLayers(_layers);
  }

  const loadDemo = async () => {
    setReady(false);
    await editor.loadFromJSON(DEMOJSON, true);
    editor.fhistory.reset();
    setReady(true);
    setActiveObject(null);
    editor.fireCustomModifiedEvent();
  }

  const handleItemClick = (item: any) => {
    editor.canvas.discardActiveObject();
    editor.canvas.setActiveObject(item.object);
    editor.canvas.requestRenderAll();
  }

  useEffect(() => {
    let canvas: any;
    const initCanvasLayers = () => { getCanvasLayers?.(canvas?.getObjects?.()); }

    if (isReady) {
      setLayers([]);
      canvas = editor?.canvas;
      initCanvasLayers();

      canvas.on({
        'object:added': initCanvasLayers,
        'object:removed': initCanvasLayers,
        'object:modified': initCanvasLayers,
        'object:skewing': initCanvasLayers,
        'fabritor:object:modified': initCanvasLayers
      });
    }

    return () => {
      if (canvas) {
        canvas.off({
          'object:added': initCanvasLayers,
          'object:removed': initCanvasLayers,
          'object:modified': initCanvasLayers,
          'object:skewing': initCanvasLayers,
          'fabritor:object:modified': initCanvasLayers
        });
      }
    }
  }, [isReady]);

  return (
    <div
      className="fabritor-panel-wrapper"
    >
      {
        layers.length ?
          <List
            dataSource={layers}
            renderItem={(item: any) => {
              return (
                <ContextMenu object={item.object} noCareOpen>
                  <List.Item
                    className="fabritor-list-item"
                    style={{
                      border: activeObject === item.object ? ' 2px solid #ff2222' : '2px solid transparent',
                      padding: '10px 16px'
                    }}
                    onClick={() => { handleItemClick(item) }}
                  >
                    <div className='flex-box-justify-between' style={{ width: '100%', height: 40 }}>
                      <img src={item.cover} style={{ maxWidth: 200, maxHeight: 34, width: 'auto', height: 'auto' }} />
                      {
                        item.group ?
                          <GroupOutlined style={{ fontSize: 18, color: 'rgba(17, 23, 29, 0.6)' }} /> : null
                      }
                    </div>
                  </List.Item>
                </ContextMenu>
              )
            }}
          /> :
          <Empty
            image={null}
            description={
              <div>
                <HeartTwoTone twoToneColor="#eb2f96" style={{ fontSize: 40 }} />
                <p style={{ color: '#aaa', fontSize: 16 }}>{'开始绘图'}</p>
                <Divider />
                <Button onClick={loadDemo}>{'或者从一个简单 DEMO 开始'}</Button>
              </div>
            }
          />
      }
    </div>
  )
}