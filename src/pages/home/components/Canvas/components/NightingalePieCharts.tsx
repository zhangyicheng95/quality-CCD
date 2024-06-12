import React, { Fragment, useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import options from './commonOptions';
import _ from 'lodash';
import { message } from 'antd';
import { connect, useModel } from 'umi';
import { CompressOutlined } from '@ant-design/icons';
import styles from '../index.module.less';
import bg1 from '@/assets/images/pie-bg-1.png';

interface Props {
  data: any;
  id: any;
  setMyChartVisible?: any;
  onClick?: any;
}

const NightingalePieCharts: React.FC<Props> = (props: any) => {
  let myChart: any = null;
  let { data = {}, id, legend, dispatch, setMyChartVisible } = props;
  let { dataValue = [], fontSize } = data;
  const { initialState } = useModel<any>('@@initialState');
  const { params } = initialState;

  const [domSize, setDomSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (!_.isArray(dataValue)) {
      message.error('饼状图数据格式不正确，请检查');
      console.log('PieCharts:', dataValue);
      return;
    }
    if (process.env.NODE_ENV === 'development') {
      dataValue = [
        { name: '缺陷类型1', value: '488' },
        { name: '缺陷类型2', value: '1024' },
        { name: '缺陷类型3', value: '824' },
        { name: '缺陷类型4', value: '488' },
        // { name: '缺陷类型5', value: '1024' },
        // { name: '缺陷类型6', value: '824' },
        // { name: '缺陷类型7', value: '488' },
        // { name: '缺陷类型8', value: '1024' },
        // { name: '缺陷类型9', value: '824' },
      ];
    }

    const dom: any = document.getElementById(`echart-${id}`);
    myChart = echarts.init(dom);
    const option = Object.assign({}, options, {
      legend: Object.assign(
        {},
        _.omit(options.legend, 'left'),
        {
          type: 'scroll',
          orient: 'vertical',
          right: '5%',
          top: `center`,
          textStyle: {
            ...options.legend.textStyle,
            fontSize: fontSize,
          },
          formatter: function (name: any, i: any) {
            return name;
          },
        },
        legend[id] ? { selected: legend[id] } : {},
      ),
      xAxis: { show: false },
      yAxis: { show: false },
      tooltip: {
        trigger: 'item',
        formatter: '{b0}<br />{c0}（{d0}%）',
      },
      series: [
        {
          type: 'pie',
          radius: ['30%', '80%'],
          center: ['35%', '50%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 8,
          },
          label: {
            show: false,
          },
          data: (dataValue || [])?.map?.((item: any) => {
            const { name, value, color } = item;
            return {
              name,
              value,
              itemStyle: { color },
            };
          }),
        },
      ],
    });

    myChart.on('legendselectchanged', function (obj: any) {
      const { selected } = obj;
      dispatch({
        type: 'themeStore/shortTimeAction',
        payload: { [id]: selected },
      });
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
    setDomSize({ width: dom.clientWidth, height: dom.clientHeight });
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
  }, [dataValue, fontSize, legend]);

  return (
    <div className={`${styles.nightingalePieCharts}`}>
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
      <div
        className="night-pie-bg"
        style={{
          backgroundImage: `url(${bg1})`,
          left: domSize.width * 0.35 - (domSize.height * 0.92) / 2,
          width: domSize.height * 0.92,
          height: domSize.height * 0.92,
        }}
      ></div>
    </div>
  );
};

export default connect(({ home, themeStore }) => ({
  legend: themeStore.legend,
}))(NightingalePieCharts);
