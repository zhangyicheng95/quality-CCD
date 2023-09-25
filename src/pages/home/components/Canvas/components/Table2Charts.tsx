import React, { useEffect, useMemo, useRef, useState } from 'react';
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
    let {
        dataValue = [], fontSize, reverse, tableSize = [], interlacing,
        des_bordered, headerBackgroundColor
    } = data;
    if (process.env.NODE_ENV === 'development') {
        reverse = true;
        dataValue = [
            {
                name: '左极耳',
                value: [
                    { value: 37.69, color: 'red' },
                    { value: 37.69, color: 'red' },
                    { value: 37.69, color: 'red' },
                    { value: 37.69, color: 'red' },
                    { value: 37.69, color: 'red' },
                    { value: 37.69, color: 'red' },
                    { value: 37.69, color: 'red' },
                ],
                color: null,
            },
            {
                name: '左陶瓷',
                value: [
                    { value: 2.313, color: 'red' },
                    { value: 2.313, color: 'red' },
                    { value: 2.313, color: 'red' },
                    { value: 2.313, color: 'red' },
                    { value: 2.313, color: 'red' },
                    { value: 2.313, color: 'red' },
                    { value: 2.313, color: 'red' },

                ],
                color: null,
            },
            {
                name: '左涂覆',
                value: [
                    { value: 377.083, color: 'red' },
                    { value: 377.083, color: 'red' },
                    { value: 377.083, color: 'red' },
                    { value: 377.083, color: 'red' },
                    { value: 377.083, color: 'red' },
                    { value: 377.083, color: 'red' },
                    { value: 377.083, color: 'red' },

                ],
                color: null,
            },
            {
                name: '左中陶瓷',
                value: [
                    { value: 1.754, color: 'red' },
                    { value: 1.754, color: 'red' },
                    { value: 1.754, color: 'red' },
                    { value: 1.754, color: 'red' },
                    { value: 1.754, color: 'red' },
                    { value: 1.754, color: 'red' },
                    { value: 1.754, color: 'red' },

                ],
                color: null,
            },
            {
                name: '中极耳',
                value: [
                    { value: 79.556, color: 'red' },
                    { value: 79.556, color: 'red' },
                    { value: 79.519, color: 'red' },
                    { value: 79.556, color: 'red' },
                    { value: 79.556, color: 'red' },
                    { value: 79.556, color: 'red' },
                    { value: 79.556, color: 'red' },

                ],
                color: null,
            },
            {
                name: '右中陶瓷',
                value: [
                    { value: -1, color: 'red' },
                    { value: -1, color: 'red' },
                    { value: -1, color: 'red' },
                    { value: -1, color: 'red' },
                    { value: -1, color: 'red' },
                    { value: -1, color: 'red' },
                    { value: -1, color: 'red' },

                ],
                color: null,
            },
            {
                name: '右涂覆',
                value: [
                    { value: 376.853, color: 'red' },
                    { value: 376.853, color: 'red' },
                    { value: 376.853, color: 'red' },
                    { value: 376.853, color: 'red' },
                    { value: 376.853, color: 'red' },
                    { value: 376.853, color: 'red' },
                    { value: 376.853, color: 'red' },

                ],
                color: null,
            },
            {
                name: '右陶瓷',
                value: [
                    { value: -1, color: 'red' },
                    { value: -1, color: 'red' },
                    { value: -1, color: 'red' },
                    { value: -1, color: 'red' },
                    { value: -1, color: 'red' },
                    { value: -1, color: 'red' },
                    { value: -1, color: 'red' },

                ],
                color: null,
            },
            {
                name: '右极耳',
                value: [
                    { value: 39.898, color: 'red' },
                    { value: 45.343, color: 'red' },
                    { value: 39.898, color: 'red' },
                    { value: 39.898, color: 'red' },
                    { value: 39.898, color: 'red' },
                    { value: 39.898, color: 'red' },
                    { value: 39.898, color: 'red' },

                ],
                color: null,
            },
            {
                name: '距离(mm)',
                value: [
                    { value: 'http://D:/123/asd/img.png', color: null },
                    { value: 'http://D:/123/asd/img.png', color: null },
                    { value: 'http://D:/123/asd/img.png', color: null },
                    { value: 'http://D:/123/asd/img.png', color: null },
                    { value: 'http://D:/123/asd/img.png', color: null },
                    { value: 'http://D:/123/asd/img.png', color: null },
                    { value: 'http://D:/123/asd/img.png', color: null },

                ],
                color: null,
            },
        ];
    }
    const { initialState, setInitialState } = useModel<any>('@@initialState');
    const { params } = initialState;
    const domRef = useRef<any>(null);
    const [tableSizeSelf, setTableSizeSelf] = useState(tableSize);
    const [tableScroll, setTableScroll] = useState(false);

    useEffect(() => {
        if (!_.isArray(dataValue)) {
            message.error('通用表格组件数据格式不正确，请检查');
            console.log('Table2Charts:', dataValue);
            return;
        }

        const height = domRef?.current?.clientHeight;
        const valueLength = dataValue[0]?.value?.length;
        if (height > valueLength * 38) {
            setTableScroll(false);
        } else {
            setTableScroll(true);
        }
    }, [dataValue,]);

    const onMoveIconMouseDown = (ev: any, index: number) => {
        const { target, } = ev;
        const parent = target.parentNode;
        const { clientWidth } = parent;
        let width = 0;

        domRef.current.onmousemove = (e: any) => {
            width = Math.abs(clientWidth - (ev.pageX - e.pageX));
            parent.style.width = width + 'px';
            parent.style.minWidth = width + 'px';
        }
        domRef.current.onmouseup = (e: any) => {
            const chartsBox: any = document.getElementById(`echart-${id}`);
            const { clientWidth } = chartsBox;
            const tableSizes = _.isArray(tableSize) ? _.cloneDeep(tableSize) : [];

            if (!!tableSizes?.length) {
                tableSizes[index] = (width / clientWidth * 100) + '%';
            } else {
                dataValue.forEach((item: any, ind: number) => {
                    if (ind === index) {
                        tableSizes[index] = (width / clientWidth * 100) + '%';
                    } else {
                        tableSizes[ind] = !!tableSizes[ind] ? tableSizes[ind] : 0;
                    }
                });
            }
            setTableSizeSelf(tableSizes);

            const updateParam = {
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
            };
            setInitialState((preInitialState: any) => ({
                ...preInitialState,
                params: updateParam
            }));
            updateParams({
                id: params.id,
                data: updateParam,
            }).then((res: any) => {
                if (res && res.code === 'SUCCESS') {
                    // setInitialState((preInitialState: any) => ({
                    //     ...preInitialState,
                    //     params: res?.data
                    // }));
                } else {
                    message.error(res?.msg || res?.message || '接口异常');
                }
            });
            domRef.current.onmousemove = (e: any) => {
                // 释放鼠标
            }
        }
    };

    return (
        <div
            id={`echart-${id}`}
            className={styles.table2Charts}
            ref={domRef}
            style={{ fontSize }}
        >
            <div
                className="charts-header-box flex-box"
                style={Object.assign({},
                    tableScroll ? { width: 'calc(100% - 6px)' } : { width: 'calc(100% - 1px)' },
                    (headerBackgroundColor === 'transparent') ? { backgroundColor: 'transparent' } : {}
                )}
            >
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
            <div className="charts-body-box flex-box" style={des_bordered ? {
                borderWidth: '1px'
            } : {}}>
                {
                    _.isArray(dataValue) ?
                        (dataValue || []).map((item: any, index: number) => {
                            const { value = [], color } = item;
                            if (!_.isArray(value)) {
                                message.error('推送信息错误，请检查', 5);
                                return null;
                            }
                            return <div
                                className={`charts-body-tr`}
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
                                            return <div
                                                key={`echart-${id}-tr-td-${sIndex}-${value}`}
                                                className={`flex-box charts-body-td ${(_.isBoolean(interlacing) ? interlacing : true) ? 'charts-body-td-interlacing' : ''}`}
                                            >
                                                <TooltipDiv
                                                    className={`charts-body-td-title`}
                                                    title={value?.length > 15 ? value : ''}
                                                    style={Object.assign(
                                                        !!color ? { color } : {},
                                                        des_bordered ? { borderWidth: '1px' } : {}
                                                    )}
                                                    placement={"top"}
                                                    onClick={value?.indexOf?.('http://') > -1 ? () => {
                                                        window.open(value, "_blank");
                                                    } : null}
                                                >
                                                    {value?.indexOf?.('http://') > -1 ? "查看" : value}
                                                </TooltipDiv>
                                                {
                                                    (!des_bordered || (index + 1) === dataValue?.length) ? null :
                                                        <div className="charts-body-item-border" />
                                                }
                                            </div>
                                        }
                                        return <div
                                            key={`echart-${id}-tr-td-${sIndex}-${val}`}
                                            className={`flex-box charts-body-td ${(_.isBoolean(interlacing) ? interlacing : true) ? 'charts-body-td-interlacing' : ''}`}
                                        >
                                            <TooltipDiv
                                                className={`charts-body-td-title`}
                                                title={val?.length > 15 ? val : ''}
                                                style={Object.assign(
                                                    !!color ? { color } : {},
                                                    des_bordered ? { borderWidth: '1px' } : {}
                                                )}
                                                placement={"top"}
                                                onClick={val?.indexOf?.('http://') > -1 ? () => {
                                                    window.open(val, "_blank");
                                                } : null}
                                            >
                                                {val?.indexOf?.('http://') > -1 ? "查看" : val}
                                            </TooltipDiv>
                                            {
                                                (!des_bordered || (index + 1) === dataValue?.length) ? null :
                                                    <div className="charts-body-item-border" />
                                            }
                                        </div>
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