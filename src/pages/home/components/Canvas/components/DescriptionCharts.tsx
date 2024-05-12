import React, { useEffect } from 'react';
import { Descriptions, message } from 'antd';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { useModel } from 'umi';
import { guid } from '@/utils/utils';

interface Props {
  data: any;
  id: any;
}

const DescriptionCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let { dataValue, basicInfoData, des_bordered, des_column, des_layout, des_size, fontSize } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = [
      {
        id: guid(),
        name: 'asdasd',
        value: '22222',
        color: '',
      },
    ];
  }

  useEffect(() => {
    if (!!dataValue && !_.isArray(dataValue)) {
      // message.error('描述组件数据格式不正确，请检查');
      console.log('DescriptionCharts:', dataValue);
      return;
    }
  }, [dataValue]);

  return (
    <div id={`echart-${id}`} className={`${styles.descriptionCharts} flex-box-center`}>
      <Descriptions
        bordered={des_bordered || false}
        column={des_column || 2}
        layout={des_layout || 'horizontal'}
        size={des_size || 'default'}
        style={{ height: '100%', width: '100%', overflowY: 'auto' }}
      >
        {basicInfoData.concat(dataValue)?.map?.((item: any, index: number) => {
          const { id = guid(), name, value, color } = item;
          if (!_.isObject(value?.[0])) {
            return (
              <Descriptions.Item
                label={name}
                key={id}
                style={Object.assign({ fontSize }, !!color ? { color } : {})}
              >
                {value}
              </Descriptions.Item>
            );
          } else {
            // @ts-ignore
            const { value, color } = item?.value[0];
            return (
              <Descriptions.Item
                label={name}
                key={id}
                style={Object.assign({ fontSize }, !!color ? { color } : {})}
              >
                {value}
              </Descriptions.Item>
            );
          }
        })}
      </Descriptions>
    </div>
  );
};

export default DescriptionCharts;
