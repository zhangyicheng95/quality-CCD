import React, { useEffect, useRef, useState } from 'react';
// @ts-ignore
import h337 from 'heatmapjs';
import * as _ from 'lodash';
import styles from '../index.module.less';

interface Props {
  data: any;
  id: any;
  setMyChartVisible?: any;
  onClick?: any;
}

const HeatMapCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let { dataValue = [], backgroundColor } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = [
      { x: '0.48', y: '0.45', value: 100 },
      { x: '0.4', y: '0.5', value: 110 },
      { x: '0.5', y: '0.55', value: 130 },
    ];
  }
  dataValue = [
    { x: '0.49', y: '0.45', value: 2 },
    { x: '0.51', y: '0.5', value: 2 },
    { x: '0.61', y: '0.55', value: 4 },
  ];
  const [chartSize, setChartSize] = useState(false);
  const dom = useRef<any>();
  const heatmapInstance = useRef<any>(null);

  useEffect(() => {
    let img: any = document.createElement('img');
    const source = backgroundColor;
    img.src = _.isString(source) ? source : source?.url;
    img.title = 'img.png';
    img.onload = (res: any) => {
      const { width = 1, height = 1 } = img;
      setChartSize(width / height > dom?.current?.clientWidth / dom?.current?.clientHeight);
    };
  }, [backgroundColor]);

  useEffect(() => {
    if (!heatmapInstance.current) {
      const chartsDom: any = document.getElementById(`echart-${id}`);
      heatmapInstance.current = h337.create({
        // 使用 h337 库创建一个热力图实例
        container: chartsDom, // 将热力图渲染到指定的容器中
        radius: 25, // 设置热力图的半径大小为 25
        maxOpacity: 0.8, // 设置热力图的最大不透明度为 0.5
        minOpacity: 0.1, // 设置热力图的最小不透明度为 0
        blur: 0.75, // 设置热力图的模糊程度为 0.75
        level: 1000, // 设置热力图的层级为 99,数值越大表示绘制越详细
      });
    }
    // 将数据传给热力图实例进行渲染
    let max = 0;
    let result: any = [];
    (dataValue || [])?.forEach((item: any) => {
      const { x, y, value } = item;
      if (max < value) {
        max = value;
      }
      result = result.concat([
        {
          ...item,
          x: dom?.current?.clientWidth * (x - 0.03),
          y: dom?.current?.clientHeight * y,
        },
        {
          ...item,
          x: dom?.current?.clientWidth * x,
          y: dom?.current?.clientHeight * y,
        },
        {
          ...item,
          x: dom?.current?.clientWidth * (x + 0.03),
          y: dom?.current?.clientHeight * y,
        },
      ]);
    });
    heatmapInstance.current?.setData?.({ max, data: result });
  }, [dataValue, dom?.current?.clientWidth, dom?.current?.clientHeight]);

  return (
    <div className={`flex-box-center ${styles.heatMapCharts}`} ref={dom}>
      <div style={{ width: '100%', height: '100%' }} id={`echart-${id}`} />
      <img
        className="heat-map-bg-box"
        src={backgroundColor}
        style={chartSize ? { width: '100%', height: 'auto' } : { width: 'auto', height: '100%' }}
      />
      {/* {(dataValue || [])?.map?.((item: any, index: number) => {
        const { x, y, num, width, height } = item;
        return (
          <div
            className="heat-map-item"
            key={`heat-map-item-${index}`}
            style={{
              top: y,
              left: x,
              opacity: Math.max(num / maxNum, 0.1),
              width,
              height,
            }}
          ></div>
        );
      })} */}
    </div>
  );
};

export default HeatMapCharts;
