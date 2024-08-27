import React, { Fragment, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import options from './commonOptions';
import * as _ from 'lodash';
import { connect, useModel } from 'umi';
import { message } from 'antd';
import { CompressOutlined } from '@ant-design/icons';
import moment from 'moment';

interface Props {
  data: any;
  id: any;
  setMyChartVisible?: any;
  onClick?: any;
}

const LineCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id, legend, dispatch, setMyChartVisible } = props;
  let {
    dataValue = [], yName, xName = '', dataZoom, ifOnShowTab,
  } = data;
  if (process.env.NODE_ENV === 'development') {
    let base = +new Date(1988, 9, 3);
    let oneDay = 24 * 3600 * 1000;
    let data: any = [[moment(base).format('HH:mm:ss'), Math.random() * 300]];
    for (let i = 1; i < 120; i++) {
      let now = new Date((base += 1000 * i));
      data.push([
        moment(now).format('HH:mm:ss'),
        Math.round((Math.random() - 0.5) * 20 + data[i - 1][1]),
      ]);
    }

    dataValue = [
      {
        name: '上限',
        value: 7.2,
        type: 'markLine',
      },
      {
        name: '标准值',
        value: 2,
        type: 'markLine',
      },
      {
        name: '下限',
        value: -17.53,
        type: 'markLine',
      },
      {
        name: 'data1',
        color: 'black',
        value: data,
        // [
        //   [moment(new Date()).format('HH:mm:ss'), 0],
        //   [111, 0.4334124762809495],
        //   [112, -0.9606118392109693],
        //   [113, -0.13445980061443663],
        //   [114, 0.2657699517356775],
        //   [115, 0.10325138152127522],
        //   [116, 0.28377655413461866],
        //   [117, 0.08464055396447634],
        //   [118, 0.2651657265786582],
        //   [119, 0.1758820162761623],
        //   [120, 0.2831723289785941],
        //   [121, 0.01080146889621858],
        //   [122, 0.08147435164281092],
        //   [123, 0.39498237085557264],
        //   [124, 0],
        //   [125, -15.076183898115644],
        //   [126, -0.0655995933370832],
        //   [127, 0.5408478655230766],
        //   [128, 0.09887672888672228],
        //   [129, 0.30253245823122654],
        //   [130, 0.1901181911975982],
        //   [131, -0.15548752879649896],
        //   [132, 0.5010642332452448],
        //   [133, -0.32056807617654215],
        //   [134, 0.5556882656011339],
        //   [135, 0.06361282578291139],
        //   [136, 0.28075542835344436],
        //   [137, 0.7041157374339946],
        //   [138, 0.7015537602689506],
        //   [139, -0.8890445782283933],
        // ],
      },
      // {
      //     "name": "data2",
      //     "value": data
      // }
    ];
  }
  const { initialState } = useModel<any>('@@initialState');
  const { params } = initialState;
  const domRef = useRef<any>();
  const myChartRef = useRef<any>(null);
  const init = () => {
    let minValue: any = null,
      maxValue: any = null;
    let maxLength = 0;
    (dataValue || []).forEach((item: any, index: number) => {
      const { value, type } = item;
      if (type === 'markLine') {
        return;
      } else {
        if (_.isArray(value)) {
          (value || []).forEach((val: any) => {
            if (val[0] > maxLength) {
              maxLength = val[0];
            }
          });
          if (_.isNull(minValue) || _.isNull(maxValue)) {
            minValue = value[0][0];
            maxValue = value[value.length - 1][0];
            return;
          }
          if (value[0][0] < minValue) {
            minValue = value[0][0];
          }
          if (value[0][0] > maxValue) {
            maxValue = value[0][0];
          }
        }
      }
    });

    const option = Object.assign({}, options, {
      // tooltip: false,
      legend: Object.assign(
        {},
        options.legend,
        {
          data: (dataValue || [])?.map?.((item: any) => {
            const { name } = item;
            return name;
          }),
        },
        legend[id] ? { selected: legend[id] } : {},
      ),
      grid: Object.assign({}, options.grid, {
        right: `${xName?.length * (xName?.length < 4 ? 24 : 16)}px`,
        bottom: 30,
      }),
      dataZoom: [
        {
          type: 'inside',
        },
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
          {
            orient: 'horizontal',
            bottom: 15,
            left: 80,
            right: 60,
            height: 20,
          },
        ),
      ],
      yAxis: Object.assign({}, options.yAxis, {
        type: 'value',
        name: yName,
        boundaryGap: false,
        scale: true,
      }),
      xAxis: Object.assign({}, options?.xAxis, {
        type: 'category',
        name: xName,
        boundaryGap: [0, 0],
        min: minValue + '',
        max: maxValue + '',
        scale: true,
        axisLabel: {
          ...options?.xAxis.axisLabel,
          formatter: function (val: any) {
            return val;
          },
        },
      }),
      series: (dataValue || [])?.map?.((item: any) => {
        const { name, value, type, color } = item;
        if (type === 'markLine') {
          return {
            name: name,
            type: 'line',
            symbolSize: 0,
            label: {
              show: false,
            },
            animation: false,
            emphasis: {
              focus: 'series',
            },
            markLine: {
              data: [
                {
                  name: name,
                  yAxis: value,
                  type: 'median',
                },
              ],
              lineStyle: {
                width: 1,
                // color: '#3FBF00',
              },
              label: {
                show: true,
                position: 'middle',
                distance: 5,
                formatter: `${name}：${value}`,
              },
              silent: false, // 鼠标悬停事件, true悬停不会出现实线
              symbol: 'none', // 去掉箭头
            },
            data: [[minValue, value]],
          };
        } else {
          return {
            name: name,
            type: 'line',
            symbolSize: 2,
            smooth: false, // 是否平滑曲线
            label: {
              show: false,
            },
            color,
            sampling: 'lttb',
            animation: false,
            emphasis: {
              focus: 'series',
            },
            data: value, //.filter((i: any) => !!i[1])
          };
        }
      }),
    });
    myChartRef.current?.on('legendselectchanged', function (obj: any) {
      const { selected } = obj;
      dispatch({
        type: 'themeStore/shortTimeAction',
        payload: { [id]: selected },
      });
    });
    myChartRef.current?.setOption(option);
    myChartRef.current?.resize({
      width: domRef.current?.clientWidth,
      height: domRef.current?.clientHeight,
    });
  }
  useEffect(() => {
    if (!_.isArray(dataValue)) {
      message.error('趋势图数据格式不正确，请检查');
      console.log('LineCharts', dataValue);
      return;
    }
    if (!!domRef.current) {
      myChartRef.current = echarts.init(domRef.current);
      setTimeout(() => {
        init();
      }, 200);
    }

    return () => {
      window.removeEventListener(
        'resize',
        () => {
          myChartRef.current?.resize({
            width: domRef?.current.clientWidth,
            height: domRef?.current.clientHeight,
          });
        },
        false,
      );
      myChartRef.current && myChartRef.current?.dispose();
    };
  }, [data, domRef.current]);
  if (!ifOnShowTab) return null;
  return (
    <Fragment>
      <div style={{ width: '100%', height: '100%' }} id={`echart-${id}`} ref={domRef} />
      <div className="preview-box flex-box-center">
        <CompressOutlined
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

export default connect(({ home, themeStore }) => ({
  legend: themeStore.legend,
}))(LineCharts);
