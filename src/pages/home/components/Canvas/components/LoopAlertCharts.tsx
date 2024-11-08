import React, { useEffect, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { Alert, message } from 'antd';

interface Props {
  data: any;
  id: any;
}
// 状态组件
const LoopAlertCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let {
    dataValue = "", fontSize = 12,
  } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = "I can be a React component, multiple React components, or just some text.";
  }

  return (
    <div id={`echart-${id}`} className={`flex-box ${styles.loopAlertCharts}`} style={{ fontSize }}>
      <Alert
        banner
        message={
          { dataValue }
        }
      />
    </div>
  );
};

export default LoopAlertCharts;
