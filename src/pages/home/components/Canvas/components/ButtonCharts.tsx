import React, { useEffect, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { Button, Input, message } from 'antd';
import { btnFetch } from '@/services/api';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const ButtonCharts: React.FC<Props> = (props: any) => {
    const { data = {}, id, } = props;
    const { yName, xName, fetchType } = data;
    const [value, setValue] = useState('');

    const onChange = (e: any) => {
        const val = e?.target?.value;
        try {
            JSON.parse(val);
            setValue(val);
        } catch (e) {
            setValue(JSON.stringify({ msg: val }));
        }

    };
    return (
        <div
            id={`echart-${id}`}
            className={`${styles.buttonCharts} flex-box`}
        >
            <Input placeholder='传递参数' onChange={(e) => onChange(e)} />
            <Button type="primary" onClick={() => {
                try {
                    JSON.parse(value)
                } catch (e) {
                    message.error('传递参数 格式不正确');
                    return;
                }
                btnFetch(fetchType, xName, JSON.parse(value));
            }}>{yName}</Button>
        </div>
    );

};

export default ButtonCharts;