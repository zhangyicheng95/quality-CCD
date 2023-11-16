import React, { useEffect, useMemo, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { connect, useModel } from 'umi';
import { Button, Form, message } from 'antd';
import { FormatWidgetToDom } from '@/pages/control';
import MonacoEditor from '@/components/MonacoEditor';
import PlatFormModal from '@/components/platForm';
import FileManager from '@/components/FileManager';
import TooltipDiv from '@/components/TooltipDiv';
import { updateParams } from '@/services/api';

interface Props {
    data: any,
    id: any,
    setMyChartVisible?: any,
    onClick?: any,
}

const OperationCharts: React.FC<Props> = (props: any) => {
    const { data = {}, id, started } = props;
    const { operationList, dataValue, fontSize } = data;
    const [form] = Form.useForm();
    const { validateFields, resetFields } = form;
    const { initialState, setInitialState } = useModel<any>('@@initialState');
    const { params } = initialState;

    const [configList, setConfigList] = useState<any>([]);
    const [editorVisible, setEditorVisible] = useState(false);
    const [editorValue, setEditorValue] = useState<any>({});
    const [platFormVisible, setPlatFormVisible] = useState(false);
    const [platFormValue, setPlatFormValue] = useState<any>({});
    const [selectPathVisible, setSelectPathVisible] = useState(false);
    const [selectedPath, setSelectedPath] = useState<any>({});

    useEffect(() => {
        if (!_.isArray(operationList)) {
            console.log('OperationCharts:', dataValue);
            return;
        }
        const { flowData, } = params;
        const { nodes } = flowData;
        const node = nodes.filter((i: any) => i.id === id.split('$$')[0])?.[0];
        if (!!node) {
            const { config = {} } = node;
            const { initParams = {} } = config;
            let resConfig: any = [];
            operationList?.forEach((item: any) => {
                if (initParams[item]) {
                    resConfig = resConfig.concat(initParams[item]);
                }
            });
            setConfigList(resConfig);
        }

    }, [operationList, params]);

    const widgetChange = (key: any, value: any) => {
        validateFields()
            .then((values) => {
                setConfigList((prev: any) => {
                    const result = (prev || [])?.map((item: any, index: number) => {
                        if (item.name === key) {
                            return Object.assign({},
                                item,
                                { value },
                                ((_.isObject(value) && !_.isArray(value)) && item?.widget?.type !== "Measurement") ? value : { value },
                                item?.widget?.type === 'codeEditor'
                                    ? {
                                        value: value?.language === 'json' ?
                                            (
                                                _.isString(value?.value) ?
                                                    JSON.parse(value?.value) :
                                                    value?.value
                                            )
                                            :
                                            value?.value,
                                    }
                                    : {}

                            );
                        }
                        return item;
                    });
                    const { flowData, } = params;
                    let { nodes } = flowData;
                    nodes = nodes.map((node: any) => {
                        const { config = {} } = node;
                        if (node.id === id.split('$$')[0]) {
                            const { initParams = {} } = config;
                            let obj = Object.assign({}, initParams);
                            result.forEach((item: any, index: number) => {
                                obj[item?.id || item?.name] = item;
                            });
                            return Object.assign({}, node, {
                                config: Object.assign({}, config, {
                                    initParams: obj
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
                    // console.log(requestParams);
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

                    return result;
                });
            }).catch((err) => {
                console.log(err);
            });
    };

    const onOk = () => {
        validateFields()
            .then((values) => {
                const { flowData, } = params;
                let { nodes } = flowData;
                nodes = nodes.map((node: any) => {
                    const { config = {} } = node;
                    if (node.id === id.split('$$')[0]) {
                        const { initParams = {} } = config;
                        let obj = Object.assign({}, initParams);
                        configList.forEach((item: any, index: number) => {
                            obj[item?.id || item?.name] = item;
                        });
                        return Object.assign({}, node, {
                            config: Object.assign({}, config, {
                                initParams: obj
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
                updateParams(requestParams).then((res: any) => {
                    if (res && res.code === 'SUCCESS') {
                        message.success('修改成功');
                        setInitialState((preInitialState: any) => ({
                            ...preInitialState,
                            params: res.data
                        }));
                    } else {
                        message.error(res?.msg || res?.message || '接口异常');
                    }
                });
            }).catch((err) => {
                console.log(err);
            });
    };
    const onCancel = () => {
        resetFields();
    };

    return (
        <div
            id={`echart-${id}`}
            className={`${styles.operationCharts} flex-box`}
            style={{ fontSize }}
        >
            <div className="operation-body">
                <Form
                    form={form}
                    scrollToFirstError
                >
                    {
                        useMemo(() => {
                            return configList.map((item: any, index: number) => {
                                const { name, alias, widget = {} } = item;
                                const { type } = widget;
                                return <div className="flex-box param-item" key={`${id}@$@${name}`}>
                                    <div className="icon-box flex-box">
                                        {_.toUpper(type.slice(0, 1))}
                                        {/* <BlockOutlined className="item-icon" /> */}
                                    </div>
                                    <div className="title-box">
                                        <TooltipDiv className="first" title={alias || name}>{alias || name}</TooltipDiv>
                                        <TooltipDiv className="second">{name}</TooltipDiv>
                                    </div>
                                    <div className="value-box">
                                        <FormatWidgetToDom
                                            key={item?.name}
                                            id={item?.name}
                                            // label={item?.alias || item?.name}
                                            config={[item?.name, item]}
                                            widgetChange={widgetChange}
                                            form={form}
                                            disabled={!!started}
                                            setEditorVisible={setEditorVisible}
                                            setEditorValue={setEditorValue}
                                            setPlatFormVisible={setPlatFormVisible}
                                            setPlatFormValue={setPlatFormValue}
                                            setSelectPathVisible={setSelectPathVisible}
                                            setSelectedPath={setSelectedPath}
                                        />
                                    </div>
                                </div>
                            })
                        }, [configList, started])
                    }
                </Form>
            </div>
            {/* <div className="operation-footer flex-box-center">
                <Button type="primary" disabled={!!started} onClick={() => onOk()} >确认</Button>
                <Button disabled={!!started} onClick={() => onCancel()}>重置</Button>
            </div> */}

            {
                editorVisible ? (
                    <MonacoEditor
                        id={editorValue.id}
                        defaultValue={editorValue.value}
                        language={editorValue.language}
                        visible={editorVisible}
                        onOk={(val: any) => {
                            const { id, value, language } = val;
                            widgetChange(id, { value, language });
                            setEditorValue({});
                            setEditorVisible(false);
                        }}
                        onCancel={() => {
                            setEditorVisible(false);
                        }}
                    />
                ) : null
            }
            {
                platFormVisible ? (
                    <PlatFormModal
                        visible={platFormVisible}
                        data={platFormValue}
                        onOk={(val: any) => {
                            const { id, ...rest } = val;
                            widgetChange(id, rest);
                            setPlatFormValue({});
                            setPlatFormVisible(false);
                        }}
                        onCancel={() => {
                            setPlatFormValue({});
                            setPlatFormVisible(false);
                        }}
                    />
                ) : null
            }
            {
                selectPathVisible ?
                    <FileManager
                        fileType={selectedPath.fileType}
                        data={selectedPath}
                        onOk={(val: any) => {
                            const { id, value, ...rest } = val;
                            widgetChange(id, { value, ...rest, localPath: value });
                            setSelectedPath({});
                            setSelectPathVisible(false);
                        }}
                        onCancel={() => {
                            setSelectPathVisible(false);
                            setSelectedPath({});
                        }}
                    />
                    : null
            }
        </div>
    );

};

export default connect(({ home, themeStore }) => ({
    started: home.started || false,
}))(OperationCharts);