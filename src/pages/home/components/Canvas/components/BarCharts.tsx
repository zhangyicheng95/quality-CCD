import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import options from './commonOptions';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const BarCharts: React.FC<Props> = (props: any) => {
    const { data = [], id, } = props;
    useEffect(() => {
        const dom: any = document.getElementById(`echart-${id}`);
        const myChart = echarts.init(dom);
        const option = Object.assign({}, options, {
            xAxis: Object.assign({}, options.xAxis, {
                type: 'category',
            }),
            series: [
                {
                    symbolSize: 15,
                    name: '第一个',
                    data: [
                        [10.0, 8.04],
                        [8.07, 6.95],
                        [13.0, 7.58],
                        [9.05, 8.81],
                        [11.0, 8.33],
                        [14.0, 7.66],
                        [13.4, 6.81],
                    ],
                    type: 'bar'
                },
                {
                    symbolSize: 10,
                    name: '第2个',
                    data: [
                        [11.0, 8.04],
                        [18.07, 6.95],
                        [23.0, 7.58],
                        [19.05, 8.81],
                        [21.0, 8.33],
                        [24.0, 7.66],
                        [23.4, 6.81],
                    ],
                    type: 'bar'
                }
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

export default BarCharts;