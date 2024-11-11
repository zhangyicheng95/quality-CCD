import React, { useEffect, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { message } from 'antd';
import { FrownOutlined, SmileOutlined } from '@ant-design/icons';
import { guid } from '@/utils/utils';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}
// 状态组件
const AlertCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let {
    dataValue = [], fontSize = 12, yName, des_layout = 'center', magnifierWidth
  } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = [{ name: 'NG', value: false, }];
  }
  const [dataList, setDataList] = useState<any>([]);

  useEffect(() => {
    if (!_.isArray(dataValue)) {
      message.error('状态窗口数据格式不正确，请检查');
      console.log('AlertCharts:', dataValue);
      return;
    }
    setDataList(dataValue?.map((i) => ({ id: guid(), ...i })));
  }, [JSON.stringify(dataValue)]);
  return (
    <div id={`echart-${id}`} className={`flex-box ${styles.alertCharts}`} style={{ justifyContent: des_layout }}>
      {
        _.isArray(dataList) ?
          (dataList || [])?.map?.((item: any, index: number) => {
            const { name, value, color } = item;
            const realColor = !!value ? '#88db57' : '#931212';
            if (yName === 'point') {
              return (
                <div
                  key={`echart-${id}-${item.id}`}
                  className={`flex-box-column alert-item-point`}
                  style={{
                    fontSize,
                    color: color || realColor
                  }}
                >
                  <div
                    className={`alert-item-point-icon`}
                    style={{
                      height: magnifierWidth,
                      width: magnifierWidth,
                      backgroundColor: color || realColor
                    }}
                  />
                  {name}
                </div>
              );
            } else {
              return (
                <div
                  key={`echart-${id}-${item.id}`}
                  className={`flex-box-center alert-item`}
                  style={Object.assign(
                    { fontSize },
                    !!color ? { backgroundColor: color } : { backgroundColor: realColor }
                  )}
                >
                  <span style={{ position: 'absolute', left: 4, top: 4, fontSize: 12 }}>{name}</span>
                  {!!value ? <SmileOutlined /> : <FrownOutlined />}
                  {!!value ? 'OK' : 'NG'}
                </div>
              );
            }
          })
          : null
      }
    </div>
  );
};

export default AlertCharts;
