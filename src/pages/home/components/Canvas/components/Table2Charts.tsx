import React, { useEffect } from 'react';
import * as _ from 'lodash';
import styles from '../index.module.less';
import TooltipDiv from '@/components/TooltipDiv';
import { message } from 'antd';
import { useModel } from 'umi';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const Table2Charts: React.FC<Props> = (props: any) => {
    const { data = {}, id, } = props;
    const { dataValue = [], fontSize, reverse } = data;
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
        <div id={`echart-${id}`} className={styles.table2Charts} style={{ fontSize }}>
            <div className="charts-header-box flex-box">
                {
                    _.isArray(dataValue) && (dataValue || []).map((item: any, index: number) => {
                        const { name } = item;
                        return <div className="charts-header-item flex-box-center" key={`echart-${id}-tr-th-${index}`}>
                            {name}
                        </div>
                    })
                }
            </div>
            <div className="charts-body-box flex-box">
                {
                    _.isArray(dataValue) ?
                        (dataValue || []).map((item: any, index: number) => {
                            const { value = [] } = item;
                            return <div
                                className="charts-body-tr"
                                key={`echart-${id}-tr-${index}`}
                                style={{ width: `${100 / dataValue?.length}%` }}
                            >
                                {
                                    (!!reverse ? _.cloneDeep(value).reverse() : value).map((val: any, sIndex: number) => {
                                        return <TooltipDiv
                                            className="charts-body-td"
                                            key={`echart-${id}-tr-td-${sIndex}`}
                                            title={val.length > 15 ? val : ''}
                                        >
                                            {val}
                                        </TooltipDiv>
                                    })
                                }
                            </div>
                        })
                        : null
                }
            </div>
        </div>
    );

};

export default Table2Charts;