import React, { Fragment, useEffect, useState } from 'react';
import Moveable from 'react-moveable';
import ImgCharts from '@/pages/home/components/Canvas/components/ImgCharts';
import { guid } from '@/utils/utils';
import { connect } from 'umi';
import StatisticCharts from '@/pages/home/components/Canvas/components/StatisticCharts';

interface Props {
  bounds?: any;
}

const MoveItem: React.FC<Props> = (props: any) => {
  const { bounds, dispatch, editCardID } = props;
  const [dataList, setDataList] = useState([
    { name: 'target', x: 100, y: 20, width: 300, height: 200, type: '' },
    { name: 'target1', x: 100, y: 800, width: 620, height: 300, type: 'statistic' },
    { name: 'target2', x: 620, y: 20, width: 300, height: 200, type: '' },
  ]);
  let [snapContainer, setSnapContainer] = useState<any>(null);

  useEffect(() => {
    setSnapContainer(document.querySelector('.main'));
  }, []);
  // 点击
  const handelClick = (name: string, e: any) => {
    dispatch({
      type: 'home/set',
      payload: {
        editCardID: name,
      },
    });
    e.preventDefault();
    e.stopPropagation();
  };
  // 拖拽
  function handleDragStart(e: any) {
    // e.set(frame.translate);
  }
  function handleDrag(e: any) {
    // frame.translate = e.beforeTranslate;
    // e.target.style.transform = `translate(${e.beforeTranslate[0]}px, ${e.beforeTranslate[1]}px) rotate(${frame.rotate}deg)`;
  }
  function handleDragEnd(e: any) {
    const { target, isDrag, clientX, clientY } = e;
    console.log('onDragEnd', target, isDrag);
  }
  // 缩放
  function handleResizeStart(e: any) {
    e.setOrigin(['%', '%']);
    e.dragStart;
    // e.dragStart.set(frame.translate);
  }
  function handleResize(e: any) {
    const beforeTranslate = e.drag.beforeTranslate;
    // frame.translate = beforeTranslate;
    e.target.style.width = `${e.width}px`;
    e.target.style.height = `${e.height}px`;
    e.target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
  }
  // 旋转
  function handleRotateStart(e: any) {
    // e.set(frame.rotate);
  }
  function handleRotate(e: any) {
    // frame.rotate = e.beforeRotate;
    // target.style.transform = `translate(${frame.translate[0]}px, ${frame.translate[1]}px) rotate(${e.beforeRotate}deg)`;
  }
  return (
    <div
      className="main"
      style={{ height: '100%', width: '100%' }}
      onClick={() => {
        dispatch({
          type: 'home/set',
          payload: {
            editCardID: '',
          },
        });
      }}
    >
      {(dataList || [])?.map((item: any, index: number) => {
        const { name, x, y, width, height, type } = item;
        const target = `.${name}`;
        return (
          <Fragment key={index}>
            <div
              className={`flex-box-center move-item ${name}`}
              style={{
                height,
                width,
                left: x,
                top: y,
              }}
              onClick={(e) => handelClick(name, e)}
            >
              {type === 'statistic' ? (
                <StatisticCharts
                  id={guid()}
                  data={{
                    dataValue: undefined,
                    fontSize: 32,
                    yName: '标题啊啊啊',
                    fontColor: '',
                    direction: '',
                    valueOnTop: '',
                  }}
                />
              ) : (
                <ImgCharts
                  id={guid()}
                  data={{
                    dataValue: undefined,
                    fontSize: 32,
                  }}
                />
              )}
            </div>
            <Moveable
              target={target} // moveable的对象
              draggable={editCardID === name} // 是否可以拖拽
              padding={{ left: 0, top: 0, right: 0, bottom: 0 }} // padding距离
              zoom={editCardID === name ? 0.6 : 0} // 缩放包裹的moveable
              origin={false} // 显示中心点
              throttleDrag={0} // 拖拽阈值 达到这个值才执行拖拽
              // onDragStart={handleDragStart} // 拖动开始执行
              // onDrag={handleDrag} // 拖动中
              // onDragEnd={handleDragEnd}
              snappable={true} // 是否初始化磁吸功能
              snapContainer={snapContainer} // 磁吸功能的容器
              bounds={bounds} // 边界点
              resizable={{
                renderDirections: true,
              }} // 是否可以缩放
              edgeDraggable // 是否通过拖动边缘线移动
              throttleResize={0} //  缩放阈值
              renderDirections={['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']} // 变化的点
              edge //resize,scale是否支持通过边框操作
              // onResizeStart={handleResizeStart} // 缩放开始时
              // onResize={handleResize} // 缩放中
              rotatable={{
                renderDirections: true,
              }} // 旋转
              throttleRotate={0} // 旋转阈值
              rotationPosition={'top'} // 旋转方向
              // onRotateStart={handleRotateStart} // 旋转开始时
              // onRotate={handleRotate} // 旋转中
              onRender={(e) => {
                e.target.style.cssText += e.cssText;
              }}
            />
          </Fragment>
        );
      })}
    </div>
  );
};

export default connect(({ home, themeStore }) => ({
  started: home.started || false,
  editCardID: home.editCardID || '',
}))(MoveItem);
