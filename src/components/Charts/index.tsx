/** ********************************************************************
 *
 * @模块名称: commonCharts
 * @date: 2021/7/21
 *
 * @版权所有: SANY ⋅ 重工 ⋅ 智能研究总院
 *
 ********************************************************************* */
import React from "react";
import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";

import {
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  // RadarChart,
  MapChart,
  // TreeChart,
  // TreemapChart,
  // GraphChart,
  GaugeChart,
  // FunnelChart,
  // ParallelChart,
  // SankeyChart,
  // BoxplotChart,
  // CandlestickChart,
  EffectScatterChart,
  // LinesChart,
  // HeatmapChart,
  PictorialBarChart,
  // ThemeRiverChart,
  // SunburstChart,
  CustomChart
} from "echarts/charts";
import {
  // GridSimpleComponent,

  GridComponent,
  PolarComponent,
  // RadarComponent,
  // GeoComponent,
  SingleAxisComponent,
  // ParallelComponent,
  // CalendarComponent,
  // GraphicComponent,
  ToolboxComponent,
  TooltipComponent,
  AxisPointerComponent,
  // BrushComponent,
  TitleComponent,
  // TimelineComponent,
  // MarkPointComponent,
  // MarkLineComponent,
  MarkAreaComponent,
  LegendComponent,
  // LegendScrollComponent,
  // LegendPlainComponent,
  // DataZoomComponent,
  // DataZoomInsideComponent,
  // DataZoomSliderComponent,
  VisualMapComponent,
  VisualMapContinuousComponent,
  VisualMapPiecewiseComponent,
  AriaComponent
  // TransformComponent,
  // DatasetComponent,
} from "echarts/components";
import {
  CanvasRenderer
  // SVGRenderer,
} from "echarts/renderers";

echarts.use([
  GaugeChart,
  AriaComponent,
  MarkAreaComponent,
  PictorialBarChart,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  LineChart,
  MapChart,
  CanvasRenderer,
  LegendComponent,
  ToolboxComponent,
  VisualMapComponent,
  VisualMapContinuousComponent,
  VisualMapPiecewiseComponent,
  ScatterChart,
  EffectScatterChart,
  PieChart,
  SingleAxisComponent,
  AxisPointerComponent,
  CustomChart,
  PolarComponent
]);

interface IProps {
  option: any;
  onEvents?: any;
  getRefs?: any;
}

const Charts: React.FC<IProps> = props => {
  return (
    <ReactEChartsCore
      echarts={echarts}
      option={props.option}
      onEvents={props.onEvents}
      notMerge={true}
      lazyUpdate={true}
      style={{ width: "100%", height: "100%" }}
      className="echart-box"
    />
  );
};
export default Charts;
