import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { connect, useModel } from 'umi';
import BasicTable from '@/components/BasicTable';
import TooltipDiv from '@/components/TooltipDiv';
import { Button, Form, Input, InputNumber, message, Switch, Upload } from 'antd';
import _ from 'lodash';
import * as XLSX from 'xlsx';
import styles from '../index.module.less';
import { updateParams } from '@/services/api';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const TableEditCharts: React.FC<Props> = (props: any) => {
    const { data = {}, id, started } = props;
    let {
        dataValue = [], fontSize, xColumns = [], yColumns = [], yName = '', des_bordered,
    } = data;
    if (process.env.NODE_ENV === 'development') {
        dataValue = [];
    };
    const [form] = Form.useForm();
    const domRef = useRef<any>(null);
    const { initialState, setInitialState } = useModel<any>('@@initialState');
    const { params } = initialState;
    const [dataSource, setDataSource] = useState<any>([]);

    useEffect(() => {
        if (!_.isArray(xColumns) || !_.isArray(yColumns)) {
            message.error('可编辑表格组件数据格式不正确，请检查');
            return;
        }

    }, []);

    const columns = useMemo(() => {
        if (!xColumns?.length || !yColumns?.length) {
            return;
        }
        return (xColumns?.[0]?.xName?.split?.(',') || [])?.map((item: any, index: number) => {
            return Object.assign({
                title: item,
                key: item,
                dataIndex: item,
                editable: index > 1,
                width: index === 1 ? '250px' : '100px'
            }, index < 2 ? { fixed: 'left', } : {
                render: (text: any, record: any) => {
                    if (_.isString(text) || _.isUndefined(text)) {
                        return text;
                    };
                    const { __type, __name } = record;
                    return <Form.Item
                        name={`${__name}$@$${item}`}
                        style={{ margin: 0 }}
                        {
                        ...(__type === 'bool' || __type === 'range') ?
                            { valuePropName: "checked", initialValue: false } :
                            { initialValue: 0 }
                        }
                    >
                        {
                            (__type === 'bool' || __type === 'range') ?
                                <Switch />
                                :
                                <InputNumber defaultValue={0} precision={2} min={0} />
                        }
                    </Form.Item>
                }
            });
        });
    }, [xColumns]);
    useEffect(() => {
        if (!xColumns?.length || !yColumns?.length) {
            return;
        }
        const columns = xColumns?.[0]?.xName?.split?.(',') || [];
        const subColumns = xColumns[1]?.xName?.split(',') || [];
        const group = yColumns?.[0]?.yName?.split(',');
        let subTitle = {};
        columns?.forEach((colu: any, index: number) => {
            subTitle[colu] = subColumns[index] || undefined;
        });
        let content: any = [];
        (yColumns?.slice(1)).forEach((item: any, index: number) => {
            const { type, yName } = item;
            if (type === 'range') {
                let obj = { __type: 'range', __name: `${yName}:ON/OFF` },
                    obj1 = { __type: 'child', __name: `${yName}:MIN` },
                    obj2 = { __type: 'child', __name: `${yName}:MAX` };
                columns.forEach((colu: any) => {
                    if (colu === '模组') {
                        obj[colu] = group[content?.length];
                        obj1[colu] = undefined;
                        obj2[colu] = undefined;
                    } else if (colu === '参数名称') {
                        obj[colu] = `${yName}:ON/OFF`;
                        obj1[colu] = `${yName}:MIN`;
                        obj2[colu] = `${yName}:MAX`;
                    } else {
                        obj[colu] = false;
                        obj1[colu] = 0;
                        obj2[colu] = 0;
                    }
                });
                content = content.concat([obj, obj1, obj2]);
            }
            if (type === 'bool') {
                let obj = { __type: 'bool', __name: `${yName}:ON/OFF` },
                    obj1 = { __type: 'child', __name: `${yName}:MATCH` };
                columns.forEach((colu: any) => {
                    if (colu === '模组') {
                        obj[colu] = group[content?.length];
                        obj1[colu] = undefined;
                    } else if (colu === '参数名称') {
                        obj[colu] = `${yName}:ON/OFF`;
                        obj1[colu] = `${yName}:MATCH`;
                    } else {
                        obj[colu] = false;
                        obj1[colu] = 0;
                    }
                });
                content = content.concat([obj, obj1]);
            }
        });
        setDataSource([subTitle].concat(content).filter(Boolean));

        const { flowData, } = params;
        let { nodes } = flowData;
        const node = nodes.filter((i: any) => i.id === id.split('$$')[0])?.[0] || {};
        if (!!node) {
            const { config = {} } = node;
            const { initParams } = config;
            if (_.isArray(initParams[yName]?.value)) {
                const result = initParams[yName]?.value.reduce((pre: any, cen: any) => {
                    const { title, config } = cen;
                    const obj = (config || [])?.reduce?.((p: any, c: any) => {
                        let obj1 = {};
                        if (c.type === 'range') {
                            obj1 = {
                                [`${c.description}:ON/OFF$@$${title}`]: c.field_val,
                                [`${c.description}:MIN$@$${title}`]: c.min,
                                [`${c.description}:MAX$@$${title}`]: c.max
                            }
                        } else {
                            obj1 = {
                                [`${c.description}:ON/OFF$@$${title}`]: c.field_val,
                                [`${c.description}:MATCH$@$${title}`]: c.value,
                            }
                        }
                        return {
                            ...p,
                            ...obj1
                        }
                    }, {});
                    return {
                        ...pre,
                        ...obj
                    }
                }, {});
                form.setFieldsValue({
                    ...result
                });
            }
        }
    }, [xColumns, yColumns]);
    const onUploadExcel = {
        accept: '.xlsx',
        showUploadList: false,
        multiple: false,
        beforeUpload(file: any) {
            const reader = new FileReader();
            reader.onload = (res: any) => {
                try {
                    /****************解析excel******************/
                    const workbook = XLSX.read(res.target.result, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    const result = jsonData.map((item: any) => {
                        return (item.join('$@$').split('$@$')).map((i: any) => {
                            if (!!i) {
                                return i;
                            } else {
                                return '';
                            }
                        })
                    });
                    const keyList = result[0];
                    /****************解析excel******************/
                    const valueList = result.slice(2);
                    let obj = {};
                    (valueList || []).forEach((item1: any) => {
                        if (item1[1]?.indexOf(':') > -1) {
                            if (!obj[item1[1]]) {
                                obj[item1[1]] = {};
                            };
                            (keyList || []).forEach((key: any, index: number) => {
                                if (key?.indexOf('Q') > -1) {
                                    obj[item1[1]][key] = JSON.parse(_.toLower(item1[index]));
                                }
                            });
                        }
                    });
                    const formValue = Object.entries(obj)?.reduce((pre: any, cen: any) => {
                        const itemValue = Object.entries(cen[1])?.reduce((p: any, c: any) => {
                            return {
                                ...p,
                                [`${cen[0]}$@$${c[0]}`]: c[1]
                            }
                        }, {});
                        return {
                            ...pre,
                            ...itemValue
                        }
                    }, {});
                    form.setFieldsValue({
                        ...formValue
                    });
                } catch (err) {
                    message.error('文件格式错误，请修改后上传。');
                    console.error(err);
                }
            };
            reader.readAsBinaryString(file);
            return false;
        },
    };
    const onSubmit = () => {
        form.validateFields()
            .then((values: any) => {
                let obj1: any = [],
                    obj2: any = [];
                Object.entries(values)?.forEach((res: any) => {
                    const name = res[0]?.split('$@$');
                    if (res[0]?.indexOf('ON') > -1) {
                        obj1.push({
                            association: name[0]?.split(':')?.[0],
                            xName: name[0],
                            yName: name[1],
                            value: res[1],
                            children: [

                            ]
                        });
                    } else {
                        obj2.push({
                            association: name[0]?.split(':')?.[0],
                            type: _.toLower(name[0]?.split(':')?.[1]),
                            xName: name[0],
                            yName: name[1],
                            value: res[1]
                        });
                    }
                });
                const subColumns = xColumns[1]?.xName?.split(',')?.slice(2) || [];
                const parm1 = obj1.map((item: any) => {
                    const { association, xName, yName } = item;
                    const result = obj2.filter((i: any) => i.association === association && i.yName === yName) || [];
                    return {
                        ...item,
                        ...result[0]?.xName?.indexOf('MATCH') < 0 ? {
                            type: "range",
                            min: result.filter((i: any) => i.type === 'min')?.[0]?.value,
                            max: result.filter((i: any) => i.type === 'max')?.[0]?.value,
                        } : {
                            type: "bool",
                            child_value: result[0]?.value
                        },
                        children: (item.children || [])?.concat(result)
                    }
                });
                const parm2 = (xColumns?.[0]?.xName?.split?.(',')?.slice(2) || [])?.map((item: any, index: number) => {
                    return {
                        "level": index + 1,
                        "title": item,
                        "alias": subColumns[index] || "",
                        "config": parm1.map((i: any) => {
                            if (i.yName === item) {
                                return {
                                    "field_name": yColumns.filter((m: any) => m.yName === i.association)?.[0]?.xName || "",
                                    "field_val": i.value,
                                    "type": i.type,
                                    "description": i.association,
                                    ...i.type === 'range' ? {
                                        "min": i.min,
                                        "max": i.max
                                    } : {
                                        "value": i.child_value
                                    }
                                };
                            };
                            return null;
                        }).filter(Boolean),
                    }
                });

                const { flowData, } = params;
                let { nodes } = flowData;
                nodes = nodes.map((node: any) => {
                    const { config = {} } = node;
                    if (node.id === id.split('$$')[0]) {
                        const { initParams = {} } = config;
                        return Object.assign({}, node, {
                            config: Object.assign({}, config, {
                                initParams: {
                                    ...initParams,
                                    [yName]: {
                                        ...initParams[yName],
                                        value: parm2
                                    }
                                }
                            })
                        });
                    }
                    return node
                });
                const requestParams = {
                    id: params.id,
                    data: Object.assign({}, params, {
                        flowData: Object.assign({}, flowData, {
                            nodes
                        })
                    })
                };
                console.log(requestParams);
                setInitialState((preInitialState: any) => ({
                    ...preInitialState,
                    params: requestParams.data
                }));
                updateParams(requestParams).then((res: any) => {
                    if (res && res.code === 'SUCCESS') {
                        message.success('修改成功');
                    } else {
                        message.error(res?.msg || res?.message || '接口异常');
                    }
                });
            });
    };

    return (
        <div
            id={`echart-${id}`}
            className={styles.tableEditCharts}
            ref={domRef}
            style={{ fontSize }}
        >
            <div className="edit-charts-body">
                <Form form={form} component={false}>
                    <BasicTable
                        columns={columns}
                        dataSource={dataSource}
                        pagination={null}
                        bordered={des_bordered}
                    />
                </Form>
            </div>
            <div className="flex-box-center edit-table-footer">
                <Upload {...onUploadExcel}>
                    <Button type="default" disabled={started}>
                        上传 Excel
                    </Button>
                </Upload>
                <Button type="primary" disabled={started} onClick={() => onSubmit()}>
                    保存
                </Button>
            </div>
        </div>
    );
};

export default connect(({ home, themeStore }) => ({
    started: home.started || false,
}))(TableEditCharts);