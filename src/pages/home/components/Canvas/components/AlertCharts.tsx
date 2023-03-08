import React, { useEffect } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { useModel } from 'umi';
import { message } from 'antd';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const AlertCharts: React.FC<Props> = (props: any) => {
    const { data = [], id, } = props;
    const { initialState } = useModel<any>('@@initialState');
    const { params } = initialState;

    useEffect(() => {
        if (!_.isArray(data)) {
            message.error('数据格式不正确，请检查');
            localStorage.removeItem(`localGridContentList-${params.id}`);
            return;
        }
    }, [data]);
    return (
        <div
            id={`echart-${id}`}
            className={`${styles.alertCharts} flex-box`}
        >
            {
                _.isArray(data) && (data || []).map((item: any, index: number) => {
                    const { name, value } = item;
                    return <div
                        id={`echart-${id}`}
                        className={`flex-box-center alert-item ${!!value ? 'OK' : 'NG'}`}
                    >
                        <span style={{ position: 'absolute', left: 4, top: 4, fontSize: 12 }}>{name}</span>
                        {!!value ? 'OK' : 'NG'}
                    </div>
                })
            }
        </div>
    );

};

export default AlertCharts;