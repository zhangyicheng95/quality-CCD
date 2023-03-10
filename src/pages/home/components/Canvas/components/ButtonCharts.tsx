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

    useEffect(() => {

    }, [data]);
    return (
        <div
            id={`echart-${id}`}
            className={`${styles.buttonCharts} flex-box`}
        >
            <Input placeholder='传递参数' value={value} onChange={(e) => setValue(e?.target?.value)} />
            <Button type="primary" onClick={() => {
                try {
                    JSON.parse(value)
                } catch (e) {
                    message.error('传递参数 格式不正确');
                    return;
                }
                btnFetch(fetchType, xName, JSON.parse(value));
                console.log(xName, fetchType, value)
            }}>{yName}</Button>
        </div>
    );

};

export default ButtonCharts;