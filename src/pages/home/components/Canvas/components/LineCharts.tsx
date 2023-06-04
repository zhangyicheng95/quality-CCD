import React, { Fragment, useEffect } from 'react';
import * as echarts from 'echarts';
import options from './commonOptions';
import * as _ from 'lodash';
import { connect, useModel } from 'umi';
import { message } from 'antd';
import { CompressOutlined } from '@ant-design/icons';

interface Props {
    data: any,
    id: any,
    setMyChartVisible?: any,
    onClick?: any,
}

const LineCharts: React.FC<Props> = (props: any) => {
    let myChart: any = null;
    const { data = {}, id, legend, dispatch, setMyChartVisible } = props;
    let { dataValue = [], yName, xName, dataZoom } = data;
    if (process.env.NODE_ENV === 'development') {
        dataValue = [
            {
                "name": "上限",
                "value": 2.2,
                "type": "markLine"
            },
            {
                "name": "标准值",
                "value": 1.6,
                "type": "markLine"
            },
            {
                "name": "下限",
                "value": 1.53,
                "type": "markLine"
            },
            {
                "name": "data1",
                "value": [[1, 1.54], [2, 0], [3, 1.57], [4, 1.67], [5, 1.89], [6, 1.6], [7, 1.51], [8, 1.55], [9, 1.79], [10, 1.65], [11, 1.6], [12, 1.76], [13, 1.62], [14, 1.76]]
            },
            {
                "name": "data2",
                "value": [[1, 1.62], [2, 1.53], [3, 1.8], [4, 1.76], [5, 1.83], [6, 1.63], [7, 1.78], [8, 1.85], [9, 1.5], [10, 1.59], [11, 1.7], [12, 1.74], [13, 1.79], [14, 1.69]]
            }
        ];
    }
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
        let minValue: any = null,
            maxValue: any = null;
        let maxLength = 0;
        (dataValue || []).forEach((item: any, index: number) => {
            const { value, type } = item;
            if (type === 'markLine') {
                return;
            } else {
                if (item?.value?.length > maxLength) {
                    maxLength = item.value.length;
                }
                if (_.isNull(minValue) || _.isNull(maxValue)) {
                    minValue = value[0][0];
                    maxValue = value[value.length - 1][0];
                    return;
                }
                if (value[0][0] < minValue) {
                    minValue = value[0][0];
                }
                if (value[0][0] > maxValue) {
                    maxValue = value[0][0];
                }
            }
        });

        const option = Object.assign({}, options, {
            legend: Object.assign(
                {}, options.legend,
                {
                    data: (dataValue || []).map((item: any) => {
                        const { name } = item;
                        return name;
                    })
                },
                legend[id] ? { selected: legend[id], } : {}
            ),
            grid: Object.assign({}, options.grid, {
                right: `${xName.length * (xName.length < 4 ? 24 : 16)}px`,
                bottom: 40
            }),
            dataZoom: [Object.assign({
                type: "slider",
                show: true,
                realtime: true,
                start: !!dataZoom ? ((maxLength - dataZoom) / maxLength * 100) : 0,
                end: 100,
                showDetai: false,
                moveHandleStyle: {
                    opacity: 0,
                }
            }, {
                orient: 'horizontal',
                bottom: 20,
                left: 80,
                right: 60,
                height: 20,
            })],
            yAxis: Object.assign({}, options.yAxis, {
                type: 'value',
                name: yName,
                boundaryGap: false,
                scale: true,
            }),
            xAxis: Object.assign({}, options.xAxis, {
                type: 'value',
                name: xName,
                boundaryGap: [0, 0],
                min: minValue,
                max: maxValue,
                scale: true,
            }),
            series: (dataValue || []).map((item: any) => {
                const { name, value, type } = item;
                if (type === 'markLine') {
                    return {
                        name: name,
                        type: 'line',
                        symbolSize: 0,
                        label: {
                            show: false
                        },
                        animation: false,
                        emphasis: {
                            focus: 'series'
                        },
                        markLine: {
                            data: [
                                {
                                    name: name,
                                    yAxis: value,
                                    type: "median",
                                },
                            ],
                            lineStyle: {
                                width: 1,
                                // color: '#3FBF00',
                            },
                            label: {
                                show: true,
                                position: 'middle',
                                distance: 5,
                                formatter: `${name}：${value}`
                            },
                            silent: false, // 鼠标悬停事件, true悬停不会出现实线
                            symbol: 'none', // 去掉箭头
                        },
                        data: [[minValue, value]]
                    }
                } else {
                    return {
                        name: name,
                        type: 'line',
                        symbolSize: 2,
                        smooth: false, // 是否平滑曲线
                        label: {
                            show: false
                        },
                        animation: false,
                        emphasis: {
                            focus: 'series'
                        },
                        data: value.filter((i: any) => !!i[1])
                    }
                }
            })
        });
        myChart.on('legendselectchanged', function (obj: any) {
            const { selected } = obj;
            dispatch({
                type: 'themeStore/shortTimeAction',
                payload: { [id]: selected }
            });
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
    }, [data, legend]);

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

export default connect(({ home, themeStore }) => ({
    legend: themeStore.legend,
}))(LineCharts);