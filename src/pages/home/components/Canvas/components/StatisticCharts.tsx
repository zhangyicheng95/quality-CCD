import React from 'react';
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
  let { dataValue, fontSize, yName, fontColor, direction } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = 10;
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
      <div className="statistic-title">{yName}</div>
      <div
        className="statistic-value"
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
    </div>
  );
};

export default StatisticCharts;
