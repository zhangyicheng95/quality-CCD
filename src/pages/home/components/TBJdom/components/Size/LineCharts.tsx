import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import moment from 'moment';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const LineCharts: React.FC<Props> = (props: any) => {
    const { data = {}, id, } = props;

    useEffect(() => {
        const dom: any = document.getElementById(`echart-${id}`);
        const myChart = echarts.init(dom);
        const option = {
            color: ['rgb(115,171,216)', 'rgb(245,142,94)'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    // Use axis to trigger tooltip
                    type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
                }
            },
            legend: {
                top: '2%',
                textStyle: {
                    color: '#666'
                    // fontFamily:'serif',
                },
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '2%',
                containLabel: true
            },
            yAxis: {
                type: 'value',
                boundaryGap: '5%',
                fontSize: 14,
                splitNumber: 3,
                axisLabel: {
                    color: '#666'
                    // fontFamily:'serif',
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#666',
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#666'
                    }
                },
            },
            xAxis: {
                type: 'category',
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#666',
                    }
                },
                axisLabel: {
                    show: true,
                    showMinLabel: true,
                    showMaxLabel: true,
                    // rotate: 45,
                    fontSize: 14,
                    // interval:99,
                    color: '#666',
                    fontFamily: 'Helvetica',
                    formatter: function (val: any) {
                        return parseInt(val) ? moment(parseInt(val)).format(`YYYY-MM-DD HH:mm`) : val;
                    }
                },
            },
            series: [
                {
                    name: '正常',
                    id: 'normal',
                    type: 'line',
                    // stack: 'total',
                    label: {
                        show: true
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    markLine: {
                        data: !!data?.normal ? [
                            {
                                name: '正常',
                                yAxis: data?.normal?.upperThreshold,
                                // type: "median",
                                lineStyle: {
                                    color: '#FF3E3E',
                                },
                            },
                            {
                                name: '正常',
                                yAxis: data?.normal?.lowerThreshold,
                                // type: "median",
                                lineStyle: {
                                    color: '#FF3E3E',
                                },
                            }
                        ] : [],
                        lineStyle: {
                            width: 1,
                            color: '#3FBF00',
                        },
                        label: {
                            show: false,
                        },
                        silent: true, // 鼠标悬停事件, true悬停不会出现实线
                        // symbol: 'none', // 去掉箭头
                    },
                    data: data?.normal?.data
                },
                {
                    name: '异常',
                    id: 'abNormal',
                    type: 'line',
                    // stack: 'total',
                    label: {
                        show: true
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    markLine: {
                        data: !!data?.abNormal ? [
                            {
                                name: '异常',
                                yAxis: data?.abNormal?.upperThreshold,
                                // type: "median",
                                lineStyle: {
                                    color: '#FFB100',
                                },
                            },
                            {
                                name: '异常',
                                yAxis: data?.abNormal?.upperThreshold,
                                // type: "median",
                                lineStyle: {
                                    color: '#FFB100',
                                },
                            }
                        ] : [],
                        lineStyle: {
                            width: 1,
                            color: '#3FBF00',
                        },
                        label: {
                            show: false,
                        },
                        silent: true, // 鼠标悬停事件, true悬停不会出现实线
                        // symbol: 'none', // 去掉箭头
                    },
                    data: data?.abNormal?.data
                },
            ]
        };
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