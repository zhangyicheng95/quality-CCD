import { Layout, Tabs } from 'antd';
import { useContext } from 'react';
import { AlertOutlined, FileTextOutlined, PictureOutlined, BorderOutlined, BulbOutlined, AppstoreOutlined, GithubFilled } from '@ant-design/icons';
import TextPanel from './TextPanel';
import ImagePanel from './ImagePanel';
import ShapePanel from './ShapePanel';
import PaintPanel from './PaintPanel';
import DesignPanel from './DesignPanel';
import { GloablStateContext } from '@/context';
import AppPanel from './AppPanel';
import { PANEL_WIDTH } from '@/common/constants/globalConstants';

import styles from './index.less';

const { Sider } = Layout;

const siderStyle: React.CSSProperties = {
  position: 'relative',
  backgroundColor: '#fff',
  borderRight: '1px solid #e8e8e8'
};

const iconStyle = { fontSize: 18, marginRight: 0 };

const OBJECT_TYPES = [
  {
    label: '图层',
    value: 'design',
    icon: <AlertOutlined style={iconStyle} />
  },
  {
    label: '文字',
    value: 'text',
    icon: <FileTextOutlined style={iconStyle} />
  },
  {
    label: '模板',
    value: 'image',
    icon: <PictureOutlined style={iconStyle} />
  },
  {
    label: '图形',
    value: 'shape',
    icon: <BorderOutlined style={iconStyle} />
  },
  {
    label: '画笔',
    value: 'paint',
    icon: <BulbOutlined style={iconStyle} />
  },
  // {
  //   label: '应用',
  //   value: 'app',
  //   icon: <AppstoreOutlined style={iconStyle} />
  // }
];

export default function Panel() {
  const { editor } = useContext<any>(GloablStateContext);

  const renderPanel = (value: any) => {
    if (value === 'design') {
      return <DesignPanel />;
    }
    if (value === 'text') {
      return <TextPanel />;
    }
    if (value === 'image') {
      return <ImagePanel />;
    }
    if (value === 'shape') {
      return <ShapePanel />;
    }
    if (value === 'paint') {
      return <PaintPanel />;
    }
    if (value === 'app') {
      return <AppPanel />;
    }
    return null;
  }

  const renderLabel = (item: any) => {
    return (
      <div>
        <div>{item.icon}</div>
        <div>{item.label}</div>
      </div>
    )
  }

  const handleTabChange = (k: any) => {
    if (editor?.canvas) {
      if (k === 'paint') {
        editor.canvas.isDrawingMode = true;
      } else {
        editor.canvas.isDrawingMode = false;
      }
    }
  }

  return (
    <Sider
      style={siderStyle}
      width={PANEL_WIDTH}
      className={styles["fabritor-sider"]}
    >
      <Tabs
        tabPosition="left"
        style={{ flex: 1, overflow: 'auto' }}
        size="small"
        onChange={handleTabChange}
        items={
          OBJECT_TYPES.map((item) => {
            return {
              label: renderLabel(item),
              key: item.value,
              children: renderPanel(item.value)
            };
          })
        }
      />
    </Sider>
  )
}