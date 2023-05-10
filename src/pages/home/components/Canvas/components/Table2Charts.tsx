import React, { useEffect, useMemo, useState } from 'react';
import * as _ from 'lodash';
import styles from '../index.module.less';
import TooltipDiv from '@/components/TooltipDiv';
import { message } from 'antd';
import { useModel } from 'umi';
import { guid } from '@/utils/utils';
import { updateParams } from '@/services/api';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const Table2Charts: React.FC<Props> = (props: any) => {
    const { data = {}, id, } = props;
    let { dataValue = [], fontSize, reverse, tableSize = [] } = data;
    const { initialState } = useModel<any>('@@initialState');
    const { params } = initialState;
    const [tableSizeSelf, setTableSizeSelf] = useState(tableSize);

    useEffect(() => {
        if (!_.isArray(dataValue)) {
            message.error('数据格式不正确，请检查');
            localStorage.removeItem(`localGridContentList-${params.id}`);
            return;
        }
    }, [dataValue,]);

    const onMoveIconMouseDown = (ev: any, index: number) => {
        const { target, } = ev;
        const parent = target.parentNode;
        const { clientWidth } = parent;
        let width = 0;

        document.onmousemove = (e: any) => {
            width = Math.abs(clientWidth - (ev.pageX - e.pageX));
            parent.style.width = width + 'px';
            parent.style.minWidth = width + 'px';
        }
        document.onmouseup = (e: any) => {
            const chartsBox: any = document.getElementById(`echart-${id}`);
            const { clientWidth } = chartsBox;
            const tableSizes = !_.isArray(tableSize) ? _.cloneDeep(tableSize) : [];

            if (!!tableSizes?.length) {
                tableSizes[index] = (width / clientWidth * 100) + '%';
            } else {
                dataValue.forEach((item: any, ind: number) => {
                    if (ind === index) {
                        tableSizes[index] = (width / clientWidth * 100) + '%';
                    } else {
                        tableSizes[ind] = 0;
                    }
                });
            }
            setTableSizeSelf(() => tableSizes.concat(guid()));
            updateParams({
                id: params.id,
                data: {
                    ...params,
                    contentData: {
                        ...params?.contentData,
                        content: params?.contentData?.content.map((item: any) => {
                            if (item.id === id) {
                                return Object.assign({}, item, {
                                    tableSize: tableSizes
                                });
                            }
                            return item;
                        })
                    }
                },
            }).then((res: any) => {
                if (res && res.code === 'SUCCESS') {

                } else {
                    message.error(res?.msg || res?.message || '接口异常');
                }
            });
            document.onmousemove = (e: any) => {
                // 释放鼠标
            }
        }
    };

    return (
        <div id={`echart-${id}`} className={styles.table2Charts} style={{ fontSize }}>
            <div className="charts-header-box flex-box">
                {
                    _.isArray(dataValue) && (dataValue || []).map((item: any, index: number) => {
                        const { name } = item;
                        return <div
                            className="charts-header-item flex-box"
                            key={`echart-${id}-tr-th-${index}`}
                            style={Object.assign(
                                !!tableSizeSelf?.[index] ?
                                    {
                                        width: tableSizeSelf?.[index],
                                        minWidth: tableSizeSelf?.[index],
                                        maxWidth: tableSizeSelf?.[index],
                                    }
                                    : {}
                            )}
                        >
                            <TooltipDiv title={name} className="charts-header-item-title">
                                {name}
                            </TooltipDiv>
                            {
                                (index + 1) === dataValue?.length ? null :
                                    <div
                                        id={`charts-header-item-move-${index}`}
                                        className="charts-header-item-border"
                                        onMouseDown={(e: any) => {
                                            if (window.location.hash.indexOf('edit') > -1) {
                                                onMoveIconMouseDown(e, index);
                                            }
                                        }}
                                    />
                            }
                        </div>
                    })
                }
            </div>
            <div className="charts-body-box flex-box">
                {
                    _.isArray(dataValue) ?
                        (dataValue || []).map((item: any, index: number) => {
                            const { value = [], color } = item;
                            return <div
                                className="charts-body-tr"
                                key={`echart-${id}-tr-${index}`}
                                style={Object.assign(
                                    !!tableSizeSelf?.[index] ?
                                        {
                                            width: tableSizeSelf?.[index],
                                            minWidth: tableSizeSelf?.[index],
                                            maxWidth: tableSizeSelf?.[index],
                                        }
                                        : {},
                                    !!color ? { color } : {}
                                )}
                            >
                                {
                                    (!!reverse ? _.cloneDeep(value).reverse() : value).map((val: any, sIndex: number) => {
                                        if (_.isObject(val)) {
                                            // @ts-ignore
                                            const { value, color } = val;
                                            return <TooltipDiv
                                                className="charts-body-td"
                                                key={`echart-${id}-tr-td-${sIndex}`}
                                                title={value?.length > 15 ? value : ''}
                                                style={!!color ? { color } : {}}
                                            >
                                                {value}
                                            </TooltipDiv>
                                        }
                                        return <TooltipDiv
                                            className="charts-body-td"
                                            key={`echart-${id}-tr-td-${sIndex}`}
                                            title={val?.length > 15 ? val : ''}
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