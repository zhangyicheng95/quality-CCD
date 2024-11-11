import React from 'react';
import styles from '../../index.module.less';
import * as _ from 'lodash';
import CustomWindowBody from '@/components/CustomWindowBody';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const ModuleStatusCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let { dataValue, titleFontSize = 24, fontSize = 20 } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = [
      {
        title: '3D',
        value: [
          { name: 'L', status: 'success' },
          { name: 'M', status: 'success' },
          { name: 'R', status: 'success' },
        ],
      },
      { title: '面阵', value: [{ name: 'ADT', status: 'success' }] },
      {
        title: '脏污',
        value: [
          { name: 'T', status: 'error' },
          { name: 'B', status: 'success' },
        ],
      },
      { title: '隐裂', value: [{ name: 'NT', status: 'error' }] },
      {
        title: '侧边',
        value: [
          { name: 'XA', status: 'warning' },
          { name: 'XB', status: 'success' },
          { name: 'YA', status: 'error' },
          { name: 'YB', status: 'success' },
        ],
      },
      { title: '电阻率', value: [{ name: 'RDT', status: 'error' }] },
      {
        title: '孔洞',
        value: [
          { name: 'T', status: 'warning' },
          { name: 'B', status: 'success' },
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
      <CustomWindowBody title="模块状态" style={{ fontSize }} titleFontSize={titleFontSize}>
        {(dataValue || [])?.map?.((item: any, index: number) => {
          const { title, value } = item;
          return (
            <div className="flex-box connect-status-item" key={`connect-status-item-${index}`}>
              <div className="connect-status-item-title">{title}-</div>
              <div className="flex-box connect-status-item-value">
                {(value || [])?.map?.((itemSec: any, indexSec: number) => {
                  const { name, status } = itemSec;
                  return (
                    <div
                      key={`connect-status-item-value-item-${indexSec}`}
                      className={`connect-status-item-value-item ${_.lowerCase(status)}`}
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

export default ModuleStatusCharts;
