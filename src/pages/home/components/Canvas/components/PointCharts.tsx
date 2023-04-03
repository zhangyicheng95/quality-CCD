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

        const option = Object.assign({}, options, {
            // color: ["rgb(115,171,216)", "rgb(245,142,94)"],
            legend: Object.assign({}, options.legend, {
                itemHeight: 8,
            }),
            grid: Object.assign({}, options.grid, {
                right: `${xName.length * (xName.length < 4 ? 24 : 16)}px`,
            }, direction === 'rows' ? { left: 30, } : { bottom: 30, }),
            yAxis: Object.assign({}, options.yAxis, {
                type: 'value',//direction === 'rows' ? 'category' : 'value',
                name: direction === 'rows' ? xName : yName,
                boundaryGap: false, //['5%', '5%'],
                axisLabel: Object.assign({}, options.xAxis?.axisLabel, {
                    formatter: function (val: any) {
                        return val;
                    }
                }),
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
                type: 'value',//direction === 'rows' ? 'value' : 'category',
                name: direction === 'rows' ? yName : xName,
                scale: false,
            }),
            seriesLayoutBy: "row",
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
                        markLine: {
                            symbolSize: 1,
                            lineStyle: {
                                width: 1,
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
                        // color: color,
                        type: "scatter",
                        data: _.cloneDeep(value).map((item: any) => {
                            if (direction === 'rows') {
                                return _.cloneDeep(item).reverse();
                            }
                            return item;
                        }),
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