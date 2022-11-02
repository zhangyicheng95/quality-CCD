import React, { useEffect, useContext, useState, useRef, useMemo, useCallback } from 'react';
import { Tooltip, Form, Modal, Input, message, notification, Switch } from 'antd';
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
        const dom = document.getElementById(`echart-${id}`);
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
                textStyle: {
                    color: '#ddd'
                    // fontFamily:'serif',
                },
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: 0,
                containLabel: true
            },
            yAxis: {
                type: 'value',
                fontSize: 14,
                splitNumber: data.length === 1 ? 1 : 3,
                axisLabel: {
                    color: '#ddd'
                    // fontFamily:'serif',
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: '#ddd',
                    }
                },
            },
            xAxis: {
                type: 'category',
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
                    data: data
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
                    data: data
                },
            ]
        };
        myChart.setOption(option);
    }, [data]);

    return (
        <div
            style={{ width: '100%', height: '100%' }}
            id={`echart-${id}`}
        />
    );

};

export default LineCharts;