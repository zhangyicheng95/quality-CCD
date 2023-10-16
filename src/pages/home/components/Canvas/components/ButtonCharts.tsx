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
    const { yName, xName = '', fetchType, ifNeedClear } = data;
    const [value, setValue] = useState('');

    const onChange = (e: any) => {
        const val = e?.target?.value;
        try {
            const res = JSON.parse(val);
            if (fetchType === 'post' && !_.isObject(res)) {
                setValue(JSON.stringify({ msg: val }));
            } else {
                setValue(val);
            }
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
                let params: any = null;
                if (!_.isUndefined(value) && !_.isNull(value) && (_.isString(value) && !!value)) {
                    try {
                        params = JSON.parse(value);
                    } catch (e) {
                        console.log('参数按钮传递参数格式不对:', e);
                        message.error('传递参数 格式不正确');
                        params = '';
                    }
                }
                console.log(params)
                btnFetch(fetchType, xName, params);
            }}>{yName}</Button>
            {
                (!!value && ifNeedClear) ?
                    <Button onClick={() => {
                        setValue('');
                        window.location.reload();
                    }}>清空</Button>
                    : null
            }
        </div>
    );

};

export default ButtonCharts;