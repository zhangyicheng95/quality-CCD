import React, { useEffect, } from 'react';
import * as echarts from 'echarts';
import moment from 'moment';

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
        const option = {
            color: ['rgb(105,250,106)', 'rgb(51,115,245)', 'rgb(7,47,107)', 'rgb(234,200,70)'],
            backgroundColor: '#d9d9d9',
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    // Use axis to trigger tooltip
                    type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
                }
            },
            legend: {
                show: false,
                textStyle: {
                    color: '#ddd'
                    // fontFamily:'serif',
                },
            },
            grid: {
                left: '3%',
                right: '3%',
                top: 24,
                bottom: 0,
                containLabel: true
            },
            yAxis: {
                type: 'value',
                show: false,
                fontSize: 14,
                splitNumber: data.length === 1 ? 1 : 3,
                splitLine: {
                    show: false,
                },
                axisLabel: {
                    color: '#ddd'
                    // fontFamily:'serif',
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#ddd',
                    }
                },
            },
            xAxis: {
                type: 'time',
                show: false,
                // boundaryGap: ['2%', '2%'],
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#ddd',
                    }
                },
                axisLabel: {
                    show: true,
                    showMinLabel: true,
                    showMaxLabel: true,
                    // rotate: 45,
                    fontSize: 14,
                    // interval:99,
                    color: '#ddd',
                    fontFamily: 'Helvetica',
                    formatter: function (val: any) {
                        return parseInt(val) ? moment(parseInt(val)).format(`YYYY-MM-DD HH:mm`) : val;
                    }
                },
            },
            series: Object.entries(data).map(item => {
                return {
                    name: item[0],
                    id: item[0],
                    type: 'line',
                    // stack: 'total',
                    label: {
                        show: true
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: item[1]
                }
            })
        };
        myChart.setOption(option);
    }, [data, id]);

    return (
        <div
            style={{ width: '100%', height: '100%' }}
            id={`echart-${id}`}
        />
    );

};

export default LineCharts;