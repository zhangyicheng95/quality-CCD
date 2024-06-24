import React, { useEffect, useMemo, useRef, useState } from 'react';
import Guides from '@scena/react-guides';
import { connect } from 'umi';
import styles from './index.less';
import MoveItem from './MoveabledItem/MoveItem';
import NodeDetailWrapper from '../NodeDetailWrapper';
import {
  AppstoreAddOutlined,
  BlockOutlined,
  FileTextOutlined,
  InfoCircleFilled,
  LayoutOutlined,
  LineChartOutlined,
  TableOutlined,
} from '@ant-design/icons';

interface Props {
  onChange?: any;
}

const leftPanelTabs = [
  {
    name: '模版',
    icon: <LayoutOutlined />,
    key: 'model',
    describtion: '使用基础组件组合后的复杂组件',
  },
  {
    name: '组件',
    icon: <AppstoreAddOutlined />,
    key: 'module',
    describtion: '包含常用基础元素组件',
  },
  {
    name: '表格',
    icon: <TableOutlined />,
    key: 'table',
    describtion: '包含常用表格组件',
  },
  {
    name: '表单',
    icon: <FileTextOutlined />,
    key: 'form',
    describtion: '包含常用表单组件',
  },
  {
    name: '图表',
    icon: <LineChartOutlined />,
    key: 'charts',
    describtion: '包含常用Echarts图表组件',
  },
  {
    name: '定制',
    icon: <BlockOutlined />,
    key: 'customModule',
    describtion: '对于某些项目的特殊定制组件',
  },
];

const ReactRuler: React.FC<Props> = (props: any) => {
  const { onChange, dispatch, editCardID } = props;
  const ifCanEdit = useMemo(() => {
    return location.hash?.indexOf('edit') > -1;
  }, [location.hash]);

  const horizonalGuidesRef = useRef<any>();
  const verticalGuidesRef = useRef<any>();
  const ctrlRef = useRef<any>();
  const [boxSize, setBoxSize] = useState({
    top: 20,
    left: 100,
    right: 2020,
    bottom: 1100,
  });
  const [leftSelected, setLeftSelected] = useState(1);
  const [selectedItem, setSelectedItem] = useState(0);

  const onWheelScroll = (e: any) => {
    if (ctrlRef.current) {
      console.log(e);
    }
  };
  const onKeyDown = (e: any) => {
    const { ctrlKey } = e;
    if (ctrlKey) {
      ctrlRef.current = true;
    }
  };
  const onKeyUp = (e: any) => {
    ctrlRef.current = false;
  };
  useEffect(() => {
    document.addEventListener('wheel', onWheelScroll);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
      document.removeEventListener('wheel', onWheelScroll);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  const onCancel = () => {
    dispatch({
      type: 'home/set',
      payload: {
        editCardID: '',
      },
    });
  };

  return (
    <div className={`flex-box ${styles.moveableRuler}`}>
      <div className="flex-box-start left-plugins-panel">
        <div className="left-plugins-panel-tabs-box">
          {(leftPanelTabs || [])?.map((item: any, index: number) => {
            const { name, key, icon } = item;
            return (
              <div
                className={`flex-box-center left-plugins-panel-tabs-box-item ${
                  leftSelected === index ? 'font-selected' : ''
                }`}
                key={`tab-item-${key}`}
                onClick={() => setLeftSelected(index)}
              >
                <div className="left-plugins-panel-tabs-box-item-icon">{icon}</div>
                {name}
              </div>
            );
          })}
        </div>
        <div className="left-plugins-panel-body">
          <div className="flex-box left-plugins-panel-body-describtion">
            <InfoCircleFilled />
            {leftPanelTabs?.[leftSelected]?.describtion}
          </div>
        </div>
      </div>
      <div
        id="moveableBox"
        className="moveable-ruler-left-box"
        onWheel={(e) => {
          const deltaX = e.deltaX;
          const deltaY = e.deltaY;
          const scrollX = horizonalGuidesRef.current.getRulerScrollPos() + deltaX;
          const scrollY = verticalGuidesRef.current.getRulerScrollPos() + deltaY;

          horizonalGuidesRef.current.scrollGuides(scrollY);
          verticalGuidesRef.current.scrollGuides(scrollX);
          horizonalGuidesRef.current.scroll(scrollX);
          verticalGuidesRef.current.scroll(scrollY);
        }}
      >
        <Guides
          ref={horizonalGuidesRef}
          className="ruler horizontal"
          type="horizontal"
          rulerStyle={{
            left: '30px',
            width: 'calc(100% - 30px)',
            height: '100%',
          }}
          defaultGuides={[boxSize.top, boxSize.bottom]}
          displayDragPos={true}
          displayGuidePos={true}
          useResizeObserver={true}
        />
        <Guides
          ref={verticalGuidesRef}
          className="ruler vertical"
          type="vertical"
          rulerStyle={{
            top: '30px',
            height: 'calc(100% - 30px)',
            width: '100%',
          }}
          defaultGuides={[boxSize.left, boxSize.right]}
          displayDragPos={true}
          displayGuidePos={true}
          useResizeObserver={true}
        />
        <div className="move-body-box">
          <MoveItem bounds={boxSize} />
        </div>
      </div>
      <NodeDetailWrapper className="right-config-panel" onSave={() => {}} onCancel={onCancel}>
        {!!editCardID ? (
          <div className="flex-box right-config-panel-tab-box">
            {['基础', '高级', '交互', '数据']?.map((item: any, index: number) => {
              return (
                <div
                  className={`right-config-panel-tab-box-item ${
                    selectedItem === index ? 'font-selected' : ''
                  }`}
                  key={`right-config-panel-tab-box-item-${index}`}
                  onClick={() => setSelectedItem(index)}
                >
                  {item}
                </div>
              );
            })}
            <div
              className="right-config-panel-tab-box-selected"
              style={{ left: `${selectedItem * 25}%` }}
            />
          </div>
        ) : (
          <div className="right-config-panel-yemian-box">
            <div className="right-config-panel-yemian-box-title">页面配置</div>
          </div>
        )}
      </NodeDetailWrapper>
    </div>
  );
};

export default connect(({ home }) => ({
  canvasLock: home.canvasLock || false,
  editCardID: home.editCardID || '',
}))(ReactRuler);
