import React, { Fragment, useEffect } from 'react';
import * as echarts from 'echarts';
import options from './commonOptions';
import { useModel } from 'umi';
import { message } from 'antd';
import _ from "lodash";
import { CompressOutlined } from '@ant-design/icons';

interface Props {
    data: any,
    id: any,
    setMyChartVisible?: any,
    onClick?: any,
}

const BarCharts: React.FC<Props> = (props: any) => {
    let myChart: any = null;
    const { data = {}, id, setMyChartVisible, } = props;
    const { dataValue = [], yName, xName, direction, align } = data;
    const { initialState } = useModel<any>('@@initialState');
    const { params } = initialState;

    useEffect(() => {
        if (!_.isArray(dataValue)) {
            message.error('数据格式不正确，请检查');
            localStorage.removeItem(`localGridContentList-${params.id}`);
            return;
        }
        let seriesData: any = [],
            yData: any = [];
        dataValue.forEach((item: any) => {
            const { name, value } = item;
            seriesData = seriesData.concat(value);
            yData = yData.concat(name);
        });
        const dom: any = document.getElementById(`echart-${id}`);
        myChart = echarts.init(dom);
        const option = Object.assign({}, options, {
            legend: {
                show: false
            },
            grid: Object.assign({}, options.grid, align === 'right' ? {
                left: `${xName.length * (xName.length < 4 ? 24 : 16)}px`,
                right: '3%'
            } : {
                right: `${xName.length * (xName.length < 4 ? 24 : 16)}px`,
            }),
            yAxis: Object.assign({}, options.yAxis, {
                type: direction === 'rows' ? 'category' : 'value',
                name: direction === 'rows' ? xName : yName,
                boundaryGap: ['5%', '5%'],
                splitNumber: 3,
                scale: false,
                position: align || 'left',
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
                inverse: align === 'right',
            }, direction === 'rows' ? {} : { data: yData }),
            series: {
                name: 'name',
                type: 'bar',
                colorBy: 'data',
                label: {
                    show: true
                },
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
        <Fragment>
            <div
                style={{ width: '100%', height: '100%' }}
                id={`echart-${id}`}
            />
            <div className="preview-box flex-box-center">
                <CompressOutlined className='preview-icon' onClick={() => {
                    if (!!myChart) {
                        const options = myChart?.getOption?.();
                        setMyChartVisible(options);
                    }
                }} />
            </div>

        </Fragment>
    );

};

export default BarCharts;