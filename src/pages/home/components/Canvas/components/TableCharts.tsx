import TooltipDiv from '@/components/TooltipDiv';
import { message } from 'antd';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { useModel } from 'umi';
import styles from '../index.module.less';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const TableCharts: React.FC<Props> = (props: any) => {
    const { data = {}, id, } = props;
    const { dataValue = [], yName, xName, fontSize, reverse } = data;
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
        <div id={`echart-${id}`} className={styles.tableCharts} style={{ fontSize }}>
            <div className="charts-header-box flex-box">
                <div className="charts-header-item flex-box-center">
                    {yName}
                </div>
                <div className="charts-header-item flex-box-center">
                    {xName}
                </div>
            </div>
            <div className="charts-body-box">
                {
                    _.isArray(dataValue) ?
                        (!!reverse ? _.cloneDeep(dataValue).reverse() : dataValue).map((item: any, index: number) => {
                            const { name, value, color } = item;
                            if (_.isObject(item?.value)) {
                                const { value, color } = item?.value;
                                const text = _.isArray(value) ? value.join(',') : value;
                                return <div className="charts-body-tr flex-box" key={`echart-${id}-tr-${index}`}>
                                    <div className="charts-body-td flex-box-center">{name}</div>
                                    <TooltipDiv
                                        className="charts-body-td flex-box-center"
                                        title={text.length > 10 ? text : ''}
                                        style={!!color ? { color } : {}}
                                    >
                                        {text}
                                    </TooltipDiv>
                                </div>
                            }
                            const text = _.isArray(value) ? value.join(',') : value;
                            return <div className="charts-body-tr flex-box" key={`echart-${id}-tr-${index}`}>
                                <div className="charts-body-td flex-box-center">{name}</div>
                                <TooltipDiv
                                    className="charts-body-td flex-box-center"
                                    title={text.length > 10 ? text : ''}
                                    style={!!color ? { color } : {}}
                                >
                                    {text}
                                </TooltipDiv>
                            </div>
                        })
                        : null
                }
            </div>
        </div>
    );

};

export default TableCharts;