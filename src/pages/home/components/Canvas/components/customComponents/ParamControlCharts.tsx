import React, { useEffect } from 'react';
import styles from '../../index.module.less';
import * as _ from 'lodash';
import { Button, message } from 'antd';
import CustomWindowBody from '@/components/CustomWindowBody';
import { btnFetch } from '@/services/api';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const ParamControlCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let { dataValue, titleFontSize = 24, fontSize = 24, fetchType, xName } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = {
      total: {
        alias: '总产量',
        value: 1234,
      },
      flowerNumber: {
        alias: '每单花篮数(自换)',
        value: 123,
      },
      today: {
        alias: '当班产量',
        value: 234,
      },
      picNumber: {
        alias: '每单进片数(自换)',
        value: 134,
      },
      todayCapacity: {
        alias: '当前产能',
        value: 124,
      },
      piecesPerNumber: {
        alias: '每单进料片数',
        value: 1234,
      },
      totalInPiecesNumber: {
        alias: '总进料片数',
        value: 123,
      },
      orderPiecesPerNumber: {
        alias: '每单分选片数',
        value: 234,
      },
      totalOutPiecesNumber: {
        alias: '总出料片数',
        value: 134,
      },
      pieceInterval: {
        alias: '片间隔时间',
        value: 124,
      },
      totalPiecesPerNumber: {
        alias: '总分选片数',
        value: 124,
      },
    };
  }

  useEffect(() => {}, []);
  const onSubmit = () => {
    btnFetch(fetchType, xName, { data: '' }).then((res: any) => {
      if (!!res && res.code === 'SUCCESS') {
      } else {
        message.error(res?.msg || res?.message || '接口异常');
      }
    });
  };

  return (
    <div
      id={`echart-${id}`}
      className={`${styles.paramControlCharts}`}
      style={{ fontSize: titleFontSize }}
    >
      <CustomWindowBody title="生产统计" style={{ fontSize }}>
        <div className="param-control-item-box">
          {Object.entries(dataValue)?.map((item: any, index: number) => {
            const { alias, value } = item[1];
            return (
              <div
                className="flex-box param-control-item"
                key={`param-control-item-${item[0]}`}
                style={index + 1 === Object.entries(dataValue)?.length ? { marginBottom: 0 } : {}}
              >
                <div className="param-control-item-title">{alias} :</div>
                <div className="param-control-item-value">{value}</div>
              </div>
            );
          })}
          <div className="flex-box param-control-item">
            <div className="param-control-item-title" />
            <Button
              type="primary"
              className="param-control-item-value"
              style={{ width: '100%' }}
              onClick={() => onSubmit()}
            >
              清零
            </Button>
          </div>
        </div>
      </CustomWindowBody>
    </div>
  );
};

export default ParamControlCharts;
