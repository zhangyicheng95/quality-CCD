import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import options from './commonOptions';
import * as _ from 'lodash';
import { message } from 'antd';
import styles from '../index.module.less';

interface Props {
  data: any;
  id: any;
  setMyChartVisible?: any;
  onClick?: any;
}

const HeatMapCharts: React.FC<Props> = (props: any) => {
  let myChart: any = null;
  const { data = {}, id } = props;
  let { dataValue = [], backgroundColor } = data;
  if (process.env.NODE_ENV === 'development') {
  }

  const [chartSize, setChartSize] = useState(false);
  const dom = useRef<any>();

  useEffect(() => {
    let img: any = document.createElement('img');
    const source = backgroundColor;
    img.src = _.isString(source) ? source : source?.url;
    img.title = 'img.png';
    img.onload = (res: any) => {
      const { width = 1, height = 1 } = img;
      setChartSize(width / height > dom?.current?.clientWidth / dom?.current?.clientHeight);
    };
  }, []);

  return (
    <div className={`${styles.heatMapCharts}`} ref={dom}>
      <div style={{ width: '100%', height: '100%' }} id={`echart-${id}`} />
      <img
        className="car-bg-box"
        src={backgroundColor}
        style={chartSize ? { width: '100%', height: 'auto' } : { width: 'auto', height: '100%' }}
      />
    </div>
  );
};

export default HeatMapCharts;
