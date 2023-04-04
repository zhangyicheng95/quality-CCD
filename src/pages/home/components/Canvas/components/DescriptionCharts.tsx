import React, { useEffect, } from 'react';
import { Descriptions, message, } from 'antd';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { useModel } from 'umi';
import { guid } from '@/utils/utils';

interface Props {
    data: any,
    id: any,
}

const DescriptionCharts: React.FC<Props> = (props: any) => {
    const { data = {}, id, } = props;
    const { dataValue, basicInfoData, des_bordered, des_column, des_layout, des_size, } = data;
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
            className={`${styles.descriptionCharts} flex-box-center`}
        >
            {
                <Descriptions
                    bordered={des_bordered || false}
                    column={des_column || 2}
                    layout={des_layout || 'horizontal'}
                    size={des_size || 'default'}
                >
                    {
                        basicInfoData.concat(dataValue).map((item: any, index: number) => {
                            const { id = guid(), name, value, color } = item;
                            if (!_.isObject(value?.[0])) {
                                return <Descriptions.Item label={name} key={id} style={!!color ? { color } : {}}>
                                    {value}
                                </Descriptions.Item>
                            } else {
                                // @ts-ignore
                                const { value, color } = item?.value[0];
                                return <Descriptions.Item label={name} key={id} style={!!color ? { color } : {}}>
                                    {value}
                                </Descriptions.Item>
                            }
                        })
                    }
                </Descriptions>
            }
        </div>
    );

};

export default DescriptionCharts;