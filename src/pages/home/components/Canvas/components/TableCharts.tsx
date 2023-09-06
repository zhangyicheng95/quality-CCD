import TooltipDiv from '@/components/TooltipDiv';
import { message } from 'antd';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useModel } from 'umi';
import styles from '../index.module.less';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const TableCharts: React.FC<Props> = (props: any) => {
    const { data = {}, id, } = props;
    let {
        dataValue = [], yName, xName = '', fontSize, reverse, interlacing,
        des_bordered
    } = data;
    if (process.env.NODE_ENV === 'development') {
        dataValue = [
            { "name": "序号", "value": [{ "value": "value1", "color": "red" }, { "value": "value2", "color": "red" }, { "value": "value1", "color": "red" }], "color": "red" },
            { "name": "创建时间", "value": [{ "value": "value1", "color": "red" }, { "value": "value2", "color": "red" }, { "value": "value1", "color": "red" }] }
        ];
    }
    const domRef = useRef<any>(null);
    const { initialState } = useModel<any>('@@initialState');
    const { params } = initialState;
    const [tableScroll, setTableScroll] = useState(false);

    useEffect(() => {
        if (!_.isArray(dataValue)) {
            message.error('双列表格组件数据格式不正确，请检查');
            console.log('TableCharts:', dataValue);
            localStorage.removeItem(`localGridContentList-${params.id}`);
            return;
        }

        const height = domRef?.current?.clientHeight;
        const valueLength = dataValue[0]?.value?.length;
        if (height > valueLength * 38) {
            setTableScroll(false);
        } else {
            setTableScroll(true);
        }
    }, [dataValue]);

    return (
        <div
            id={`echart-${id}`}
            className={styles.tableCharts}
            ref={domRef}
            style={{ fontSize }}
        >
            <div
                className="charts-header-box flex-box"
                style={tableScroll ? { width: 'calc(100% - 22px)' } : { width: 'calc(100% - 17px)' }}
            >
                <TooltipDiv title={yName} className="charts-header-item">
                    {yName}
                </TooltipDiv>
                <TooltipDiv title={xName} className="charts-header-item">
                    {xName}
                </TooltipDiv>
            </div>
            <div className="charts-body-box" style={des_bordered ? {
                borderWidth: '1px'
            } : {}}>
                {
                    _.isArray(dataValue) ?
                        (!!reverse ? _.cloneDeep(dataValue).reverse() : dataValue).map((item: any, index: number) => {
                            const { name, value, color } = item;
                            if (_.isObject(item?.value[0]) && !_.isArray(item?.value[0])) {
                                // @ts-ignore
                                const { value, color } = item?.value[0];
                                const text = _.isArray(value) ? value.join(',') : value;
                                return <div className={`charts-body-tr flex-box ${(_.isBoolean(interlacing) ? interlacing : true) ? 'charts-body-tr-interlacing' : ''}`} key={`echart-${id}-tr-${index}`}>
                                    <TooltipDiv
                                        className="charts-body-td flex-box-center"
                                        style={des_bordered ? { borderWidth: '1px' } : {}}
                                    >{name}</TooltipDiv>

                                    <TooltipDiv
                                        className="charts-body-td flex-box-center"
                                        title={text?.length > 10 ? text : ''}
                                        style={Object.assign(
                                            !!color ? { color } : {},
                                            des_bordered ? { borderWidth: '1px' } : {}
                                        )}
                                    >
                                        {text}
                                    </TooltipDiv>
                                </div>
                            }
                            const text = _.isArray(value) ? value.join(',') : value;
                            return <div className={`charts-body-tr flex-box ${(_.isBoolean(interlacing) ? interlacing : true) ? 'charts-body-tr-interlacing' : ''}`} key={`echart-${id}-tr-${index}`}>
                                <div className="charts-body-td flex-box-center">{name}</div>
                                <TooltipDiv
                                    className="charts-body-td flex-box-center"
                                    title={text.length > 10 ? text : ''}
                                    style={Object.assign(
                                        !!color ? { color } : {},
                                        des_bordered ? { borderWidth: '1px' } : {}
                                    )}
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