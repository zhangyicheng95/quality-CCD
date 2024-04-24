import React from 'react';
import styles from '../../index.module.less';
import * as _ from 'lodash';
import CustomWindowBody from '@/components/CustomWindowBody';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const ConnectStatusCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let { dataValue, titleFontSize = 24, fontSize = 20 } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = [
      {
        title: '3D',
        value: [
          { name: 'L', status: 1 },
          { name: 'M', status: 1 },
          { name: 'R', status: 1 },
        ],
      },
      { title: '面阵', value: [{ name: 'ADT', status: 1 }] },
      {
        title: '脏污',
        value: [
          { name: 'T', status: 1 },
          { name: 'B', status: 1 },
        ],
      },
      { title: '隐裂', value: [{ name: 'NT', status: 1 }] },
      {
        title: '侧边',
        value: [
          { name: 'XA', status: 1 },
          { name: 'XB', status: 1 },
          { name: 'YA', status: 1 },
          { name: 'YB', status: 1 },
        ],
      },
      { title: '电阻率', value: [{ name: 'RDT', status: 1 }] },
      {
        title: '孔洞',
        value: [
          { name: 'T', status: 1 },
          { name: 'B', status: 1 },
        ],
      },
    ];
  }

  return (
    <div
      id={`echart-${id}`}
      className={`${styles.connectStatusCharts}`}
      style={{ fontSize: titleFontSize }}
    >
      <CustomWindowBody title="模块状态" style={{ fontSize }}>
        {(dataValue || [])?.map((item: any, index: number) => {
          const { title, value } = item;
          return (
            <div className="flex-box connect-status-item" key={`connect-status-item-${index}`}>
              <div className="connect-status-item-title">{title}-</div>
              <div className="flex-box connect-status-item-value">
                {(value || [])?.map((itemSec: any, indexSec: number) => {
                  const { name, status } = itemSec;
                  return (
                    <div
                      key={`connect-status-item-value-item-${indexSec}`}
                      className={`connect-status-item-value-item ${
                        status === 1 ? 'success' : 'error'
                      }`}
                    >
                      {name}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </CustomWindowBody>
    </div>
  );
};

export default ConnectStatusCharts;
