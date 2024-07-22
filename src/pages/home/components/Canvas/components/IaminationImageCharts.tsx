import React, { useEffect, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { useModel } from 'umi';
import { message } from 'antd';
import { FrownOutlined, SmileOutlined } from '@ant-design/icons';
import ImgCharts from './ImgCharts';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}
// 状态组件
const IaminationImageCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let { dataValue = {}, fontSize, des_column = 3 } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = {
      0: '',
      1: '',
    };
  }
  const [dataList, setDataList] = useState({});

  useEffect(() => {
    setDataList((prev: any) => {
      return {
        ...prev,
        ...dataValue
      }
    })
  }, [dataValue]);

  return (
    <div id={`echart-${id}`} className={`flex-box-column ${styles.laminationImageCharts} flex-box`}>
      {
        Array.from({ length: des_column })?.map((i, index: number) => {
          return <div className="lamination-image-item" key={`lamination-image-item-${index}`} style={{ height: `${100 / des_column}%` }}>
            <ImgCharts
              id={`${id.split('$$')[0]}$$${index + 1}$$alertImg`}
              data={{
                dataValue: dataList[index] || undefined,
                notLocalStorage: true,
                comparison: false,
                magnifier: true,
                magnifierSize: 4,
              }}
            />
          </div>
        })
      }
    </div>
  );
};

export default IaminationImageCharts;
