import React, { useMemo } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';

interface Props {
  data: any;
  id: any;
  setMyChartVisible?: any;
  onClick?: any;
}

const StatisticCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let { dataValue, fontSize, yName, fontColor, direction, valueOnTop } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = { value: (Math.random() * 10000).toFixed(0), color: 'green' };
  }
  return (
    <div
      id={`echart-${id}`}
      className={`${styles.statisticCharts} flex-box`}
      style={{
        fontSize,
        alignItems: direction,
      }}
    >
      {valueOnTop ? null : <div className="statistic-title">{yName}</div>}
      <div
        className={`statistic-value ${
          dataValue?.color === 'red' ? 'NG-font' : dataValue?.color === 'green' ? 'OK-font' : ''
        }`}
        style={Object.assign(
          {
            fontSize: Number(fontSize) + 10,
          },
          !!dataValue?.color
            ? { color: dataValue?.color }
            : !!fontColor && !!fontColor?.rgb
            ? {
                color: `rgba(${fontColor.rgb.r},${fontColor.rgb.g},${fontColor.rgb.b},${fontColor.rgb.a})`,
              }
            : {},
        )}
      >
        {_.isString(dataValue)
          ? dataValue
          : !!dataValue?.value
          ? dataValue?.value
          : JSON.stringify(dataValue)}
      </div>
      {valueOnTop ? (
        <div
          className="statistic-title"
          style={{
            fontSize: fontSize - 16,
          }}
        >
          {yName}
        </div>
      ) : null}
    </div>
  );
};

export default StatisticCharts;
