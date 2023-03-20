import React, { Fragment, useEffect } from "react";
import * as echarts from "echarts";
import options from "./commonOptions";
import _ from "lodash";
import { message } from "antd";
import { connect, useModel } from "umi";
import { CompressOutlined } from "@ant-design/icons";

interface Props {
    data: any,
    id: any,
    setMyChartVisible?: any,
    onClick?: any,
}

const PieCharts: React.FC<Props> = (props: any) => {
    let myChart: any = null;
    const { data = {}, id, legend, dispatch, setMyChartVisible } = props;
    const { initialState } = useModel<any>('@@initialState');
    const { params } = initialState;

    useEffect(() => {
        if (!_.isArray(data)) {
            message.error('数据格式不正确，请检查');
            localStorage.removeItem(`localGridContentList-${params.id}`);
            return;
        }
        const dom: any = document.getElementById(`echart-${id}`);
        myChart = echarts.init(dom);
        const option = Object.assign({}, options, {
            legend: Object.assign({}, options.legend,
                { left: "3%" },
                legend[id] ? { selected: legend[id], } : {}
            ),
            grid: { ...options.grid, top: "bottom", },
            xAxis: { show: false },
            yAxis: { show: false },
            tooltip: {
                trigger: 'item',
                formatter: '{b0}<br />{c0}（{d0}%）'
            },
            series: [
                {
                    type: "pie",
                    radius: ["20%", "70%"],
                    // top: "-30%",
                    // bottom: "-40%",
                    // right: "-50%",
                    // left: "-50%",
                    // label: {
                    //     position: "inside",
                    //     fontSize: 15,
                    //     formatter: `{b0}\n（{d0}%）`
                    // },
                    // labelLine: {
                    //     length: 15,
                    //     length2: 10,
                    // }
                    label: {
                        alignTo: 'edge',
                        fontSize: data?.length > 4 ? 9 : 11,
                        formatter: '{name|{b}}\n{time|{d} %}',
                        // textBorderWidth: 3,
                        minMargin: 5,
                        edgeDistance: 10,
                        lineHeight: 16,
                        rich: {
                            time: {
                                fontSize: 10,
                                color: '#999'
                            }
                        }
                    },
                    labelLine: {
                        length: 15,
                        length2: 0,
                        maxSurfaceAngle: 80
                    },
                    labelLayout: function (params: any) {
                        const isLeft = params.labelRect.x < myChart.getWidth() / 2;
                        const points = params.labelLinePoints;
                        // Update the end point.
                        points[2][0] = isLeft
                            ? params.labelRect.x
                            : params.labelRect.x + params.labelRect.width;
                        return {
                            labelLinePoints: points
                        };
                    },
                    data: (data || []).map((item: any) => {
                        const { name, value } = item;
                        return {
                            name: name,
                            value: value
                        }
                    }),
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)"
                        }
                    },
                }
            ]
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
}))(PieCharts);