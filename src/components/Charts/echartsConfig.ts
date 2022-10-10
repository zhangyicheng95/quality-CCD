import * as echarts from "echarts/core";
import moment from "moment";

//趋势折线图
export const lineChartDefectOption = (data = []) => {
  return {
    tooltip: {
      trigger: "axis",
    },
    grid: {
      top: 15,
      right: "8%",
      bottom: 24,
      left: "8%",
    },
    xAxis: {
      type: "time",
      axisLine: {
        show: true,
        color: "#AEB0B8",
        symbol: ["none", "arrow"],
        symbolOffset: [0, 15],
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: ["#f6fcff"],
          width: 16,
        },
      },
      splitNumber: 4,
      axisTick: {
        show: false,
        color: "rgba(0,0,0,0.45)",
      },
      axisLabel: {
        show: true,
        showMinLabel: true,
        showMaxLabel: true,
        // rotate: 45,
        // interval:99,
        color: "rgba(0,0,0,0.45)",
        fontFamily: "Helvetica",
        formatter: function (val: any) {
          return parseInt(val)
            ? moment(parseInt(val)).format(`YYYY-MM-DD HH:mm`)
            : "";
        },
      },
      axisPointer: {
        label: {
          show: false,
          formatter: function (params: any) {
            return params.value
              ? moment(params.value).format("YYYY-MM-DD HH:mm:ss")
              : "";
          },
        },
        snap: true,
      },
      boundaryGap: ["5%", "5%"],
    },
    yAxis: {
      type: "value",
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(174,176,184,0.20)",
        },
      },
      splitNumber: 3,
      axisTick: {
        show: false,
        length: 3,
      },
      axisLine: {
        show: true,
        color: "#AEB0B8",
        symbol: ["none", "arrow"],
        symbolOffset: [0, 15],
      },
      axisLabel: {
        show: true,
        color: "rgba(0,0,0,0.45)",
        fontFamily: "Helvetica",
        formatter: (value: any) => {
          return value;
        },
      },
      axisPointer: {
        label: {
          show: true,
          formatter: function (params: any) {
            return params.value ? Math.floor(params.value * 100) / 100 : "";
          },
        },
      },
      scale: true,
      boundaryGap: ["5%", "5%"],
    },
    series: {
      type: "line",
      // smooth: true,
      data: data,
      connectNulls: true,
      symbolSize: 1,
      itemStyle: {
        normal: {
          color: "#0091ff",
          lineStyle: {
            color: "#0091ff",
          },
        },
      },
    },
  };
};
//缺陷柱状图
export const barChartDefectOption = (data = []) => {
  return {
     tooltip: {
      trigger: "axis",
    },
    grid: {
      top: 15,
      right: "8%",
      bottom: 24,
      left: "8%",
    },
    xAxis: {
      type: "category",
      axisLine: {
        show: true,
        color: "#AEB0B8",
        symbol: ["none", "arrow"],
        symbolOffset: [0, 15],
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: ["#f6fcff"],
          width: 16,
        },
      },
      axisTick: {
        show: false,
        color: "rgba(0,0,0,0.45)",
      },
      data: data.map((item: any) => item.name),
    },
    yAxis: {
      type: "value",
      splitLine: {
        show: true,
        lineStyle: {
          color: "rgba(174,176,184,0.20)",
        },
      },
      splitNumber: 3,
      axisTick: {
        show: false,
        length: 3,
      },
      axisLine: {
        show: true,
        color: "#AEB0B8",
        symbol: ["none", "arrow"],
        symbolOffset: [0, 15],
      },
      axisLabel: {
        show: true,
        color: "rgba(0,0,0,0.45)",
        fontFamily: "Helvetica",
        formatter: (value: any) => {
          return value;
        },
      },
      axisPointer: {
        label: {
          show: true,
          formatter: function (params: any) {
            return params.value ? Math.floor(params.value * 100) / 100 : "";
          },
        },
      },
      boundaryGap: ["5%", "5%"],
    },
    series: [
      {
        data: data.map((item: any) => item.value),
        type: "bar",
        showBackground: true,
        backgroundStyle: {
          color: "rgba(180, 180, 180, 0.2)",
        },
      },
    ],
  };
};
