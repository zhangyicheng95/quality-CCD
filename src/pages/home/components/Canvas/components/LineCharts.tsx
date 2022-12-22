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
    const { data = [], id, } = props;
    useEffect(() => {
        const dom: any = document.getElementById(`echart-${id}`);
        const myChart = echarts.init(dom);
        const option = Object.assign({}, options, {
            legend: Object.assign({}, options.legend, {
                data: (data || []).map((item: any) => {
                    const { name, type } = item;
                    return name;
                })
            }),
            yAxis: Object.assign({}, options.yAxis, {
                type: 'value',
                name: '尺寸',
                boundaryGap: ['5%', '5%'],
                scale: true,
            }),
            xAxis: Object.assign({}, options.xAxis, {
                type: 'value',
                name: '个数',

            }),
            series: (data || []).map((item: any) => {
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