import React, { Fragment, useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import options from './commonOptions';
import * as _ from 'lodash';
import { useModel } from 'umi';
import { message } from 'antd';
import { ExpandOutlined } from '@ant-design/icons';

interface Props {
  data: any;
  id: any;
  setMyChartVisible?: any;
  onClick?: any;
}

const PointCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id, setMyChartVisible } = props;
  let { dataValue = [], yName, xName = '', direction, symbol = 'rect', dataZoom, ifShowColorList } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = [
      {
        name: 'data1',
        value: [
          [10.0, 8.04],
          [8.07, 6.95],
          [13.0, 7.58],
          [9.05, 8.81],
          [11.0, 8.33],
          [14.0, 7.66],
          [13.4, 6.81],
          [10.0, 6.33],
          [14.0, 8.96],
          [12.5, 6.82],
          [9.15, 7.2],
          [11.5, 7.2],
          [3.03, 4.23],
          [12.2, 7.83],
          [2.02, 4.47],
          [1.05, 3.33],
          [4.05, 4.96],
          [6.03, 7.24],
          [12.0, 6.26],
          [12.0, 8.84],
        ],
        color: 'blue',
      },
      {
        name: 'data2',
        value: [
          [21.0, 8.33],
          [24.0, 7.66],
          [23.4, 6.81],
          [20.0, 6.33],
          [24.0, 8.96],
          [22.5, 6.82],
          [19.15, 7.2],
          [21.5, 7.2],
          [13.03, 4.23],
          [22.2, 7.83],
          [12.02, 4.47],
          [11.05, 3.33],
          [14.05, 4.96],
          [16.03, 7.24],
          [22.0, 6.26],
          [22.0, 8.84],
          [17.08, 5.82],
          [15.02, 5.68],
        ],
        color: 'red',
      },
      { name: '下限', value: 1.53, type: 'markLine', color: 'green' },
    ];
  }
  const { initialState } = useModel<any>('@@initialState');
  const { params } = initialState;
  const domRef = useRef<any>();
  const myChartRef = useRef<any>();

  useEffect(() => {
    myChartRef.current = echarts.init(domRef.current);

    return () => {
      window.removeEventListener(
        'resize',
        () => {
          myChartRef.current.resize({
            width: domRef.current.clientWidth,
            height: domRef.current.clientHeight,
          });
        },
        false,
      );
      myChartRef.current && myChartRef.current.dispose();
    };
  }, []);
  const init = () => {
    if (!dataValue?.length) {
      return;
    };
    let maxLength = 0;
    dataValue?.forEach?.((item: any) => {
      const { value = [] } = item;
      if (_.isArray(value)) {
        (value || []).forEach?.((val: any) => {
          if (val[0] > maxLength) {
            maxLength = val[0];
          }
        });
      }
    });

    const option = Object.assign({}, options, {
      // color: ["rgb(115,171,216)", "rgb(245,142,94)"],
      legend: Object.assign({}, options.legend, {
        itemHeight: 8,
      }),
      grid: Object.assign(
        {},
        options.grid,
        {
          right: `${xName?.length * (xName?.length < 4 ? 24 : 16)}px`,
        },
        direction === 'rows' ? { left: ifShowColorList ? 30 : 15 } : { bottom: ifShowColorList ? 30 : 15 },
      ),
      yAxis: Object.assign({}, options.yAxis, {
        type: 'value', //direction === 'rows' ? 'category' : 'value',
        name: direction === 'rows' ? xName : yName,
        boundaryGap: false, //['5%', '5%'],
        axisLabel: Object.assign({}, options?.xAxis?.axisLabel, {
          formatter: function (val: any) {
            return val;
          },
        }),
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitNumber: 3,
        scale: false,
      }),
      dataZoom: ifShowColorList ? [
        Object.assign(
          {
            type: 'slider',
            show: true,
            realtime: true,
            start: !!dataZoom ? ((maxLength - dataZoom) / maxLength) * 100 : 0,
            end: 100,
            showDetai: false,
            moveHandleStyle: {
              opacity: 0,
            },
          },
          direction === 'rows'
            ? {
              orient: 'vertical',
              left: 10,
              top: 80,
              bottom: 60,
              width: 20,
            }
            : {
              orient: 'horizontal',
              bottom: 15,
              left: 80,
              right: 60,
              height: 20,
            },
        ),
      ] : [],
      xAxis: Object.assign({}, options?.xAxis, {
        axisLabel: Object.assign({}, options?.xAxis?.axisLabel, {
          formatter: function (val: any) {
            return val;
          },
        }),
        boundaryGap: false,
        splitNumber: 3,
        splitLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        type: 'value', //direction === 'rows' ? 'value' : 'category',
        name: direction === 'rows' ? yName : xName,
        scale: false,
      }),
      seriesLayoutBy: 'row',
      series: (dataValue || [])?.map?.((item: any) => {
        const { name, value, type } = item;
        if (type === 'markLine') {
          return {
            symbolSize: 1,
            name: name,
            type: 'scatter',
            tooltip: {
              show: false,
            },
            markLine: {
              symbolSize: 1,
              lineStyle: {
                width: 1,
              },
              data: [
                { type: 'average', name: name },
                direction === 'rows' ? { yAxis: value } : { xAxis: value },
              ],
            },
          };
        } else {
          return {
            symbolSize: 8,
            symbol: symbol || 'rect', //散点形状设置symbol: circle 圆, rect 方, roundRect 圆角方, triangle 三角, diamond 菱形, pin 气球, arrow 箭头
            name: name,
            // color: color,
            type: 'scatter',
            data: _.cloneDeep(value)?.map?.((item: any) => {
              if (direction === 'rows') {
                return _.cloneDeep(item).reverse();
              }
              return item;
            }),
          };
        }
      }),
    });
    myChartRef.current.setOption(option);
    myChartRef.current.resize({
      width: domRef.current.clientWidth,
      height: domRef.current.clientHeight,
    });
    myChartRef.current.on('dataZoom', function (event: any) {
      // const { start, end } = event;
    });
    window.addEventListener(
      'resize',
      () => {
        myChartRef.current.resize({
          width: domRef.current.clientWidth,
          height: domRef.current.clientHeight,
        });
      },
      false,
    );
  };
  useEffect(() => {
    if (!_.isArray(dataValue)) {
      message.error('散点图数据格式不正确，请检查');
      console.log('PointCharts:', dataValue);
      return;
    }

    setTimeout(() => {
      init();
    }, 200);
  }, [data]);

  return (
    <Fragment>
      <div style={{ width: '100%', height: '100%' }} id={`echart-${id}`} ref={domRef} />
      <div className="preview-box flex-box-center">
        <ExpandOutlined
          className="preview-icon"
          onClick={() => {
            if (!!myChartRef.current) {
              const options = myChartRef.current?.getOption?.();
              setMyChartVisible(options);
            }
          }}
        />
      </div>
    </Fragment>
  );
};

export default PointCharts;
