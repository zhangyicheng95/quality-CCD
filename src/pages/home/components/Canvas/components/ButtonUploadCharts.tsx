import React, { useEffect, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { AutoComplete, Button, message } from 'antd';
import { btnFetch } from '@/services/api';
import { useModel } from 'umi';
import TooltipDiv from '@/components/TooltipDiv';
import FileManager from '@/components/FileManager';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const ButtonUploadCharts: React.FC<Props> = (props: any) => {
    const { data = {}, id, } = props;
    const { fontSize = 14, yName = '按钮', xName = '', fetchType, valueColor = 'primary' } = data;
    const [selectAreaPathVisible, setSelectAreaPathVisible] = useState(false);

    return (
        <div
            id={`echart-${id}`}
            className={`${styles.buttonUploadCharts}`}
        >
            <Button
                type={['primary', 'link', 'ghost'].includes(valueColor) ? valueColor : ''}
                style={Object.assign({ fontSize },
                    !['primary', 'link', 'ghost'].includes(valueColor) ? { backgroundColor: valueColor, color: '#fff' } : {}
                )}
                onClick={() => setSelectAreaPathVisible(true)}
            >{yName}</Button>

            {
                // 选择运行轨迹
                selectAreaPathVisible ?
                    <FileManager
                        onOk={(val: any) => {
                            const { value } = val;
                            btnFetch(fetchType, xName, { data: value }).then((res: any) => {
                                if (res && res.code === 'SUCCESS') {
                                    message.success('success');
                                    setSelectAreaPathVisible(false);
                                } else {
                                    message.error(res?.msg || res?.message || "接口异常");
                                };
                            });
                        }}
                        onCancel={() => {
                            setSelectAreaPathVisible(false);
                        }}
                    />
                    : null
            }
        </div>
    );

};

export default ButtonUploadCharts;