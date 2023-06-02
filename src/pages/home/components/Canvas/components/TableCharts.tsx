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
    let { dataValue = [], yName, xName, fontSize, reverse } = data;
    if (process.env.NODE_ENV === 'development') {
        dataValue = [
            { "name": "序号", "value": [{ "value": "value1", "color": "red" }, { "value": "value2", "color": "red" }, { "value": "value1", "color": "red" }], "color": "red" },
            { "name": "创建时间", "value": [{ "value": "value1", "color": "red" }, { "value": "value2", "color": "red" }, { "value": "value1", "color": "red" }] }
        ];
    }
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
                <TooltipDiv title={yName} className="charts-header-item">
                    {yName}
                </TooltipDiv>
                <TooltipDiv title={xName} className="charts-header-item">
                    {xName}
                </TooltipDiv>
            </div>
            <div className="charts-body-box">
                {
                    _.isArray(dataValue) ?
                        (!!reverse ? _.cloneDeep(dataValue).reverse() : dataValue).map((item: any, index: number) => {
                            const { name, value, color } = item;
                            if (_.isObject(item?.value[0]) && !_.isArray(item?.value[0])) {
                                // @ts-ignore
                                const { value, color } = item?.value[0];
                                const text = _.isArray(value) ? value.join(',') : value;
                                return <div className="charts-body-tr flex-box" key={`echart-${id}-tr-${index}`}>
                                    <div className="charts-body-td flex-box-center">{name}</div>
                                    <TooltipDiv
                                        className="charts-body-td flex-box-center"
                                        title={text?.length > 10 ? text : ''}
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