import React, { Fragment, useEffect } from "react";
import * as echarts from "echarts";
import options from "./commonOptions";
import * as _ from 'lodash';
import { useModel } from "umi";
import { message } from "antd";
import { CompressOutlined } from "@ant-design/icons";

interface Props {
    data: any,
    id: any,
    setMyChartVisible?: any,
    onClick?: any,
}

const PointCharts: React.FC<Props> = (props: any) => {
    let myChart: any = null;
    const { data = {}, id, setMyChartVisible, } = props;
    const { dataValue = [], yName, xName, direction, symbol = "rect" } = data;
    const { initialState } = useModel<any>('@@initialState');
    const { params } = initialState;

    useEffect(() => {
        if (!_.isArray(dataValue)) {
            message.error('数据格式不正确，请检查');
            localStorage.removeItem(`localGridContentList-${params.id}`);
            return;
        }
        const dom: any = document.getElementById(`echart-${id}`);
        myChart = echarts.init(dom);
        let minValueX: any = null,
            minValueY: any = null;
        (dataValue || []).forEach((item: any, index: number) => {
            const { value, type } = item;
            if (type === 'markLine') {
                return;
            } else {
                if (_.isNull(minValueX)) {
                    minValueX = value[0][0];
                }
                if (_.isNull(minValueY)) {
                    minValueY = value[0][1];
                }
                if (value[0][0] < minValueX) {
                    minValueX = value[0][0];
                }
                if (value[0][1] < minValueY) {
                    minValueY = value[0][1];
                }
            }
        });

        const option = Object.assign({}, options, {
            // color: ["rgb(115,171,216)", "rgb(245,142,94)"],
            legend: Object.assign({}, options.legend, {
                itemHeight: 8,
            }),
            grid: Object.assign({}, options.grid, {
                right: `${xName.length * (xName.length < 4 ? 24 : 16)}px`,
            }, direction === 'rows' ? { left: 30, } : { bottom: 30, }),
            yAxis: Object.assign({}, options.yAxis, {
                type: direction === 'rows' ? 'category' : 'value',
                name: direction === 'rows' ? xName : yName,
                boundaryGap: ['5%', '5%'],
                splitLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                splitNumber: 3,
                scale: false,
            }),
            dataZoom: [Object.assign({
                type: "slider",
                show: true,
                realtime: true,
                start: 0,
                end: 100,
                showDetai: false,
                moveHandleStyle: {
                    opacity: 0,
                }
            }, direction === 'rows' ? {
                orient: 'vertical',
                left: 10,
                top: 80,
                bottom: 60,
                width: 20,
            } : {
                orient: 'horizontal',
                bottom: 10,
                left: 80,
                right: 60,
                height: 20,
            })],
            xAxis: Object.assign({}, options.xAxis, {
                axisLabel: Object.assign({}, options.xAxis?.axisLabel, {
                    formatter: function (val: any) {
                        return val;
                    }
                }),
                boundaryGap: false,
                splitNumber: 3,
                splitLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                type: direction === 'rows' ? 'value' : 'category',
                name: direction === 'rows' ? yName : xName,
                scale: false,
            }),
            series: (dataValue || []).map((item: any) => {
                const { name, value, type } = item;
                if (type === 'markLine') {
                    return {
                        symbolSize: 1,
                        name: name,
                        type: 'scatter',
                        tooltip: {
                            show: false
                        },
                        data: [direction === 'rows' ? [value, minValueY] : [minValueX, value]],
                        markLine: {
                            symbolSize: 1,
                            lineStyle: {
                                type: 'solid',
                                width: 12,
                            },
                            data: [
                                { type: 'average', name: name },
                                direction === 'rows' ? { yAxis: value } : { xAxis: value }
                            ]
                        },
                    };
                } else {
                    return {
                        symbolSize: 8,
                        symbol: symbol || 'rect', //散点形状设置symbol: circle 圆, rect 方, roundRect 圆角方, triangle 三角, diamond 菱形, pin 气球, arrow 箭头
                        name: name,
                        type: "scatter",
                        data: value
                    };
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

export default PointCharts;