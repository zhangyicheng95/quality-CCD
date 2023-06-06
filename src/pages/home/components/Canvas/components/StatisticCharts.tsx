import React, { Fragment, useEffect, useMemo, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { connect, useModel } from 'umi';
import { Button, Form, message } from 'antd';
import { FormatWidgetToDom } from '@/pages/control';
import MonacoEditor from '@/components/MonacoEditor';
import PlatFormModal from '@/components/platForm';
import FileManager from '@/components/FileManager';
import TooltipDiv from '@/components/TooltipDiv';
import { updateParams } from '@/services/api';

interface Props {
    data: any,
    id: any,
    setMyChartVisible?: any,
    onClick?: any,
}

const StatisticCharts: React.FC<Props> = (props: any) => {
    const { data = {}, id, } = props;
    let { dataValue, fontSize, yName } = data;
    if (process.env.NODE_ENV === 'development') {
        dataValue = 10
    }
    const { initialState } = useModel<any>('@@initialState');
    const { params } = initialState;

    useEffect(() => {
        if (!_.isArray(dataValue)) {
            message.error('数据格式不正确，请检查');
            localStorage.removeItem(`localGridContentList-${params.id}`);
            return;
        }

    }, [dataValue]);

    return (
        <div
            id={`echart-${id}`}
            className={`${styles.statisticCharts} flex-box`}
            style={{ fontSize }}
        >
            <div className="statistic-title">{yName}</div>
            <div className="statistic-value" style={{ fontSize: Number(fontSize) + 10 }}>{dataValue}</div>
        </div>
    );

};

export default StatisticCharts;