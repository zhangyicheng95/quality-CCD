import React, { useEffect } from "react";
import * as echarts from "echarts";
import options from "./commonOptions";

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const PointCharts: React.FC<Props> = (props: any) => {
    const { data = {}, id, } = props;
    const { dataValue = {
        "data1": [
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
            [7.08, 5.82],
            [5.02, 5.68]
        ],
        "data2": [
            [11.0, 8.04],
            [18.07, 6.95],
            [23.0, 7.58],
            [19.05, 8.81],
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
            [15.02, 5.68]
        ],
    }, yName, xName } = data;
    useEffect(() => {
        console.log(data)
        const dom: any = document.getElementById(`echart-${id}`);
        const myChart = echarts.init(dom);
        const option = Object.assign({}, options, {
            // color: ["rgb(115,171,216)", "rgb(245,142,94)"],
            legend: Object.assign({}, options.legend, {
                itemHeight: 8,
            }),
            yAxis: Object.assign({}, options.yAxis, {
                name: yName,
                boundaryGap: ["5%", "5%"],
                scale: true,
            }),
            xAxis: Object.assign({}, options.xAxis, {
                name: xName,
            }),
            series: Object.entries(dataValue).map((item: any) => {
                return {
                    symbolSize: 15,
                    name: item[0],
                    type: "scatter",
                    data: item[1]
                }
            })
        });
        myChart.setOption(option);
        myChart.resize({
            width: dom.clientWidth,
            height: dom.clientHeight,
        })
    }, [data]);

    return (
        <div
            style={{ width: "100%", height: "100%" }}
            id={`echart-${id}`}
        />
    );

};

export default PointCharts;