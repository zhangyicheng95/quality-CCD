import React, { useEffect } from "react";
import * as echarts from "echarts";
import options from "./commonOptions";

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const PieCharts: React.FC<Props> = (props: any) => {
    const { data = [], id, } = props;
    useEffect(() => {
        const dom: any = document.getElementById(`echart-${id}`);
        const myChart = echarts.init(dom);
        const option = Object.assign({}, options, {
            legend: {
                ...options.legend,
                left: "3%"
            },
            xAxis: { show: false },
            yAxis: { show: false },
            tooltip: {
                trigger: 'item',
                formatter: '{b0}<br />{c0}（{d0}%）'
            },
            series: [
                {
                    type: "pie",
                    radius: "50%",
                    top: "-30%",
                    bottom: "-40%",
                    right: "-50%",
                    left: "-50%",
                    label: {
                        position: "inside",
                        fontSize: 15
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
                    labelLine: {
                        length: 15,
                        length2: 10,
                    }
                }
            ]
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
            style={{ width: "100%", height: "100%" }}
            id={`echart-${id}`}
        />
    );

};

export default PieCharts;