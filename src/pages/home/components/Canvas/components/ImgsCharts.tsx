import React from 'react';
import { Image } from 'antd';
import styles from '../index.module.less';
import * as _ from 'lodash';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const ImgsCharts: React.FC<Props> = (props: any) => {
    const { data = [], id, } = props;

    return (
        <div
            id={`echart-${id}`}
            className={`${styles.imgsCharts} flex-box`}
        >
            {
                (data || []).map((item: any, index: number) => {
                    const { name, value } = item;
                    return <div
                        id={`echart-${id}`}
                        className={`flex-box-center img-item`}
                    >
                        <Image
                            src={value}
                            alt={name || 'logo'}
                            style={{ width: '100%', height: 'auto' }}
                        />
                    </div>
                })
            }
        </div>
    );

};

export default ImgsCharts;