import { useContext, useEffect, useState } from 'react';
import { GloablStateContext } from '@/context';
import { LockOutlined, UnlockOutlined, CopyOutlined, DeleteOutlined, PicCenterOutlined, AlignLeftOutlined, AlignCenterOutlined, AlignRightOutlined, VerticalAlignTopOutlined, VerticalAlignMiddleOutlined, VerticalAlignBottomOutlined } from '@ant-design/icons';
import { SKETCH_ID } from '@/common/constants/globalConstants';
import OpacitySetter from './OpacitySetter';
import ToolbarItem from '../../header/Toolbar/ToolbarItem';
import { CenterV } from '@/components/fabritor/components/Center';
import { copyObject, pasteObject, removeObject } from '@/utils/helper';
import FlipSetter from './FlipSetter';
import { Divider } from 'antd';
import PositionSetter from './PositionSetter';

const ALIGH_TYPES = [
  {
    label: '居中',
    icon: PicCenterOutlined,
    key: 'center'
  },
  {
    label: "左对齐",
    icon: AlignLeftOutlined,
    key: 'left'
  },
  {
    label: "水平居中",
    icon: AlignCenterOutlined,
    key: 'centerH'
  },
  {
    label: "右对齐",
    icon: AlignRightOutlined,
    key: 'right'
  },
  {
    label: "顶部对齐",
    icon: VerticalAlignTopOutlined,
    key: 'top'
  },
  {
    label: "垂直居中",
    icon: VerticalAlignMiddleOutlined,
    key: 'centerV'
  },
  {
    label: "底部对齐",
    icon: VerticalAlignBottomOutlined,
    key: 'bottom'
  }
]

export default function CommonSetter() {
  const { object, editor } = useContext<any>(GloablStateContext);
  const [lock, setLock] = useState(false);
  const [opacity, setOpacity] = useState(1);

  const handleLock = () => {
    object.set({
      lockMovementX: !lock,
      lockMovementY: !lock,
      hasControls: !!lock
    });
    editor.canvas.requestRenderAll();
    setLock(!lock);
    editor.fireCustomModifiedEvent();
  }

  const handleOpacity = (v: any) => {
    object.set('opacity', v);
    setOpacity(v);
    editor.canvas.requestRenderAll();
  }

  const handleFlip = (key: any) => {
    object.set(key, !object[key]);
    editor.canvas.requestRenderAll();
    editor.fireCustomModifiedEvent();
  }

  const alignObject = (alignType: any) => {
    switch (alignType) {
      case 'center':
        editor.canvas.viewportCenterObject(object);
        object.setCoords();
        break;
      case 'left':
        object.set('left', 0);
        break;
      case 'centerH':
        editor.canvas.viewportCenterObjectH(object);
        object.setCoords();
        break;
      case 'right':
        object.set('left', editor.sketch.width - object.width);
        break;
      case 'top':
        object.set('top', 0);
        break;
      case 'centerV':
        editor.canvas.viewportCenterObjectV(object);
        object.setCoords();
        break;
      case 'bottom':
        object.set('top', editor.sketch.height - object.height);
        break;
      default:
        break;
    }
    editor.canvas.requestRenderAll();
    editor.fireCustomModifiedEvent();
  }

  useEffect(() => {
    if (object) {
      setLock(object.lockMovementX);
      setOpacity(object.opacity);
    }
  }, [object]);

  if (!object || object.id === SKETCH_ID) return null;

  return (
    <>
      <CenterV height={30} gap={8} className="flex-box-justify-between">
        <ToolbarItem
          tooltipProps={{ placement: 'top' }}
          onClick={handleLock} title={lock ? '解锁' : '锁定'}
        >
          {
            lock ?
              <UnlockOutlined style={{ fontSize: 20 }} /> :
              <LockOutlined style={{ fontSize: 20 }} />
          }
        </ToolbarItem>
        <ToolbarItem tooltipProps={{ placement: 'top' }} title={'透明度'}>
          <OpacitySetter
            value={opacity}
            onChange={handleOpacity}
            onChangeComplete={() => { editor.fireCustomModifiedEvent(); }}
          />
        </ToolbarItem>
        <ToolbarItem
          tooltipProps={{ placement: 'top' }}
          title={'创建副本'}
          onClick={
            async () => {
              await copyObject(editor.canvas, object);
              await pasteObject(editor.canvas);
            }
          }
        >
          <CopyOutlined style={{ fontSize: 20 }} />
        </ToolbarItem>
        <ToolbarItem
          tooltipProps={{ placement: 'top' }}
          title={'删除'}
          onClick={() => { removeObject(null, editor.canvas); }}
        >
          <DeleteOutlined style={{ fontSize: 20 }} />
        </ToolbarItem>
        {
          object.type === 'f-image' ?
            <ToolbarItem
              tooltipProps={{ placement: 'top' }}
              title={'删除'}
            >
              <FlipSetter onChange={handleFlip} />
            </ToolbarItem> : null
        }
      </CenterV>
      <Divider style={{ margin: '16px 0' }} />
      <span style={{ fontWeight: 'bold' }}>{'对齐'}</span>
      <CenterV height={30} className="flex-box-justify-between" style={{ marginTop: 16, gap: 8 }}>
        {
          ALIGH_TYPES.map(item => (
            <ToolbarItem
              tooltipProps={{ placement: 'top' }}
              title={item.label}
              key={item.key}
              onClick={() => { alignObject(item.key); }}
            >
              <item.icon style={{ fontSize: 20 }} />
            </ToolbarItem>
          ))
        }
      </CenterV>
      <Divider style={{ margin: '16px 0' }} />
      <PositionSetter />
    </>
  )
}