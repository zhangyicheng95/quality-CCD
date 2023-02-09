import React, { useEffect, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const AlertCharts: React.FC<Props> = (props: any) => {
    const { data = [], id, } = props;

    return (
        <div
            id={`echart-${id}`}
            className={`${styles.alertCharts} flex-box`}
        >
            {
                (data || []).map((item: any, index: number) => {
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