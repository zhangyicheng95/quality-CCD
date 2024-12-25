import React, { useEffect, useState, useRef } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { message, Select } from 'antd';
import { FrownOutlined, SmileOutlined } from '@ant-design/icons';
import { guid } from '@/utils/utils';
import { btnFetch } from '@/services/api';
import { connect } from 'umi';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}
// 状态组件
const SelectCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id, started } = props;
  let {
    dataValue = [], fontSize = 12, fetchType, xName, yName, ifNeedAllow, timeSelectDefault
  } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = [
      { label: '第一个', value: 1 },
      { label: '第二个', value: 2 },
      { label: '第三个', value: 3 }
    ];
  };
  const domRef = useRef<any>(null);

  useEffect(() => {
    if (!_.isArray(dataValue)) {
      message.error('下拉选择框窗口数据格式不正确，请检查');
      console.log('SelectCharts:', dataValue);
      return;
    }
  }, [JSON.stringify(dataValue)]);

  return (
    <div id={`echart-${id}`} className={styles.selectCharts} ref={domRef} style={{ fontSize }}>
      <Select
        mode={ifNeedAllow ? "multiple" : undefined}
        disabled={!started}
        style={{ height: domRef?.current?.clientHeight, lineHeight: domRef?.current?.clientHeight }}
        options={timeSelectDefault || dataValue}
        onChange={(e) => {
          btnFetch('post', xName, { data: e });
        }}
      />
    </div>
  );
};

export default connect(({ home, themeStore }) => ({
  started: home.started || false,
}))(SelectCharts);
