import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import blue from "./images/blue.png";
import green from "./images/green.png";
import lightGreen from "./images/lightGreen.png";
import options from './commonOptions';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const LineCharts: React.FC<Props> = (props: any) => {
    const { data = {}, id, } = props;
    const { dataValue = [
        {
            "name": "上限",
            "value": 2.2,
            "type": "markLine"
        },
        {
            "name": "标准值",
            "value": 1.6,
            "type": "markLine"
        },
        {
            "name": "下限",
            "value": 1.53,
            "type": "markLine"
        },
        {
            "name": "data1",
            "value": [[0, 1.68], [1, 1.54], [2, 1.89], [3, 1.57], [4, 1.67], [5, 1.89], [6, 1.6], [7, 1.51], [8, 1.55], [9, 1.79], [10, 1.65], [11, 1.6], [12, 1.76], [13, 1.62], [14, 1.76]]
        },
        {
            "name": "data2",
            "value": [[0, 1.62], [1, 1.62], [2, 1.53], [3, 1.8], [4, 1.76], [5, 1.83], [6, 1.63], [7, 1.78], [8, 1.85], [9, 1.5], [10, 1.59], [11, 1.7], [12, 1.74], [13, 1.79], [14, 1.69]]
        }
    ], yName, xName } = data;
    useEffect(() => {
        const dom: any = document.getElementById(`echart-${id}`);
        const myChart = echarts.init(dom);
        const option = Object.assign({}, options, {
            legend: Object.assign({}, options.legend, {
                data: (dataValue || []).map((item: any) => {
                    const { name, type } = item;
                    return name;
                })
            }),
            yAxis: Object.assign({}, options.yAxis, {
                type: 'value',
                name: yName,
                boundaryGap: ['5%', '5%'],
                scale: true,
            }),
            xAxis: Object.assign({}, options.xAxis, {
                type: 'value',
                name: xName,

            }),
            series: (dataValue || []).map((item: any) => {
                const { name, value, type } = item;
                if (type === 'markLine') {
                    return {
                        name: name,
                        type: 'line',
                        symbolSize: 0,
                        label: {
                            show: false
                        },
                        animation: false,
                        emphasis: {
                            focus: 'series'
                        },
                        markLine: {
                            data: [
                                {
                                    name: name,
                                    yAxis: value,
                                    type: "median",
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
                                formatter: `${name}：${value}`
                            },
                            silent: false, // 鼠标悬停事件, true悬停不会出现实线
                            symbol: 'none', // 去掉箭头
                        },
                        data: [[0, value]]
                    }
                } else {
                    return {
                        name: name,
                        type: 'line',
                        symbolSize: 2,
                        smooth: false, // 是否平滑曲线
                        label: {
                            show: false
                        },
                        animation: false,
                        emphasis: {
                            focus: 'series'
                        },
                        data: value
                    }
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
            style={{ width: '100%', height: '100%' }}
            id={`echart-${id}`}
        />
    );

};

export default LineCharts;