import React, { Fragment, useEffect } from 'react';
import * as echarts from 'echarts';
import options from './commonOptions';
import { useModel } from 'umi';
import { message } from 'antd';
import _ from 'lodash';
import { CompressOutlined } from '@ant-design/icons';

interface Props {
  data: any;
  id: any;
  setMyChartVisible?: any;
  onClick?: any;
}
const colorOption = [
  '#5470c6',
  '#91cc75',
  '#fac858',
  '#ee6666',
  '#73c0de',
  '#3ba272',
  '#fc8452',
  '#9a60b4',
  '#ea7ccc',
];
// 折线柱状混合
const BarWithLineCharts: React.FC<Props> = (props: any) => {
  let myChart: any = null;
  const { data = {}, id, setMyChartVisible } = props;
  let { dataValue = [], yName, xName = '', direction, align, barColor = [] } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = [
      { name: 'data1', value: 1.4, color: 'black' },
      { name: 'data2', value: 6.95, color: 'blue' },
      { name: 'data3', value: 0.4, color: 'black' },
      { name: 'data4', value: 3.95, color: 'blue' },
      { name: 'data5', value: 1.9, color: 'black' },
      { name: 'data6', value: 2.95, color: 'blue' },
      //   { name: '上限', value: 2.2, type: 'markLine', color: 'red' },
      //   { name: '标准值', value: 1.6, type: 'markLine', color: 'green' },
      //   { name: '下限', value: 1.53, type: 'markLine', color: 'red' },
      //   { name: '开始', value: 2.2, type: 'start' },
      //   { name: '截止', value: 2.2, type: 'end' },
    ];
  }
  const { initialState } = useModel<any>('@@initialState');
  const { params } = initialState;
  barColor = [].concat(barColor);
  useEffect(() => {
    if (!_.isArray(dataValue)) {
      message.error('折柱组合图数据格式不正确，请检查');
      console.log('BarWithLineCharts:', dataValue);
      return;
    }
    let seriesData: any = [],
      markLineData: any = [],
      yData: any = [],
      minValue: any = 0,
      maxValue: any = 0,
      threshold_start,
      threshold_end,
      max = 0;
    dataValue.forEach((item: any) => {
      const { name, value, type } = item;
      if (value > max) {
        max = value;
      }
      if (type === 'markLine') {
        markLineData = markLineData.concat(item);
      } else if (type === 'start') {
        threshold_start = value;
      } else if (type === 'end') {
        threshold_end = value;
      } else {
        seriesData = seriesData.concat(item);
        yData = yData.concat(name);
      }
      if (_.isNull(minValue) || _.isNull(maxValue)) {
        minValue = value;
        maxValue = value;
        return;
      }
      if (value < minValue) {
        minValue = value;
      }
      if (value > maxValue) {
        maxValue = value;
      }
    });

    const dom: any = document.getElementById(`echart-${id}`);
    myChart = echarts.init(dom);
    const option = Object.assign({}, options, {
      legend: {
        show: false,
      },
      grid: Object.assign(
        options.grid,
        { top: '50px' },
        align === 'right'
          ? {
              left: `${xName?.length * (xName?.length < 4 ? 24 : 16)}px`,
              right: '3%',
            }
          : {
              left: '16px',
              right: `${xName?.length * (xName?.length < 4 ? 24 : 16)}px`,
            },
      ),
      yAxis: [
        { show: false },
        {
          ...options.yAxis,
          type: direction === 'rows' ? 'category' : 'value',
          name: direction === 'rows' ? xName : yName,
          boundaryGap: ['5%', '5%'],
          axisLabel: { show: false },
          splitLine: { show: false },
          splitNumber: 3,
          scale: false,
          position: align || 'left',
          axisTick: { show: false },
          ...(direction === 'rows'
            ? { data: yData }
            : { min: threshold_start, max: threshold_end || (maxValue * 1.05).toFixed(1) }),
        },
      ],
      xAxis: Object.assign(
        {},
        options.xAxis,
        {
          axisLabel: Object.assign({}, options.xAxis?.axisLabel, {
            formatter: function (val: any) {
              return val;
            },
          }),
          type: direction === 'rows' ? 'value' : 'category',
          splitLine: { show: false },
          splitNumber: 3,
          name: direction === 'rows' ? yName : xName,
          scale: false,
          inverse: (align === 'right' && minValue >= 0) || (align === 'left' && minValue < 0),
        },
        direction === 'rows'
          ? { min: threshold_start, max: threshold_end || (maxValue * 1.05).toFixed(1) }
          : { data: yData },
      ),
      series: [
        {
          name: 'name',
          type: 'bar',
          label: {
            show: true,
            position: direction === 'rows' ? 'insideLeft' : 'insideBottom',
            formatter: '{c}',
            padding: [0, 0, 0, 12],
            fontSize: 14,
          },
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)',
          },
          data: seriesData.map((item: any, index: number) => {
            const { value, color } = item;
            var colorList = ['rgba(39,97,235,0.8)', 'rgba(56,200,234,0.8)'];
            if (params.dataIndex >= colorList.length) {
              index = params.dataIndex - colorList.length;
            }
            return {
              value: value,
              itemStyle: barColor.includes('default')
                ? { color: color }
                : barColor.includes('line')
                ? {
                    color: new echarts.graphic.LinearGradient(
                      direction === 'rows' ? 1 : 0,
                      direction === 'rows' ? 0 : 1,
                      0,
                      0,
                      [
                        {
                          offset: 0,
                          color: colorList[0],
                        },
                        {
                          offset: 1,
                          color: colorList[1],
                        },
                      ],
                    ),
                  }
                : { color: barColor[index % barColor?.length] },
            };
          }),
          markLine: {
            data: markLineData?.map((mark: any, index: number) => {
              const { value, name, color } = mark;
              return Object.assign(
                {},
                {
                  name: name,
                  type: 'median',
                  lineStyle: {
                    width: 1,
                    color: color || colorOption[index],
                  },
                  label: {
                    show: true,
                    position: 'middle',
                    distance: 5,
                    color: color || colorOption[index],
                    formatter: `${name}：${value}`,
                  },
                },
                direction === 'rows' ? { xAxis: value } : { yAxis: value },
              );
            }),
            silent: false, // 鼠标悬停事件, true悬停不会出现实线
            symbol: 'none', // 去掉箭头
          },
          ...(barColor.includes('default') ? { colorBy: 'data' } : {}),
        },
        {
          name: 'name',
          type: 'line',
          tooltip: {
            show: false,
          },
          data: seriesData.map((item: any, index: number) => {
            const { value } = item;
            return value;
          }),
        },
      ],
    });

    myChart.setOption(option);
    myChart.resize({
      width: dom.clientWidth,
      height: dom.clientHeight,
    });
    window.addEventListener(
      'resize',
      () => {
        myChart.resize({
          width: dom.clientWidth,
          height: dom.clientHeight,
        });
      },
      false,
    );

    return () => {
      window.removeEventListener(
        'resize',
        () => {
          myChart.resize({
            width: dom.clientWidth,
            height: dom.clientHeight,
          });
        },
        false,
      );
      myChart && myChart.dispose();
    };
  }, [data]);

  return (
    <Fragment>
      <div style={{ width: '100%', height: '100%' }} id={`echart-${id}`} />
      <div className="preview-box flex-box-center">
        <CompressOutlined
          className="preview-icon"
          onClick={() => {
            if (!!myChart) {
              const options = myChart?.getOption?.();
              setMyChartVisible(options);
            }
          }}
        />
      </div>
    </Fragment>
  );
};

export default BarWithLineCharts;
