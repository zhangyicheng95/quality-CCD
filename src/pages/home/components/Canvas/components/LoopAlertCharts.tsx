import React, { useEffect, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { Alert, message } from 'antd';
import Marquee from 'react-fast-marquee';

interface Props {
  data: any;
  id: any;
}
// 状态组件
const LoopAlertCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let {
    dataValue = {}, fontSize = 12,
  } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = { type: 'error', value: "I can be a React component, multiple React components, or just some text." };
  }

  return (
    <div id={`echart-${id}`} className={`flex-box ${styles.loopAlertCharts}`} style={{ fontSize }}>
      <Alert
        banner
        type={dataValue?.type || "info"}
        message={
          <Marquee pauseOnHover gradient={false}>
            {dataValue?.value}
          </Marquee>
        }
      />
    </div>
  );
};

export default LoopAlertCharts;
