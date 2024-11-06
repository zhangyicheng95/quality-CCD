import React, { Fragment, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import options from './commonOptions';
import { useModel } from 'umi';
import { message } from 'antd';
import _ from 'lodash';
import { ExpandOutlined } from '@ant-design/icons';

interface Props {
  data: any;
  id: any;
  setMyChartVisible?: any;
  onClick?: any;
}
const colorOption = [
  '#ee6666',
  '#73c0de',
  '#3ba272',
  '#fc8452',
  '#9a60b4',
  '#ea7ccc',
  '#5470c6',
  '#91cc75',
  '#fac858',
];

var colorList = ['rgba(39,97,235,0.8)', 'rgba(56,200,234,0.8)'];
var colorList2 = ['rgba(40,255,187,0.6)', 'rgba(36,222,212,0.9)'];

const BarCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id, setMyChartVisible } = props;
  let {
    dataValue = [],
    fontSize,
    yName,
    xName = '',
    direction,
    align,
    hiddenAxis,
    labelInxAxis,
    labelDirection,
    barRadius,
    showBackground,
    showWithLine,
    barColor = [],
  } = data;
  if (process.env.NODE_ENV === 'development') {
    for (let i = 0; i < 7; i++) {
      // dataValue = dataValue.concat([
      //   {
      //     name: '数据' + i,
      //     value: Math.random() * 10,
      //   },
      // ]);
    }
    dataValue = [
      {
        "name": "破损",
        "value": 6
      },
      {
        "name": "漆粒子",
        "value": 0
      },
      {
        "name": "漆瘤",
        "value": 0
      },
      {
        "name": "漆坑",
        "value": 0
      },
      {
        "name": "气泡",
        "value": 0
      },
      {
        "name": "色差",
        "value": 0
      },
      {
        "name": "色斑",
        "value": 0
      },
      {
        "name": "划伤",
        "value": 0
      }
    ];
  }
  const { initialState } = useModel<any>('@@initialState');
  const { params } = initialState;
  const domRef = useRef<any>();
  const myChartRef = useRef<any>();
  barColor = [].concat(barColor);

  useEffect(() => {
    if (!!domRef.current) {
      myChartRef.current = echarts.init(domRef.current);
    }
    return () => {
      window.removeEventListener(
        'resize',
        () => {
          myChartRef.current?.resize({
            width: domRef.current?.clientWidth,
            height: domRef.current?.clientHeight,
          });
        },
        false,
      );
      myChartRef.current && myChartRef.current?.dispose();
    };
  }, []);
  const init = () => {
    if (!dataValue?.length) {
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
    dataValue.forEach?.((item: any) => {
      const { name, value, type } = item;
      if (value > max) {
        max = _.isArray(value) ? Math.max(...value) : value;
      }
      if (type === 'markLine') {
        markLineData = markLineData.concat(item);
      } else if (type === 'start') {
        threshold_start = _.isArray(value) ? Math.min(...value) : value;
      } else if (type === 'end') {
        threshold_end = _.isArray(value) ? Math.max(...value) : value;
      } else {
        seriesData = seriesData.concat(item);
        yData = yData.concat(name);
      }
      if (_.isNull(minValue) || _.isNull(maxValue)) {
        minValue = _.isArray(value) ? Math.min(...value) : value;
        maxValue = _.isArray(value) ? Math.max(...value) : value;
        return;
      }
      if ((_.isArray(value) ? Math.min(...value) : value) < minValue) {
        minValue = _.isArray(value) ? Math.min(...value) : value;
      }
      if ((_.isArray(value) ? Math.max(...value) : value) > maxValue) {
        maxValue = _.isArray(value) ? Math.max(...value) : value;
      }
    });
    if (direction === 'rows') {
      seriesData = seriesData?.reverse?.();
      yData = yData?.reverse?.();
    };
    yData = Array.from(new Set(yData));

    const option = Object.assign({}, options, {
      legend: {
        show: false,
      },
      grid: Object.assign(
        options.grid,
        { top: '30px', bottom: '15px' },
        align === 'right'
          ? {
            left: `${xName?.length * (xName?.length < 4 ? 24 : 16)}px`,
            right: '3%',
          }
          : {
            right: `${xName?.length * (xName?.length < 4 ? 24 : 16)}px`,
          },
      ),
      yAxis: Object.assign(
        {},
        options.yAxis,
        {
          axisLabel: {
            ...options.yAxis.axisLabel,
            show: labelDirection === 'none',
            fontSize,
          },
          splitLine: {
            show: false,
          },
        },
        {
          type: direction === 'rows' ? 'category' : 'value',
          name: direction === 'rows' ? xName : yName,
          boundaryGap: 0,
          splitNumber: 3,
          scale: false,
          position: align || 'left',
          axisTick: { show: false },
        },
        direction === 'rows'
          ? { data: yData }
          : { min: threshold_start, max: threshold_end || (maxValue * 1.05).toFixed(1) },
        hiddenAxis ? { show: false } : {},
      ),
      xAxis: Object.assign(
        {},
        options?.xAxis,
        {
          axisLabel: Object.assign(
            {},
            options?.xAxis?.axisLabel,
            {
              formatter: function (val: any) {
                return val;
              },
            },
            labelInxAxis ? { inside: true, color: '#fff' } : {},
            { fontSize },
          ),
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
        hiddenAxis ? { show: false } : {},
      ),
      series: (_.isArray(seriesData?.[0]?.value) ?
        seriesData?.map((series: any, index: number) => {
          const { name, value, color } = series;
          if (params.dataIndex >= colorList.length) {
            index = params.dataIndex - colorList.length;
          }
          return {
            name: name,
            type: 'bar',
            label: {
              show: labelDirection !== 'none',
              fontFamily: 'monospace',
              borderWidth: 0,
              position:
                direction === 'rows'
                  ? labelDirection === 'top'
                    ? 'insideRight'
                    : labelDirection === 'bottom'
                      ? 'insideLeft'
                      : 'inside'
                  : labelDirection === 'top'
                    ? 'top'
                    : labelDirection === 'bottom'
                      ? 'insideBottom'
                      : 'inside',
              formatter: (params: any) => params?.value?.toFixed?.(0) || params?.value,
              fontSize,
            },
            showBackground: !!barRadius && !!showBackground,
            barMaxWidth: '10%',
            itemStyle: Object.assign(
              {},
              barColor.includes('default')
                ? { color: color || colorOption[index] }
                : barColor.includes('line1')
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
                  : barColor.includes('line2')
                    ? {
                      color: new echarts.graphic.LinearGradient(
                        direction === 'rows' ? 1 : 0,
                        direction === 'rows' ? 0 : 1,
                        0,
                        0,
                        [
                          {
                            offset: 0,
                            color: colorList2[0],
                          },
                          {
                            offset: 1,
                            color: colorList2[1],
                          },
                        ],
                      ),
                    }
                    : { color: barColor[index % barColor?.length] },
              barRadius ? { borderRadius: [100, 100, 0, 0] } : {},
            ),
            data: value,
            ...index === 0 ? {
              markLine: {
                data: markLineData?.map?.((mark: any, index: number) => {
                  const { value, name, color, position } = mark;
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
                    !!position ?
                      (position === 'x' ? { xAxis: value } : { yAxis: value }) :
                      (direction === 'rows' ? { xAxis: value } : { yAxis: value }),
                  );
                }),
                silent: false, // 鼠标悬停事件, true悬停不会出现实线
                symbol: 'none', // 去掉箭头
              }
            } : {},
            ...(barColor.includes('default') ? { colorBy: 'data' } : {}),
          };
        })
        :
        [{
          name: 'name',
          type: 'bar',
          label: {
            show: labelDirection !== 'none',
            fontFamily: 'monospace',
            borderWidth: 0,
            position:
              direction === 'rows'
                ? labelDirection === 'top'
                  ? 'insideRight'
                  : labelDirection === 'bottom'
                    ? 'insideLeft'
                    : 'inside'
                : labelDirection === 'top'
                  ? 'top'
                  : labelDirection === 'bottom'
                    ? 'insideBottom'
                    : 'inside',
            formatter: (params: any) => params?.value?.toFixed?.(0) || params?.value,
            fontSize,
          },
          stack: 'total',
          showBackground: !!barRadius && !!showBackground,
          barMaxWidth: '20%',
          data: seriesData?.map?.((item: any, index: number) => {
            const { value, color } = item;
            if (params.dataIndex >= colorList.length) {
              index = params.dataIndex - colorList.length;
            }
            console.log(barColor);

            return {
              value: value,
              itemStyle: Object.assign(
                {},
                barColor.includes('default')
                  ? { color: color }
                  : barColor.includes('line1')
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
                    : barColor.includes('line2')
                      ? {
                        color: new echarts.graphic.LinearGradient(
                          direction === 'rows' ? 1 : 0,
                          direction === 'rows' ? 0 : 1,
                          0,
                          0,
                          [
                            {
                              offset: 0,
                              color: colorList2[0],
                            },
                            {
                              offset: 1,
                              color: colorList2[1],
                            },
                          ],
                        ),
                      }
                      : { color: barColor[index % barColor?.length] },
                barRadius ? { borderRadius: [100, 100, 0, 0] } : {},
              ),
            };
          }),
          markLine: {
            data: markLineData?.map?.((mark: any, index: number) => {
              const { value, name, color, position } = mark;
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
                !!position ?
                  (position === 'x' ? { xAxis: value } : { yAxis: value }) :
                  (direction === 'rows' ? { xAxis: value } : { yAxis: value }),
              );
            }),
            silent: false, // 鼠标悬停事件, true悬停不会出现实线
            symbol: 'none', // 去掉箭头
          },
          ...(barColor.includes('default') ? { colorBy: 'data' } : {}),
        }]).concat(
          [
            !barRadius && !!showBackground
              ? {
                type: 'bar',
                show: true,
                itemStyle: {
                  normal: {
                    label: {
                      show: labelDirection !== 'none',
                      position: direction === 'rows' ? 'insideRight' : 'insideTop',
                      formatter: '{b}',
                      padding: [0, 12, 0, 0],
                      fontSize: 14,
                    },
                    color: 'rgba(180, 180, 180, 0.2)',
                  },
                },
                tooltip: { show: false },
                stack: 'total',
                data: seriesData?.map?.(() => max * 2),
              }
              : null,
            showWithLine
              ? {
                name: 'name',
                type: 'line',
                tooltip: {
                  show: false,
                },
                lineStyle: {
                  ...(barColor.includes('line1')
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
                    : barColor.includes('line2')
                      ? {
                        color: new echarts.graphic.LinearGradient(
                          direction === 'rows' ? 1 : 0,
                          direction === 'rows' ? 0 : 1,
                          0,
                          0,
                          [
                            {
                              offset: 0,
                              color: colorList2[0],
                            },
                            {
                              offset: 1,
                              color: colorList2[1],
                            },
                          ],
                        ),
                      }
                      : {}),
                },
                data: seriesData?.map?.((item: any, index: number) => {
                  const { value } = item;

                  return _.isArray(value) ? Math.max(...value) : value;
                }),
              }
              : null,
          ]
        ).filter(Boolean),
    });
    console.log(option);

    myChartRef.current?.setOption(option);
    myChartRef.current?.resize({
      width: domRef.current?.clientWidth,
      height: domRef.current?.clientHeight,
    });
  };
  useEffect(() => {
    if (!_.isArray(dataValue)) {
      message.error('柱状图数据格式不正确，请检查');
      console.log('BarCharts:', dataValue);
      return;
    }

    setTimeout(() => {
      if (!!myChartRef.current) {
        init();
      };
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

export default BarCharts;
