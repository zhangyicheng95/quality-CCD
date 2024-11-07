import React, { Fragment, memo, useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import styles from '../index.module.less';
import options from './commonOptions';
import * as _ from 'lodash';
import { message, Modal } from 'antd';
import LineCharts from './LineCharts';
import BarCharts from './BarCharts';
import Table2Charts from './Table2Charts';

interface Props {
  data: any;
  id: any;
  setMyChartVisible?: any;
  onClick?: any;
};

const ChartsCombinationCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id, setMyChartVisible } = props;
  let {
    dataValue = [], titleFontSize, fontSize, imgListNum,
    imgs_height, imgs_width, dataZoom,
    tableFontSize, reverse, tableSize, interlacing, des_bordered,
    headerBackgroundColor, valueColor, line_height, bodyPaddingSize, des_layout,
    yName, xName, direction, align, hiddenAxis, labelInxAxis,
    labelDirection, barRadius, showBackground, showWithLine, barColor,
  } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = [
      { name: 'name1' },
      { name: 'name2' },
      { name: 'name3' },
      { name: 'name4' },
      { name: 'name5' }
    ];
  }
  const domRef = useRef<any>();

  return (
    <div id={`echart-${id}`} className={`${styles.ChartsCombinationCharts}`} ref={domRef}>
      {
        (dataValue || [])?.map((item: any, index: number) => {
          const { name, table, line, bar } = item;
          return <div
            className="flex-box charts-combination-item"
            key={`charts-combination-item-${index}`}
            style={{ height: imgListNum, }}
          >
            <div className="charts-combination-item-name" style={{ fontSize: titleFontSize }}>
              {name}
            </div>
            <div className="charts-combination-item-table">
              <Table2Charts
                id={`${id}-table`}
                data={{
                  dataValue: table || [],
                  fontSize,
                  tableFontSize,
                  reverse,
                  tableSize,
                  interlacing,
                  des_bordered,
                  headerBackgroundColor,
                  valueColor,
                  line_height,
                  bodyPaddingSize,
                  des_layout,
                }}
              />
            </div>
            <div className="charts-combination-item-line">
              <LineCharts
                id={`${id}-line`}
                setMyChartVisible={setMyChartVisible}
                data={{
                  dataValue: line || [],
                  yName: imgs_height,
                  xName: imgs_width,
                  dataZoom
                }}
              />
            </div>
            <div className="charts-combination-item-bar">
              <BarCharts
                id={`${id}-bar`}
                setMyChartVisible={setMyChartVisible}
                data={{
                  dataValue: bar || [],
                  fontSize: 12,
                  yName,
                  xName,
                  direction,
                  align,
                  hiddenAxis,
                  labelInxAxis,
                  labelDirection,
                  barRadius,
                  showBackground,
                  showWithLine,
                  barColor,
                }}
              />
            </div>
          </div>
        })
      }
    </div>
  );
};

export default memo(ChartsCombinationCharts);