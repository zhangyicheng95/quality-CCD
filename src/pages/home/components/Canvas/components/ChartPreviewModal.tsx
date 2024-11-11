import React, { memo, useEffect, useState } from 'react';
import * as echarts from 'echarts';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { Modal } from 'antd';

interface Props {
    option: any,
    onCancel: any,
}

const ChartPreviewModal: React.FC<Props> = (props: any) => {
    const { option, onCancel } = props;
    useEffect(() => {
        const dom: any = document.getElementById(`echart-preview-box`);
        const myChart = echarts.init(dom);
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
    }, [option]);
    return (
        <Modal
            title={"统计预览"}
            width="calc(100vw - 48px)"
            wrapClassName={"full-screen-modal"}
            centered
            open={true}
            footer={null}
            getContainer={false}
            onCancel={onCancel}
        >
            <div
                style={{ width: '100%', height: '100%' }}
                id={`echart-preview-box`}
            />
        </Modal>
    );

};

export default memo(ChartPreviewModal);