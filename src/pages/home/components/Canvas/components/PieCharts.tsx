import React, { Fragment, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import options from './commonOptions';
import _ from 'lodash';
import { message } from 'antd';
import { connect } from 'umi';
import { ExpandOutlined } from '@ant-design/icons';

interface Props {
  data: any;
  id: any;
  setMyChartVisible?: any;
  onClick?: any;
}

const PieCharts: React.FC<Props> = (props: any) => {
  let { data = {}, id, legend, dispatch, setMyChartVisible } = props;
  let { dataValue = [], fontSize, yName, ifShowColorList = false } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = [
      { name: '机台状态1', value: '1024' },
      { name: '机台状态2', value: '888' },
      { name: '机台状态3', value: '1024' },
    ];
  }
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
    }
    const option = Object.assign({}, options, {
      legend: Object.assign(
        {},
        options.legend,
        { left: '3%' },
        legend[id] ? { selected: legend[id] } : {},
        { show: !!ifShowColorList },
      ),
      grid: { ...options.grid, top: 'bottom' },
      xAxis: { show: false },
      yAxis: { show: false },
      tooltip: {
        trigger: 'item',
        formatter: '{b0}<br />{c0}（{d0}%）',
      },
      series: [
        {
          type: 'pie',
          radius: ['25%', '70%'],
          // top: "-30%",
          // bottom: "-40%",
          // right: "-50%",
          // left: "-50%",
          // label: {
          //     position: "inside",
          //     fontSize: 15,
          //     formatter: `{b0}\n（{d0}%）`
          // },
          // labelLine: {
          //     length: 15,
          //     length2: 10,
          // }
          label: {
            alignTo: 'edge',
            fontSize: fontSize ? fontSize : dataValue?.length > 4 ? 9 : 11,
            formatter: '{name|{b}}\n{time|{d} %}',
            // textBorderWidth: 3,
            minMargin: 5,
            edgeDistance: 10,
            lineHeight: fontSize ? fontSize : 16,
            rich: {
              time: {
                fontSize: fontSize ? fontSize - 2 : 10,
                color: '#999',
              },
            },
          },
          labelLine: {
            length: 15,
            length2: 0,
            maxSurfaceAngle: 80,
          },
          labelLayout: function (params: any) {
            const isLeft = params.labelRect?.x < myChartRef.current.getWidth() / 2;
            const points = params.labelLinePoints;
            // Update the end point.
            points[2][0] = isLeft
              ? params.labelRect?.x
              : params.labelRect?.x + params.labelRect.width;
            return {
              labelLinePoints: points,
            };
          },
          data: (dataValue || [])?.map?.((item: any) => {
            const { name, value, color } = item;
            return {
              name,
              value,
              itemStyle: { color },
            };
          }),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    });
    myChartRef.current.on('legendselectchanged', function (obj: any) {
      const { selected } = obj;
      dispatch({
        type: 'themeStore/shortTimeAction',
        payload: { [id]: selected },
      });
    });
    myChartRef.current.setOption(option);
    myChartRef.current.resize({
      width: domRef.current.clientWidth,
      height: domRef.current.clientHeight,
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
      message.error('饼状图数据格式不正确，请检查');
      console.log('PieCharts:', dataValue);
      return;
    }
    setTimeout(() => {
      init();
    }, 200);
  }, [dataValue, fontSize, legend]);

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
      {!!yName ? <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translateX(-50%) translateY(-50%)'
      }}>{yName}</div> : null}
    </Fragment>
  );
};

export default connect(({ home, themeStore }) => ({
  legend: themeStore.legend,
}))(PieCharts);
