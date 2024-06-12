import React, { useEffect, useRef, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { useModel } from 'umi';
import { message, Progress } from 'antd';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const ProgressCharts: React.FC<Props> = (props: any) => {
    const { data = {}, id, } = props;
    let { dataValue = 0, barColor, progressType, progressSize, progressSteps } = data;
    if (process.env.NODE_ENV === 'development') {
        dataValue = 0.5;
    }
    const dom = useRef<any>();
    const { initialState } = useModel<any>('@@initialState');
    const { params } = initialState;

    const [fontSize, setFontSize] = useState(1);

    useEffect(() => {
        if (!_.isNumber(dataValue)) {
            message.error('进度条组件数据格式不正确，请检查');
            console.log('ProgressCharts:', dataValue);
            return;
        }
        if (dom?.current?.clientWidth > dom?.current?.clientHeight) {
            setFontSize(dom?.current?.clientHeight / 120);
        } else {
            setFontSize(dom?.current?.clientWidth / 120);
        }
    }, [dataValue, dom?.current?.clientWidth, dom?.current?.clientHeight]);

    return (
        <div
            id={`echart-${id}`}
            className={`${styles.progressCharts} ${progressType === 'line' ? 'flex-box' : 'flex-box-center'}`}
            style={progressType === 'line' ? { height: progressSize } : {}}
            // @ts-ignore
            ref={dom}
        >
            <Progress
                style={progressType === 'line' ? {} : { transform: `scale(${fontSize - 0.1})` }}
                percent={Number((dataValue * 100)?.toFixed(2))}
                type={progressType}
                strokeColor={barColor !== 'default' ? barColor : ''}
                status="active"
                steps={progressSteps}
            />
        </div>
    );

};

export default ProgressCharts;