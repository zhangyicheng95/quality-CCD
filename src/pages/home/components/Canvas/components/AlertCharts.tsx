import React, { useEffect } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { useModel } from 'umi';
import { message } from 'antd';
import { FrownOutlined, SmileOutlined } from '@ant-design/icons';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}
// 状态组件
const AlertCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let { dataValue = [], fontSize } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = [{ name: '状态1', value: false, color: 'blue' }];
  }
  const { initialState } = useModel<any>('@@initialState');
  const { params } = initialState;

  useEffect(() => {
    if (!_.isArray(dataValue)) {
      message.error('状态窗口数据格式不正确，请检查');
      console.log('AlertCharts:', dataValue);
      return;
    }
  }, [dataValue]);
  return (
    <div id={`echart-${id}`} className={`${styles.alertCharts} flex-box`}>
      {_.isArray(dataValue) &&
        (dataValue || []).map((item: any, index: number) => {
          const { name, value } = item;
          return (
            <div
              key={`echart-${id}-${index}`}
              className={`flex-box-center alert-item ${!!value ? 'OK' : 'NG'}`}
              style={{ fontSize }}
            >
              <span style={{ position: 'absolute', left: 4, top: 4, fontSize: 12 }}>{name}</span>
              {!!value ? <SmileOutlined /> : <FrownOutlined />}
              {!!value ? 'OK' : 'NG'}
            </div>
          );
        })}
    </div>
  );
};

export default AlertCharts;
