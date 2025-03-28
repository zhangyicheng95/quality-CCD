import { useContext } from 'react';
import { Divider, Layout, Typography } from 'antd';
import styles from './index.less';
import { GloablStateContext } from '@/context';
import { SKETCH_ID } from '@/common/constants/globalConstants';
import SketchSetter from './SketchSetter';
import TextSetter from './TextSetter';
import ImageSetter from './ImageSetter';
import { LineSetter, ShapeSetter } from './ShapeSetter';
import { CenterV } from '@/components/fabritor/components/Center';
import CommonSetter from './CommonSetter';
import GroupSetter from './GroupSetter';
import PathSetter from './PathSetter';
import RoughSetter from './RoughSetter';
import { SETTER_WIDTH } from '@/common/constants/globalConstants';

const { Sider } = Layout;
const { Title } = Typography;

const siderStyle: React.CSSProperties = {
  position: 'relative',
  backgroundColor: '#fff',
  borderLeft: '1px solid #e8e8e8'
};

export default function Setter() {
  const { object, isReady } = useContext<any>(GloablStateContext);
  const objectType = object?.get?.('type') || '';

  const getRenderSetter = () => {
    if (!isReady) return null;
    if (!object || object.id === SKETCH_ID) return <SketchSetter />;

    switch (objectType) {
      case 'textbox':
      case 'f-text':
        return <TextSetter />;
      case 'rect':
        return <ShapeSetter />;
      case 'circle':
      case 'triangle':
      case 'polygon':
      case 'ellipse':
        return <ShapeSetter />;
      case 'f-line':
        return <LineSetter />;
      case 'f-arrow':
      case 'f-tri-arrow':
        return <LineSetter />;
      case 'image':
        return <ImageSetter />;
      case 'path':
        if (object?.sub_type === 'rough') {
          return <RoughSetter />;
        } else if (object?.sub_type?.indexOf('measurementError_') > -1) {
          return <RoughSetter />;
        }
        return <PathSetter />;
      case 'group':
        if (object?.sub_type === 'rough') {
          return <RoughSetter />
        }
        return <GroupSetter />;
      case 'activeSelection':
        return <GroupSetter />;
      default:
        return null;
    }
  }

  const renderSetter = () => {
    const Setter = getRenderSetter();
    if (Setter) {
      return (
        <>
          {Setter}
          <Divider />
        </>
      )
    }
    return null;
  }

  const getSetterTitle = () => {
    if (!isReady) return null;
    if (!object || object.id === SKETCH_ID) return '画布';
    switch (objectType) {
      case 'textbox':
      case 'f-text':
        return '文字';
      case 'rect':
      case 'circle':
      case 'triangle':
      case 'polygon':
      case 'ellipse':
        return '形状';
      case 'line':
      case 'f-line':
      case 'f-arrow':
      case 'f-tri-arrow':
        return '线条';
      case 'image':
      case 'image':
        return '图片';
      case 'path':
        if (object?.sub_type) {
          if (object?.sub_type === 'rough') {
            return '手绘风格';
          }
          return '形状';
        }
        return '画笔';
      case 'group':
        if (object?.sub_type === 'rough') {
          return '手绘风格';
        }
        return '组合';
      case 'activeSelection':
        return '组合';
      default:
        return '画布';
    }
  }

  const renderSetterTitle = () => {
    const title = getSetterTitle();
    if (!title) {
      return null;
    }
    return (
      <CenterV style={{ borderBottom: '1px solid #e8e8e8', paddingLeft: 16, height: 30 }}>
        <Title level={5} style={{ marginBottom: 0 }}>
          {getSetterTitle()}
        </Title>
      </CenterV>
    )
  }

  return (
    <Sider
      style={siderStyle}
      width={SETTER_WIDTH}
      className={styles["fabritor-sider"]}
    >
      {renderSetterTitle()}
      <div
        style={{ padding: 16, height: `calc(100% - 30px)`, overflow: 'auto' }}
      >
        {renderSetter()}
        <CommonSetter />
      </div>
    </Sider>
  )
}