import React, { useEffect, useState } from 'react';
import styles from '../../index.module.less';
import * as _ from 'lodash';
import { message } from 'antd';
import { btnFetch } from '@/services/api';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const rectList = [
  { label: '左上角', value: 'leftTop' },
  { label: '上边', value: 'top' },
  { label: '右上角', value: 'rightTop' },
  { label: '左边', value: 'left' },
  { label: '中间', value: '' },
  { label: '右边', value: 'right' },
  { label: '左下角', value: 'bottomLeft' },
  { label: '下边', value: 'bottom' },
  { label: '右下角', value: 'rightBottom' },
];
const RectRangeCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let { dataValue, fontSize = 14, fetchType, xName } = data;
  const [dataSource, setDataSource] = useState<any>([]);
  useEffect(() => {
    if (!!xName) {
      btnFetch('get', xName).then((res: any) => {
        if (!!res && res.code === 'SUCCESS') {
          setDataSource(res?.data || []);
        } else {
          message.error(res?.message || '后台服务异常，请重启服务');
        }
      });
    }
  }, []);

  useEffect(() => {
    if (!_.isEmpty(dataValue)) {
      setDataSource((prev: any) => {
        return Object.entries(prev)?.reduce((pre: any, cen: any) => {
          return {
            ...pre,
            [cen[0]]: {
              ...cen[1],
              status: dataValue[cen[0]].status || '',
            },
          };
        }, {});
      });
    }
  }, [dataValue]);

  return (
    <div id={`echart-${id}`} className={`${styles.rectRangeCharts}`} style={{ fontSize }}>
      <div className="rect-range-box">
        {(rectList || [])?.map((item: any, index: number) => {
          const { value } = item;
          const disabled = dataSource[value]?.disabled;
          const status = dataSource[value]?.status;
          return (
            <div
              className={`flex-box-center rect-range-box-item ${_.lowerCase(status)}`}
              key={`rect-range-box-item-${index}`}
              style={Object.assign(
                {},
                index % 3 === 1 ? { width: 'calc(50% - 16px)', margin: '0 8px' } : {},
                [3, 5].includes(index) ? { height: 'calc(50% - 16px)', margin: '8px 0' } : {},
                !value ? { backgroundColor: 'transparent' } : {},
              )}
              onClick={() => {
                if (!fetchType || !xName || !value) return;
                const result = {
                  ...dataSource,
                  [value]: { ...dataSource[value], disabled: !disabled },
                };
                const params = Object.entries(result).reduce((pre: any, cen: any) => {
                  return {
                    ...pre,
                    [cen[0]]: { disabled: cen[1]?.disabled || false },
                  };
                }, {});
                btnFetch(fetchType, xName, params).then((res: any) => {
                  if (res && res.code === 'SUCCESS') {
                    message.success('上传成功');
                    setDataSource(result);
                  } else {
                    message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
                  }
                });
              }}
            >
              {!value ? '' : disabled ? '开启' : '屏蔽'}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RectRangeCharts;
