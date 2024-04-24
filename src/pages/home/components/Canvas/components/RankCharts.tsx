import React, { useEffect, useMemo } from 'react';
import { Descriptions, message, Progress } from 'antd';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { useModel } from 'umi';
import { guid } from '@/utils/utils';

interface Props {
  data: any;
  id: any;
}
const lineColorList = {
  0: 'rgba(251,74,33,1), rgba(202,75,31,0.9)',
  1: 'rgba(242,107,19,1), rgba(202,107,19,0.8)',
  2: 'rgba(247,199,27,1), rgba(245,198,24,0.8)',
};
const RankCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let { dataValue, fontSize = 20, yName = 'verse' } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = [
      { title: '缺陷名称1', value: 1234 },
      { title: '缺陷名称2', value: 1000 },
      { title: '缺陷名称3', value: 904 },
      { title: '缺陷名称4', value: 400 },
      { title: '缺陷名称5', value: 234 },
    ];
  }

  const maxValue = useMemo(() => {
    let num = 0;
    dataValue.forEach((item: any) => {
      if (num < item?.value) {
        num = item?.value;
      }
    });
    return num;
  }, [dataValue]);

  return (
    <div id={`echart-${id}`} className={`${styles.rankCharts}`} style={{ fontSize }}>
      {(dataValue || [])
        ?.sort((a: any, b: any) => (yName === 'verse' ? b.value - a.value : a.value - b.value))
        ?.map?.((item: any, index: number) => {
          const { title, value } = item;
          return (
            <div
              className="flex-box rank-charts-item-box"
              style={index + 1 === dataValue?.length ? { marginBottom: 0 } : {}}
              key={`rank-charts-item-box-${index}`}
            >
              <div
                className="flex-box-center rank-charts-item-box-icon"
                style={{
                  width: Math.max(fontSize * 2, 24),
                  height: Math.max(fontSize * 2, 24),
                  backgroundImage: `linear-gradient(to right, ${
                    lineColorList[index] || 'rgba(39,90,235,0.8), rgba(41,100,200,1)'
                  })`,
                }}
              >
                {index + 1}
              </div>
              <div className="rank-charts-item-box-right">
                <div className="flex-box-justify-between rank-charts-item-box-right-title">
                  <div> {title}</div>
                  {value}
                </div>
                <Progress
                  strokeColor={
                    index < 3
                      ? { from: 'rgba(251,225,51,0.8)', to: 'rgba(247,186,32,1)' }
                      : {
                          from: 'rgba(39,97,235,0.8)',
                          to: 'rgba(56,200,234,0.8)',
                        }
                  }
                  percent={(value / maxValue) * 100}
                  showInfo={false}
                  trailColor="rgba(144,144,144,0.5)"
                  status="active"
                />
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default RankCharts;
