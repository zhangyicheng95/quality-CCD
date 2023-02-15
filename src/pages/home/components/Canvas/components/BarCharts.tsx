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
    const { dataValue = [
        { "name": "data1", "value": [[10.0, 8.04], [8.07, 6.95], [13.0, 7.58]] },
        { "name": "data2", "value": [[10.0, 8.04], [8.07, 6.95], [13.0, 7.58]] }
    ], yName, xName, direction } = data;
    useEffect(() => {
        const dom: any = document.getElementById(`echart-${id}`);
        const myChart = echarts.init(dom);
        const option = Object.assign({}, options, {
            grid: Object.assign({}, options.grid, {
                right: `${xName.length * 16}px`,
            }),
            yAxis: Object.assign({}, options.yAxis, {
                type: direction === 'rows' ? 'category' : 'value',
                name: yName,
                boundaryGap: ['5%', '5%'],
                scale: true,
            }),
            xAxis: Object.assign({},
                options.xAxis,
                direction === 'rows' ? {
                    axisLabel: Object.assign({}, options.xAxis?.axisLabel, {
                        formatter: function (val: any) {
                            return val;
                        }
                    })
                } : {},
                {
                    type: direction === 'rows' ? 'value' : 'category',
                    splitNumber: 3,
                    name: xName,
                    scale: true,
                }),
            series: (dataValue || []).map((item: any) => {
                const { name, value } = item;
                return {
                    name: name,
                    type: 'bar',
                    data: direction === 'rows' ? value.map((item: any) => {
                        return item.reverse()
                    }) : value,
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

export default BarCharts;