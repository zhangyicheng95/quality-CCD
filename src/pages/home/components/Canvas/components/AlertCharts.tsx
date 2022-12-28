import React, { useEffect, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const AlertCharts: React.FC<Props> = (props: any) => {
    const { data, id, } = props;
    const [fontSize, setFontSize] = useState('60px');
    const dom = document.getElementById(`echart-${id}`);

    useEffect(() => {
        if (!!dom) {
            const minSize = Math.min(dom.clientWidth, dom.clientHeight);
            setFontSize(`${minSize / 2}px`);
        }
    }, [dom?.clientHeight, dom?.clientWidth]);

    return (
        <div
            id={`echart-${id}`}
            className={`${styles.alertCharts} flex-box-center ${_.isBoolean(data) ? (data ? 'OK' : 'NG') : ''}`}
            style={{ fontSize }}
        >
            {_.isBoolean(data) ? (data ? 'OK' : 'NG') : 'Default'}
        </div>
    );

};

export default AlertCharts;