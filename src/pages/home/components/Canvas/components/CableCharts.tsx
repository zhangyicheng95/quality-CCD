import React, { useEffect, useMemo, useRef, useState } from 'react';
import _ from 'lodash';
import { Button, Form, message, Modal, Tooltip } from 'antd';
import styles from '../index.module.less';
import options from './commonOptions';
import { connect } from 'umi';
import ImgCharts from './ImgCharts';

interface Props {
  data: any;
  id: any;
  setMyChartVisible?: any;
  onClick?: any;
}
const localData = {
  length: 120,
  defects: [
    {
      position: '上',
      length: 10,
      type: '[漆粒子｜划伤]',
      url: 'https://th.bing.com/th/id/R.22ae499c7c99289ef333b02bf640b822?rik=MkOhaz4Fe4DSQg&riu=http%3a%2f%2fwww.fdbusiness.com%2fwp-content%2fuploads%2f2015%2f06%2fSternMaidJune2015-680x365_c.jpg&ehk=zuoZKfrcto%2f0INs9UHPLw9HILlz%2fzPB6GGfRKFQPiHk%3d&risl=&pid=ImgRaw&r=0',
    },
    {
      position: '上',
      length: 20,
      type: '[漆粒子｜划伤]',
      url: 'http://localhost:8866/123.jpg',
    },
    {
      position: '上',
      length: 40,
      type: '[漆粒子｜划伤]',
      url: 'http://localhost:8866/123.jpg',
    }
  ]
};
const CableCharts: React.FC<Props> = (props: any) => {
  const [form] = Form.useForm();
  let { data = {}, id, started } = props;
  let {
    dataValue = process.env.NODE_ENV === 'development' ? localData : {},
    fontSize = 20,
    yName = '',
    ifOnShowTab,
  } = data;
  // 变量
  let x = 0,
    y = 0,
    scale = 1,
    ulWidth = 0,
    ulHeight = 0,
    minScale = 1,
    maxScale = 10; // 用于计算diff
  let isDown = false, // 按下标识
    diff = { x: 0, y: 0 }, // 相对于上一次lastPointermove移动差值
    lastPointermove = { x: 0, y: 0 }; // 用于计算diff
  const dom = useRef<any>(null);
  const timeboxRef = useRef<any>(null);
  const [visible, setVisible] = useState(false);
  const [visibleData, setVisibleData] = useState<any>(null);
  const [dataSource, setDataSource] = useState<any>({});
  const [selectLook, setSelectLook] = useState(false);
  const [scaleNum, setScaleNum] = useState(1);

  useEffect(() => {
    if (selectLook) {
      return;
    }
    if (process.env.NODE_ENV === 'development') {
      setDataSource(localData);
    } else {
      setDataSource(dataValue);
    }
  }, [dataValue, selectLook]);

  useEffect(() => {
    const ul: any = dom?.current;
    if (!ul) return;
    ul.onmousedown = function (e: any) {
      console.log(scale);

      if (scale === 1) {
        return;
      } else {
        // e.preventDefault();
        // e.stopPropagation();
        isDown = true;
        lastPointermove = { x: e.clientX, y: e.clientY };
      }
    };
    // 绑定鼠标移动
    // ul.onmousemove = function (e: any) {
    //   console.log(scale);

    //   if (!ul?.clientWidth || scale === 1) return;
    //   e.preventDefault();
    //   e.stopPropagation();
    //   if (isDown) {
    //     const current1 = { x: e.clientX, y: e.clientY };
    //     diff.x = current1?.x - lastPointermove?.x;
    //     diff.y = current1.y - lastPointermove.y;
    //     lastPointermove = { x: current1?.x, y: current1.y };
    //     x += diff?.x;
    //     y += diff.y;
    //     //边界判断
    //     let offsetX = Math.min(
    //       Math.max(x, ulWidth - (ulWidth * (scale + 1)) / 2),
    //       (+ulWidth * (scale - 1)) / 2,
    //     );
    //     let offsetY = Math.min(
    //       Math.max(y, ulHeight - (ulHeight * (scale + 1)) / 2),
    //       (+ulHeight * (scale - 1)) / 2,
    //     );
    //     console.log(scale, offsetX);

    //     ul.style.transform = `matrix(${scale}, 0, 0, ${scale}, ${offsetX}, ${offsetY})`;
    //   }
    // };
    // ul.onmouseup = function () {
    //   //如果按下时间不到300毫秒便弹起，
    //   ul.onmousemove = null;
    //   isDown = false;
    // };
  }, []);
  const onTimeboxChange = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (scale > 1) {
      const current1 = { x: e.clientX, y: e.clientY };
      diff.x = current1?.x - lastPointermove?.x;
      diff.y = current1.y - lastPointermove.y;
      lastPointermove = { x: current1?.x, y: current1.y };
      x += diff?.x;
      y += diff.y;
      //边界判断
      let offsetX = Math.min(
        Math.max(x, ulWidth - (ulWidth * (scale + 1)) / 2),
        (+ulWidth * (scale - 1)) / 2,
      );
      let offsetY = Math.min(
        Math.max(y, ulHeight - (ulHeight * (scale + 1)) / 2),
        (+ulHeight * (scale - 1)) / 2,
      );
      console.log(scale, offsetX);

      dom.current.style.transform = `matrix(${scale}, 0, 0, ${scale}, ${offsetX}, ${offsetY})`;
    }
    return;




    e.preventDefault();
    e.stopPropagation();
    const transform0 = Number(e.target?.style?.transform?.split('matrix(')?.[1]?.split(',')?.[0] || "1");
    const transform4 = Number(e.target?.style?.transform?.split('matrix(')?.[1]?.split(',')?.[4] || "0");
    console.log(e.target?.style?.transform);

    if (transform0 === 1) {
      return;
    };
    const current1 = { x: e.clientX, y: e.clientY };
    diff.x = current1?.x - lastPointermove?.x;
    diff.y = current1.y - lastPointermove.y;
    lastPointermove = { x: current1?.x, y: current1.y };
    x += diff?.x;
    y += diff.y;
    //边界判断
    let offsetX = Math.min(
      Math.max(x, ulWidth - (ulWidth * (scale + 1)) / 2),
      (+ulWidth * (scale - 1)) / 2,
    );
    let offsetY = Math.min(
      Math.max(y, ulHeight - (ulHeight * (scale + 1)) / 2),
      (+ulHeight * (scale - 1)) / 2,
    );
    // dom.current.style.transform = `matrix(${transform0}, 0, 0, ${transform0}, ${transform4 + marginLeft}, ${offsetY})`;

  };
  useEffect(() => {
    dom?.current?.addEventListener('wheel', onScale);
    dom?.current?.addEventListener('mousedown', function (e: any) {
      isDown = true;
      lastPointermove = { x: e.clientX, y: e.clientY };
      dom?.current?.addEventListener('mousemove', onTimeboxChange);
    });
    dom?.current?.addEventListener('mouseup', function (e: any) {
      dom?.current?.removeEventListener('mousemove', onTimeboxChange);
    });
    dom?.current?.addEventListener('mouseleave', function (e: any) {
      dom?.current?.removeEventListener('mousemove', onTimeboxChange);
    });

    return () => {
      dom?.current?.removeEventListener('wheel', onScale);
      // dom?.current?.removeEventListener('mousedown', function (e: any) { });
      // dom?.current?.removeEventListener('mouseup', function (e: any) { });
      // dom?.current?.removeEventListener('mouseleave', function (e: any) { });
    }
  }, []);

  const onCancel = () => {
    setVisibleData(null);
    setVisible(false);
  }
  const onScale = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    let ratio = 1.1;
    // 缩小
    if (e.deltaY > 0) {
      ratio = 1 / 1.1;
    }
    // 限制缩放倍数
    const onscale = scale * ratio;
    if (onscale > maxScale) {
      ratio = maxScale / scale;
      scale = maxScale;
    } else if (onscale < minScale) {
      ratio = minScale / scale;
      scale = minScale;
    } else {
      scale = onscale;
    }
    const origin = {
      x: (ratio - 1) * dom?.current.clientWidth * 0.5,
      y: (ratio - 1) * dom?.current.clientHeight * 0.5,
    };
    // 计算偏移量
    let bounds = dom?.current?.getBoundingClientRect();
    const marginLeft = e.pageX - bounds.left;
    x -= (ratio - 1) * (e.clientX - x - marginLeft) - origin?.x;
    let offsetX = Math.min(
      Math.max(x, dom?.current.clientWidth - (dom?.current.clientWidth * (scale + 1)) / 2),
      (dom?.current.clientWidth * (scale - 1)) / 2,
    );
    let offsetY = Math.min(
      Math.max(y, dom?.current.clientHeight - (dom?.current.clientHeight * (scale + 1)) / 2),
      (+dom?.current.clientHeight * (scale - 1)) / 2,
    );
    x = offsetX;
    y = offsetY;
    console.log('缩放倍数', scale);
    console.log('缩放位置', offsetX);
    setScaleNum(scale);
    dom.current.style.transform = `matrix(${scale}, 0, 0, ${scale}, ${offsetX}, ${offsetY})`;
  }
  if (!ifOnShowTab) return null;
  return (
    <div id={`echart-${id}`} className={`flex-box-column ${styles.cableCharts}`} style={{ fontSize }}>
      <div className="flex-box-column cable-box-left">
        <div className="flex-box cable-box-left-item">
          {
            !!yName ?
              <div className="cable-box-left-item-title">
                {yName}
              </div>
              : null
          }
          <div
            className="flex-box cable-box-left-item-line"
            ref={dom}
            onMouseOver={() => {
              setSelectLook(true);
            }}
            onMouseLeave={() => {
              setSelectLook(false);
            }}
          >
            {
              (dataSource?.defects || [])?.map((defect: any, cIndex: number) => {
                const { position, length, type } = defect;
                return <Tooltip
                  key={`cable-box-left-item-line-point-${cIndex}`}
                  getPopupContainer={(node) => {
                    if (node && node.parentNode) {
                      return node.parentNode as HTMLElement;
                    }
                    return node;
                  }}
                  title={<div>
                    <div>方位：{position}</div>
                    <div>距离：{length}米</div>
                    <div>缺陷：{type}</div>
                  </div>}
                >
                  <div
                    className="cable-box-left-item-line-point"
                    style={{
                      left: `${length / dataSource.length * 100}%`,
                      backgroundColor: options.color?.[cIndex]
                    }}
                    onClick={() => {
                      setVisibleData(defect);
                      setVisible(true);
                    }}
                  ></div>
                </Tooltip>
              })
            }
          </div>
        </div>
      </div>
      {/* <div className="flex-box cable-box-right">
        <div
          className="cable-box-right-timebox"
          ref={timeboxRef}
          style={{ width: '100%', marginLeft: '0%' }}
        />

      </div> */}
      {
        // 每个缺陷
        !!visible ? (
          <Modal
            title={`[${visibleData?.position}]-[${visibleData?.length}米]-${visibleData?.type}`}
            width="calc(100vw - 48px)"
            wrapClassName={'full-screen-modal'}
            centered
            footer={null}
            open={!!visible}
            onOk={() => {
              onCancel()
            }}
            onCancel={() => onCancel()}
          >
            <ImgCharts
              id={`${id.split('$$')[0]}$$1$$alertImg`}
              data={{
                dataValue: visibleData?.url || undefined,
                notLocalStorage: true,
                comparison: false,
                magnifier: true,
                magnifierSize: 4,
                ifOnShowTab: true
              }}
            />
          </Modal>
        ) : null
      }
    </div>
  );
};

export default connect(({ home, themeStore }) => ({
  started: home.started || false,
}))(CableCharts);
