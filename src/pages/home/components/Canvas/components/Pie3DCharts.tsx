import React, { Fragment, useEffect } from 'react';
import * as echarts from 'echarts';
import 'echarts-gl';
import _, { forEach } from 'lodash';
import { message } from 'antd';
import { connect, useModel } from 'umi';
import { CompressOutlined } from '@ant-design/icons';
import { getPie3D, getParametricEquation } from './pie3DOption';
import options from './commonOptions';
import styles from '../index.module.less';

interface Props {
  data: any;
  id: any;
  setMyChartVisible?: any;
  onClick?: any;
}

const PieCharts: React.FC<Props> = (props: any) => {
  let myChart: any = null;
  let { data = {}, id, legend, dispatch, setMyChartVisible } = props;
  let { dataValue = [], fontSize, xName = 180 } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = [
      {
        name: '单日能耗',
        value: 10,
      },
      {
        name: '7日能耗',
        value: 70,
      },
      {
        name: '30日能耗',
        value: 380,
      },
    ];
  }
  useEffect(() => {
    if (!_.isArray(dataValue)) {
      message.error('3D饼状图数据格式不正确，请检查');
      console.log('PieCharts:', dataValue);
      return;
    }

    let max = 0;
    let gap = 1;
    let dataSource = [];
    (dataValue || [])?.forEach((item: any) => {
      if (max < item?.value) {
        max = item.value;
      }
    });
    if (max > xName) {
      gap = max / (xName || 180);
      dataSource = dataValue
        .map((item: any) => {
          return {
            ...item,
            value: (item?.value || 0) / gap,
          };
        })
        .sort((a: any, b: any) => a.value - b.value);
    } else {
      dataSource = dataValue.sort((a: any, b: any) => a.value - b.value);
    }
    const dom: any = document.getElementById(`echart-${id}`);
    myChart = echarts.init(dom);
    // 传入数据生成 option
    const series: any = getPie3D(dataSource, 0.5, false);
    // 准备待返回的配置项，把准备好的 legendData、series 传入。
    let option = {
      color: options.color,
      legend: {
        show: true,
        tooltip: {
          show: true,
        },
        type: 'scroll',
        orient: 'vertical',
        top: 'center',
        itemGap: 14,
        right: 8,
        textStyle: {
          color: '#fff',
          fontSize,
        },
        formatter: (title: any) => `${title}`,
        ...(legend[id] ? { selected: legend[id] } : {}),
      },
      animation: true,
      tooltip: {
        show: false,
        formatter: (params: any) => {
          const { seriesName, marker, data } = params;
          return `${marker} ${seriesName}<br/>${data[2] - 5}`;
        },
      },
      xAxis3D: {
        min: -1,
        max: 1,
      },
      yAxis3D: {
        min: -1,
        max: 1,
      },
      zAxis3D: {
        min: -1,
        max: 1,
      },
      grid3D: {
        show: false, //网格地图
        boxHeight: 0.5, // 设置立体柱状图的高度
        boxWidth: 100, // 设置立体柱状图的宽度
        bottom: 0,
        left: `-${dom.clientWidth / 6}px`,
        // environment: "rgba(255,255,255,0)",
        viewControl: {
          distance: xName || 180, // 视角距离
          alpha: 30, // 倾斜角度
          beta: 110, // 开始角度
          autoRotate: false, // 自动旋转
          rotateSensitivity: 0, // 禁止旋转
          zoomSensitivity: 0, // 禁止缩放
        },
      },
      series: series,
    };
    myChart.setOption(option);
    // 监听鼠标事件，实现饼图选中效果（单选），近似实现高亮（放大）效果。
    let hoveredIndex = '';

    // 监听 mouseover，近似实现高亮（放大）效果
    myChart.on('mouseover', function (params: any) {
      // 准备重新渲染扇形所需的参数
      let isSelected;
      let isHovered;
      let startRatio;
      let endRatio;
      let k;

      // 如果触发 mouseover 的扇形当前已高亮，则不做操作
      if (hoveredIndex === params.seriesIndex) {
        return;

        // 否则进行高亮及必要的取消高亮操作
      } else {
        // 如果当前有高亮的扇形，取消其高亮状态（对 option 更新）
        if (hoveredIndex !== '') {
          // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 false。
          isSelected = option.series[hoveredIndex]?.pieStatus?.selected;
          isHovered = false;
          startRatio = option.series[hoveredIndex]?.pieData?.startRatio;
          endRatio = option.series[hoveredIndex]?.pieData?.endRatio;
          k = option.series[hoveredIndex]?.pieStatus?.k;

          // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
          option.series[hoveredIndex].parametricEquation = getParametricEquation(
            startRatio,
            endRatio,
            isSelected,
            isHovered,
            k,
            option.series[hoveredIndex]?.pieData?.value,
          );
          if (option.series[hoveredIndex]?.pieStatus) {
            option.series[hoveredIndex].pieStatus.hovered = isHovered;
          }
          // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
          hoveredIndex = '';
        }

        // 如果触发 mouseover 的扇形不是透明圆环，将其高亮（对 option 更新）
        if (params.seriesName !== 'mouseoutSeries') {
          // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
          isSelected = option.series[params.seriesIndex]?.pieStatus?.selected || false;
          isHovered = true;
          startRatio = option.series[params.seriesIndex]?.pieData?.startRatio;
          endRatio = option.series[params.seriesIndex]?.pieData?.endRatio;
          k = option.series[params.seriesIndex]?.pieStatus?.k;

          // 对当前点击的扇形，执行高亮操作（对 option 更新）
          option.series[params.seriesIndex].parametricEquation = getParametricEquation(
            startRatio,
            endRatio,
            isSelected,
            isHovered,
            k,
            option.series[params.seriesIndex]?.pieData?.value + 5,
          );
          if (option.series[params.seriesIndex]?.pieStatus) {
            option.series[params.seriesIndex].pieStatus.hovered = isHovered;
          }
          // 记录上次高亮的扇形对应的系列号 seriesIndex
          hoveredIndex = params.seriesIndex;
        }

        // 使用更新后的 option，渲染图表
        myChart.setOption(option);
      }
    });
    // 修正取消高亮失败的 bug
    myChart.on('globalout', function () {
      if (hoveredIndex !== '') {
        // 从 option.series 中读取重新渲染扇形所需的参数，将是否高亮设置为 true。
        let isSelected = option.series[hoveredIndex]?.pieStatus?.selected,
          isHovered = false,
          k = option.series[hoveredIndex]?.pieStatus?.k,
          startRatio = option.series[hoveredIndex]?.pieData?.startRatio,
          endRatio = option.series[hoveredIndex]?.pieData?.endRatio;

        // 对当前点击的扇形，执行取消高亮操作（对 option 更新）
        option.series[hoveredIndex].parametricEquation = getParametricEquation(
          startRatio,
          endRatio,
          isSelected,
          isHovered,
          k,
          option.series[hoveredIndex]?.pieData?.value,
        );
        if (option.series[hoveredIndex]?.pieStatus) {
          option.series[hoveredIndex].pieStatus.hovered = isHovered;
        }
        // 将此前记录的上次选中的扇形对应的系列号 seriesIndex 清空
        hoveredIndex = '';
      }

      // 使用更新后的 option，渲染图表
      myChart.setOption(option);
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
    <div className={styles.pieCharts}>
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
    </div>
  );
};

export default connect(({ home, themeStore }) => ({
  legend: themeStore.legend,
}))(PieCharts);
