import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import options from './commonOptions';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const BarCharts: React.FC<Props> = (props: any) => {
    const { data = {}, id, } = props;
    const { dataValue = [], yName, xName, direction } = data;
    useEffect(() => {
        let seriesData: any = [],
            yData: any = [];
        dataValue.forEach((item: any) => {
            const { name, value } = item;
            seriesData = seriesData.concat(value);
            yData = yData.concat(name);
        });
        const dom: any = document.getElementById(`echart-${id}`);
        const myChart = echarts.init(dom);
        const option = Object.assign({}, options, {
            legend: {
                show: false
            },
            grid: Object.assign({}, options.grid, {
                right: `${xName.length * (xName.length < 4 ? 24 : 16)}px`,
            }),
            yAxis: Object.assign({}, options.yAxis, {
                type: direction === 'rows' ? 'category' : 'value',
                name: direction === 'rows' ? xName : yName,
                boundaryGap: ['5%', '5%'],
                splitNumber: 3,
                scale: false,
            }, direction === 'rows' ? { data: yData } : {}),
            xAxis: Object.assign({}, options.xAxis, {
                axisLabel: Object.assign({}, options.xAxis?.axisLabel, {
                    formatter: function (val: any) {
                        return val;
                    }
                }),
                type: direction === 'rows' ? 'value' : 'category',
                splitNumber: 3,
                name: direction === 'rows' ? yName : xName,
                scale: false,
            }, direction === 'rows' ? {} : { data: yData }),
            series: {
                name: 'name',
                type: 'bar',
                colorBy: 'data',
                data: seriesData,
            }
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
            myChart && myChart.dispose();
        }
    }, [data]);

    return (
        <div
            style={{ width: '100%', height: '100%' }}
            id={`echart-${id}`}
        />
    );

};

export default BarCharts;