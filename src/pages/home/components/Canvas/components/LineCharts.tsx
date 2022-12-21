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

    useEffect(() => {
        const { upperThreshold, lowerThreshold, standard, leftTop, leftBottom, rightTop, rightBottom } = data;
        const dom: any = document.getElementById(`echart-${id}`);
        const myChart = echarts.init(dom);
        const option = Object.assign({}, options, {
            legend: Object.assign({}, options.legend, {
                data: [
                    {
                        name: '右上',
                        // icon: 'image://' + blue,
                    },
                    {
                        name: '右下',
                        // icon: 'image://' + lightBlue,
                    },
                    {
                        name: '左上',
                        // icon: 'image://' + green,
                    },
                    {
                        name: '左下',
                        // icon: 'image://' + lightGreen,
                    },
                    {
                        name: '上限',
                        icon: 'image://' + blue,
                    },
                    {
                        name: '标准值',
                        icon: 'image://' + green,
                    },
                    {
                        name: '下限',
                        icon: 'image://' + lightGreen,
                    }
                ]
            }),
            yAxis: Object.assign({}, options.yAxis, {
                type: 'value',
                name: '尺寸',
                boundaryGap: [0, '20%'],
            }),
            xAxis: Object.assign({}, options.xAxis, {
                type: 'value',
                name: '个数',

            }),
            series: [
                {
                    name: '右上',
                    id: 'topright',
                    type: 'line',
                    // stack: 'total',
                    symbolSize: 2,
                    label: {
                        show: false
                    },
                    animation: false,
                    emphasis: {
                        focus: 'series'
                    },
                    data: rightTop
                },
                {
                    name: '右下',
                    id: 'bottomright',
                    type: 'line',
                    // stack: 'total',
                    symbolSize: 2,
                    label: {
                        show: false
                    },
                    animation: false,
                    emphasis: {
                        focus: 'series'
                    },
                    data: rightBottom
                },
                {
                    name: '左上',
                    id: 'lefttop',
                    type: 'line',
                    // stack: 'total',
                    symbolSize: 2,
                    label: {
                        show: false
                    },
                    animation: false,
                    emphasis: {
                        focus: 'series'
                    },
                    data: leftTop
                },
                {
                    name: '左下',
                    id: 'leftbottom',
                    type: 'line',
                    // stack: 'total',
                    symbolSize: 2,
                    label: {
                        show: false
                    },
                    animation: false,
                    emphasis: {
                        focus: 'series'
                    },
                    data: leftBottom
                },
                {
                    name: '上限',
                    id: 'upperThreshold',
                    type: 'line',
                    // stack: 'total',
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
                                name: '上限',
                                yAxis: upperThreshold,
                                type: "median",
                                lineStyle: {
                                    // color: '#FF3E3E',
                                },
                            },
                        ],
                        lineStyle: {
                            width: 1,
                            color: '#3FBF00',
                        },
                        label: {
                            show: false,
                        },
                        silent: false, // 鼠标悬停事件, true悬停不会出现实线
                        symbol: 'none', // 去掉箭头
                    },
                },
                {
                    name: '下限',
                    id: 'lowerThreshold',
                    type: 'line',
                    // stack: 'total',
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
                                name: '下限',
                                yAxis: lowerThreshold,
                                type: "median",
                                // lineStyle: {
                                //     color: '#FF3E3E',
                                // },
                            }
                        ],
                        lineStyle: {
                            width: 1,
                            // color: '#3FBF00',
                        },
                        label: {
                            show: false,
                        },
                        silent: false, // 鼠标悬停事件, true悬停不会出现实线
                        symbol: 'none', // 去掉箭头
                    },
                },
                {
                    name: '标准值',
                    id: 'standard',
                    type: 'line',
                    // stack: 'total',
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
                                name: '标准值',
                                yAxis: standard,
                                type: "median",
                                lineStyle: {
                                    color: '#FF3E3E',
                                },
                            }
                        ],
                        lineStyle: {
                            width: 1,
                            // color: '#3FBF00',
                        },
                        label: {
                            show: false,
                        },
                        silent: false, // 鼠标悬停事件, true悬停不会出现实线
                        symbol: 'none', // 去掉箭头
                    },
                },
            ]
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