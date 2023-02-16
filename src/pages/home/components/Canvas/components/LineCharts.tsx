import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import options from './commonOptions';
import _ from 'lodash';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const LineCharts: React.FC<Props> = (props: any) => {
    const { data = {}, id, } = props;
    const { dataValue = [], yName, xName } = data;
    useEffect(() => {
        const dom: any = document.getElementById(`echart-${id}`);
        const myChart = echarts.init(dom);
        let minValue: any = null,
            maxValue: any = null;
        (dataValue || []).forEach((item: any, index: number) => {
            const { value, type } = item;
            if (type === 'markLine') {
                return;
            } else {
                if (_.isNull(minValue) || _.isNull(maxValue)) {
                    minValue = value[0][0];
                    maxValue = value[value.length - 1][0];
                    return;
                }
                if (value[0][0] < minValue) {
                    minValue = value[0][0];
                }
                if (value[0][0] > maxValue) {
                    maxValue = value[0][0];
                }
            }
        });

        const option = Object.assign({}, options, {
            legend: Object.assign({}, options.legend, {
                data: (dataValue || []).map((item: any) => {
                    const { name } = item;
                    return name;
                })
            }),
            grid: Object.assign({}, options.grid, {
                right: `${xName.length * (xName.length < 4 ? 20 : 16)}px`,
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
                boundaryGap: [0, 0],
                min: minValue,
                max: maxValue,
                scale: true,
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
                        data: [[minValue, value]]
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
                        data: value.filter((i: any) => !!i[1])
                    }
                }
            })
        });
        myChart.setOption(option);
        myChart.resize({
            width: dom.clientWidth,
            height: dom.clientHeight,
        });
        window.addEventListener("resize", () => {
            myChart.resize({
                width: dom.clientWidth,
                height: dom.clientHeight,
            });
        }, false);

        return () => {
            window.removeEventListener("resize", () => {
                myChart.resize({
                    width: dom.clientWidth,
                    height: dom.clientHeight,
                });
            }, false);
        }
    }, [data]);

    return (
        <div
            style={{ width: '100%', height: '100%' }}
            id={`echart-${id}`}
        />
    );

};

export default LineCharts;