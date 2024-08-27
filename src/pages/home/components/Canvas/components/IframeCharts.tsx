import React from 'react';
import * as _ from 'lodash';
import styles from '../index.module.less';

interface Props {
  data: any;
  id: any;
  setMyChartVisible?: any;
  onClick?: any;
}

const IframeCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let {
    dataValue = [], xName = '', ifOnShowTab,
  } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = '';
  }
  if (!ifOnShowTab) return null;
  return (
    <div id={`echart-${id}`} className={`flex-box ${styles.iframeCharts}`}>
      <iframe
        src={xName?.indexOf('http') > -1 ? xName : `http://${xName}`}
        frameBorder="0"
      ></iframe>
    </div>
  );
};

export default IframeCharts;
