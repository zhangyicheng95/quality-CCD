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
const colorOption = ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'];

const BarCharts: React.FC<Props> = (props: any) => {
    let myChart: any = null;
    const { data = {}, id, setMyChartVisible, } = props;
    const { dataValue = [], yName, xName, direction, align, barColor } = data;
    const { initialState } = useModel<any>('@@initialState');
    const { params } = initialState;

    useEffect(() => {
        if (!_.isArray(dataValue)) {
            message.error('数据格式不正确，请检查');
            localStorage.removeItem(`localGridContentList-${params.id}`);
            return;
        }
        let seriesData: any = [],
            markLineData: any = [],
            yData: any = [],
            minValue: any = 0,
            maxValue: any = 0;
        dataValue.forEach((item: any) => {
            const { name, value, type } = item;
            if (type === 'markLine') {
                markLineData = markLineData.concat(item);
                return;
            } else {
                if (_.isNull(minValue) || _.isNull(maxValue)) {
                    minValue = value;
                    maxValue = value;
                    return;
                }
                if (value < minValue) {
                    minValue = value;
                }
                if (value > maxValue) {
                    maxValue = value;
                }
            }
            seriesData = seriesData.concat(value);
            yData = yData.concat(name);
        });

        const dom: any = document.getElementById(`echart-${id}`);
        myChart = echarts.init(dom);
        const option = Object.assign({}, options, {
            legend: {
                show: false
            },
            grid: Object.assign({ top: '35px', }, options.grid, align === 'right' ? {
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
                inverse: ((align === 'right' && minValue >= 0) || (align === 'left' && minValue < 0)),
            }, direction === 'rows' ? {} : { data: yData }),
            series: Object.assign({
                name: 'name',
                type: 'bar',
                label: {
                    show: seriesData?.length < 10
                },
                data: seriesData,
                markLine: {
                    data: markLineData?.map((mark: any, index: number) => {
                        const { value, name, color } = mark;
                        return Object.assign({}, {
                            name: name,
                            type: "median",
                            lineStyle: {
                                width: 1,
                                color: color || colorOption[index],
                            },
                            label: {
                                show: true,
                                position: 'middle',
                                distance: 5,
                                color: color || colorOption[index],
                                formatter: `${name}：${value}`
                            },
                        }, direction === 'rows' ? { xAxis: value, } : { yAxis: value, })
                    }),
                    silent: false, // 鼠标悬停事件, true悬停不会出现实线
                    symbol: 'none', // 去掉箭头
                },
            }, barColor === 'default' ? { colorBy: 'data', } : {
                itemStyle: { color: barColor }
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