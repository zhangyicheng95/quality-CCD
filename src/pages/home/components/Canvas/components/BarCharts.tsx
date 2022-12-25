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
    const { dataValue = {}, yName, xName } = data;
    useEffect(() => {
        const dom: any = document.getElementById(`echart-${id}`);
        const myChart = echarts.init(dom);
        const option = Object.assign({}, options, {
            yAxis: Object.assign({}, options.yAxis, {
                name: yName,
                boundaryGap: ['5%', '5%'],
                scale: true,
            }),
            xAxis: Object.assign({}, options.xAxis, {
                type: 'category',
                name: xName,
            }),
            series: Object.entries(dataValue).map((item: any) => {
                return {
                    name: item[0],
                    type: 'bar',
                    data: item[1]
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