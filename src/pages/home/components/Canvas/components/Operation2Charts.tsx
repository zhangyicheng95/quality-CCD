import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { connect, useModel } from 'umi';
import { Button, Checkbox, Form, Input, InputNumber, message, Radio, Select, Switch } from 'antd';
import MonacoEditor from '@/components/MonacoEditor';
import PlatFormModal from '@/components/platForm';
import FileManager from '@/components/FileManager';
import TooltipDiv from '@/components/TooltipDiv';
import { btnFetch, updateParams } from '@/services/api';
import { init } from '@umijs/deps/compiled/webpack';
import Measurement from '@/components/Measurement';
import SliderGroup from '@/components/SliderGroup';
import { formatJson, guid } from '@/utils/utils';
import IpInput from '@/components/IpInputGroup';

const FormItem = Form.Item;
interface Props {
    data: any,
    id: any,
    setMyChartVisible?: any,
    onClick?: any,
}

const Operation2Charts: React.FC<Props> = (props: any) => {
    const { data = {}, id, started } = props;
    const { operationList, dataValue, xName, fontSize } = data;
    const [form] = Form.useForm();
    const { validateFields, resetFields } = form;
    const { initialState } = useModel<any>('@@initialState');
    const { params } = initialState;
    const { flowData, } = params;
    const { nodes } = flowData;
    const node = nodes.filter((i: any) => i.id === id.split('$$')[0])?.[0] || {};
    const { config = {} } = node;
    const { initParams = {} } = config;

    const [configList, setConfigList] = useState<any>([]);
    const [editorVisible, setEditorVisible] = useState(false);
    const [editorValue, setEditorValue] = useState<any>({});
    const [platFormVisible, setPlatFormVisible] = useState(false);
    const [platFormValue, setPlatFormValue] = useState<any>({});
    const [selectPathVisible, setSelectPathVisible] = useState(false);
    const [selectedPath, setSelectedPath] = useState<any>({});
    const [selectedOption, setSelectedOption] = useState<any>({});
    // 初始化
    const init = () => {
        let resConfig: any = [],
            selectedOptions = {};
        operationList?.forEach((item: any) => {
            if (initParams?.[item]) {
                resConfig = resConfig.concat(initParams[item]);
                if (initParams[item]?.widget?.type === "TagRadio") {
                    const children = (
                        (initParams[item]?.widget?.options || [])
                            .filter((i: any) => i.name === initParams[item]?.value)?.[0]?.children || []
                    );
                    selectedOptions[item] = children;
                }

            }
        });
        setSelectedOption(selectedOptions);
        setConfigList(resConfig);
    };
    // 进来初始化
    useEffect(() => {
        if (!_.isArray(operationList)) {
            message.error('数据格式不正确，请检查');
            localStorage.removeItem(`localGridContentList-${params.id}`);
            return;
        }
        init();
    }, [operationList, params]);
    useEffect(() => {
        console.log(selectedOption)
        // const children = (selectedOption || []).map((item: any) => ({
        //     ...item,
        //     addType: 'tagRadio'
        // }));
        // setConfigList((prev: any) => (prev || [])
        //     .filter((i: any) => i.addType !== 'tagRadio').concat(children));
    }, [selectedOption]);
    const widgetChange = (key: string, value: any) => {
        setConfigList((prev: any) => (prev || [])?.map((item: any) => {
            if (item.name === key) {
                if (!!value?.widget?.type) {
                    return {
                        ...item,
                        ...value,
                    }
                }
                return {
                    ...item,
                    value,
                };
            };
            return item;
        }));
    };
    const onOk = () => {
        validateFields()
            .then((values) => {
                const { flowData, } = params;
                let { nodes } = flowData;
                nodes = nodes.map((node: any) => {
                    const { config = {} } = node;
                    if (node.id === id.split('$$')?.[0]) {
                        const { initParams = {} } = config;
                        let obj = Object.entries(initParams)?.reduce((pre: any, cen: any) => {
                            return Object.assign({}, pre, (!!cen[1]?.type && !!cen[1]?.name) ? { [cen[0]]: cen[1] } : {})
                        }, {});
                        (Object.entries(values) || []).forEach((res: any, index: number) => {
                            const name = res[0]?.split('$$')?.[0];
                            const value = res[1];
                            let optionList: any = [];
                            Object.values(selectedOption)?.forEach(option => {
                                optionList = optionList.concat(option);
                            });
                            const item = optionList.filter((i: any) => i.name === name)?.[0] || obj[name] || {};
                            obj[name] = {
                                ...item,
                                value,
                            }
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
                btnFetch('post', xName, requestParams);
            }).catch((err) => {
                console.log(err);
            });
    };
    const onCancel = () => {
        resetFields();
        init();
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
                            return configList?.map((item: any, index: number) => {
                                const { name, alias, widget = {}, addType } = item;
                                const { type } = widget;
                                let optionList: any = [];
                                Object.values(selectedOption)?.forEach(option => {
                                    optionList = optionList.concat(option);
                                });
                                if (optionList?.filter((i: any) => i.name === name)?.length) return null;
                                return <div className={`${type === 'TagRadio' ? '' : 'flex-box'} param-item`} key={`${id}@$@${name}`}>
                                    <div className="flex-box">
                                        <div className="icon-box flex-box">
                                            {_.toUpper(type.slice(0, 1))}
                                            {/* <BlockOutlined className="item-icon" /> */}
                                        </div>
                                        <div className="title-box">
                                            <TooltipDiv className="first" title={alias || name}>{alias || name}</TooltipDiv>
                                            <TooltipDiv className="second">{name}</TooltipDiv>
                                        </div>
                                    </div>
                                    <div className="value-box" style={type === 'TagRadio' ?
                                        { width: 'calc(100% - 16px)' } :
                                        {}
                                    }>
                                        <FormatWidgetToDom
                                            key={item?.name}
                                            id={item?.name}
                                            config={[item?.name, item]}
                                            selectedOption={selectedOption}
                                            setSelectedOption={setSelectedOption}
                                            form={form}
                                            disabled={!started}
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
                        }, [selectedOption, configList, started])
                    }
                </Form>
            </div>
            <div className="operation-footer flex-box-center">
                <Button type="primary" disabled={!started} onClick={() => onOk()} >发送</Button>
                <Button disabled={!started} onClick={() => onCancel()}>重置</Button>
            </div>

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
}))(Operation2Charts);


const FormatWidgetToDom = (props: any) => {
    const {
        form, id, label = '', node, config = [],
        parent = undefined, disabled, widgetChange,
        selectedOption, setSelectedOption,
        setEditorVisible, setEditorValue,
        setPlatFormVisible, setPlatFormValue,
        setSelectPathVisible, setSelectedPath,
    } = props;
    // const { getFieldDecorator, setFieldsValue, getFieldValue } = form;
    const {
        name: aliasDefault,
        alias = '默认输入框',
        require,
        type,
        value,
        language = 'json',
        localPath,
        description,
        widget = {},
        default: defaultValue,
    } = config[1];

    let { max = 9999, min, options, precision, step, suffix, type: type1 } = widget;
    const updateTimer = useRef<any>();

    if (_.isArray(options) && _.isString(options[0])) {
        options = options.map((option: string) => ({ label: option, value: option }));
    }
    const name = `${id}`;

    useEffect(() => {
        if (type1 === 'TagRadio') {
            const children = (options || []).filter((i: any) => i.name === value)[0]?.children;
            setSelectedOption?.((prev: any) => Object.assign({}, prev, {
                [name]: children
            }));
        };
    }, [type1]);

    switch (type1) {
        case 'Input':
            return (
                <FormItem
                    name={name}
                    label={label}
                    tooltip={description}
                    initialValue={value || undefined}
                    rules={[{ required: require, message: `${alias}` }]}
                >
                    <Input
                        placeholder={`请输入${alias}`}
                        disabled={disabled}
                        onBlur={(e) => {
                            widgetChange?.(name, e.target.value, parent);
                        }}
                    />
                </FormItem>
            );
        case 'IpInput':
            return (
                <Form.Item
                    name={name}
                    label={label}
                    tooltip={description}
                    initialValue={value || undefined}
                    rules={[{ required: require, message: `${alias}` }]}
                >
                    <IpInput
                        disabled={disabled}
                        onChange={(val: string) => {
                            widgetChange?.(name, val, parent);
                        }}
                    />
                </Form.Item>
            );
        case 'Radio':
            return (
                <FormItem
                    name={name}
                    label={label}
                    tooltip={description}
                    initialValue={(_.isArray(value) ? value[0] : value) || undefined}
                    rules={[{ required: require, message: `${alias}` }]}
                >
                    <Radio.Group
                        disabled={disabled}
                        onChange={(e) => {
                            widgetChange?.(name, e.target.value, parent);
                        }}
                    >
                        {options.map((option: any, index: any) => {
                            const { label, value } = option;
                            return (
                                <Radio key={`${name}_${value}`} value={value}>
                                    {label}
                                </Radio>
                            );
                        })}
                    </Radio.Group>
                </FormItem>
            );
        case 'TagRadio':
            return (
                <>
                    <FormItem
                        name={name}
                        label={label}
                        tooltip={description}
                        initialValue={(_.isArray(value) ? value[0] : value) || undefined}
                        rules={[{ required: require, message: `${alias}` }]}
                    >
                        <Radio.Group
                            disabled={disabled}
                            onChange={(e: any) => {
                                const { value, propsKey } = e.target;
                                const { children = [] } = JSON.parse(propsKey);
                                setSelectedOption?.((prev: any) => Object.assign({}, prev, {
                                    [name]: children
                                }));
                                widgetChange?.(name, value);
                            }}
                        >
                            {options.map((option: any, index: any) => {
                                const { name } = option;
                                return (
                                    //@ts-ignore
                                    <Radio key={name} value={name} propsKey={JSON.stringify(option)}>
                                        {name}
                                    </Radio>
                                );
                            })}
                        </Radio.Group>
                    </FormItem>
                    {
                        (selectedOption?.[name] || []).map((item: any, index: number) => {
                            if (!item || !item.widget) {
                                return null;
                            }
                            return <div style={{ marginTop: 24 }} key={item.id}>
                                <FormatWidgetToDom
                                    key={item.name || guid()}
                                    id={node?.id ? `${node.id}@$@${item?.name}` : item?.name}
                                    config={[item.name, item]}
                                    label={item?.alias || item?.name}
                                    parent={name}
                                    form={form}
                                    setEditorVisible={setEditorVisible}
                                    disabled={disabled}
                                    widgetChange={widgetChange}
                                />
                            </div>
                        })
                    }
                </>
            );
        case 'Select':
            return (
                <FormItem
                    name={name}
                    label={label}
                    tooltip={description}
                    initialValue={(_.isArray(value) ? value[0] : value) || false}
                    rules={[{ required: require, message: `${alias}` }]}
                >
                    <Select
                        placeholder={`${alias}`}
                        disabled={disabled}
                        onChange={(e: any) => {
                            widgetChange?.(name, e, parent);
                        }}
                    >
                        {options.map((option: any, index: any) => {
                            const { id, label, value } = option;
                            return (
                                <Radio key={id} value={value}>
                                    {label}
                                </Radio>
                            );
                        })}
                    </Select>
                </FormItem>
            );
        case 'MultiSelect':
            return (
                <FormItem
                    name={name}
                    label={label}
                    tooltip={description}
                    initialValue={value || undefined}
                    rules={[{ required: require, message: `${alias}` }]}
                >
                    <Select
                        placeholder={`请选择${alias}`}
                        mode="multiple"
                        disabled={disabled}
                        onChange={(e) => {
                            widgetChange?.(name, e, parent);
                        }}
                    >
                        {options.map((option: any, index: any) => {
                            const { id, label, value } = option;
                            return (
                                <Radio key={id} value={value}>
                                    {label}
                                </Radio>
                            );
                        })}
                    </Select>
                </FormItem>
            );
        case 'Checkbox':
            return (
                <FormItem
                    name={name}
                    label={label}
                    tooltip={description}
                    initialValue={value || undefined}
                    rules={[{ required: require, message: `${alias}` }]}
                >
                    <Checkbox.Group
                        options={options}
                        disabled={disabled}
                        onChange={(e) => {
                            widgetChange?.(name, e, parent);
                        }}
                    />
                </FormItem>
            );
        case 'InputNumber':
            return (
                <Fragment>
                    <FormItem
                        name={name}
                        label={label}
                        tooltip={description}
                        initialValue={(value || value == 0) ? value : ((defaultValue || defaultValue == 0) ? defaultValue : undefined)}
                        rules={[{ required: require, message: `${alias}` }]}
                    >
                        <InputNumber
                            controls={true}
                            placeholder={`请输入${alias}`}
                            precision={precision}
                            step={step}
                            max={max}
                            min={min}
                            disabled={disabled}
                            onBlur={(e: any) => {
                                const value = e.target.value;
                                widgetChange?.(name, Number(value < max ? value : max), parent);
                            }}
                        />
                    </FormItem>
                </Fragment>
            );
        case 'Slider':
            return (
                <FormItem
                    name={name}
                    label={label}
                    tooltip={description}
                    initialValue={(value || value == 0) ? value : defaultValue}
                    rules={[{ required: require, message: `${alias}` }]}
                >
                    <SliderGroup
                        step={step}
                        max={max}
                        min={min}
                        disabled={disabled}
                        precision={precision}
                        onChange={(e: any) => {
                            !!updateTimer?.current && clearTimeout(updateTimer?.current);
                            updateTimer.current = setTimeout(() => {
                                widgetChange?.(name, Number(e), parent);
                            }, 300)
                        }}
                    />
                </FormItem>
            );
        case 'Switch':
            return (
                <FormItem
                    name={name}
                    label={label}
                    tooltip={description}
                    initialValue={value || false}
                    valuePropName="checked"
                    rules={[{ required: require, message: `${alias}` }]}
                >
                    <Switch
                        disabled={disabled}
                        onChange={(e) => {
                            widgetChange?.(name, e, parent);
                        }}
                    />
                </FormItem>
            );
        case 'File':
            return (
                <FormItem
                    shouldUpdate
                    name={name}
                    label={label}
                    tooltip={description}
                    initialValue={value || undefined}
                    valuePropName="file"
                    rules={[{ required: require, message: `${alias}` }]}
                >
                    <div className='flex-box dir'>
                        <TooltipDiv title={value}>
                            {value}
                        </TooltipDiv>
                        <Button
                            onClick={() => {
                                setSelectedPath(Object.assign(config[1], { id: name, fileType: 'file' }));
                                setSelectPathVisible(true);
                            }}
                            disabled={disabled}
                        >
                            选择文件
                        </Button>
                    </div>
                </FormItem>
            );
        case 'Dir':
            return (
                <FormItem
                    name={name}
                    label={label}
                    tooltip={description}
                    initialValue={value || undefined}
                    valuePropName="file"
                    getValueFromEvent={(e: any) => {
                        if (Array.isArray(e)) {
                            return e;
                        }
                        const { file, fileList } = e;
                        return [{ ...file, percent: 40 }];
                    }}
                    rules={[{ required: require, message: `${alias}` }]}
                >
                    <div className='flex-box dir'>
                        <TooltipDiv title={value}>
                            {value}
                        </TooltipDiv>
                        <Button
                            onClick={() => {
                                setSelectedPath(Object.assign(config[1], { id: name, fileType: 'dir' }));
                                setSelectPathVisible(true);
                            }}
                            disabled={disabled}
                        >
                            选择文件夹
                        </Button>

                    </div>
                </FormItem>
            );
        case 'codeEditor':
            return (
                <FormItem
                    name={name}
                    label={label}
                    tooltip={description}
                    className="codeEditor"
                >
                    {
                        !!value ?
                            <Input.TextArea
                                autoSize={{ maxRows: 5 }}
                                value={(language === 'json' && _.isObject(value)) ? formatJson(value) : value}
                                style={{ marginBottom: 8 }}
                                disabled
                            />
                            :
                            null
                    }
                    <Button
                        onClick={() => {
                            setEditorValue({
                                id: name,
                                value: (language === 'json' && _.isObject(value)) ? formatJson(value) : value,
                                language: language || 'json',
                            });
                            setEditorVisible(true);
                        }}
                        disabled={disabled}
                    >
                        打开编辑器
                    </Button>
                </FormItem>
            );
        case 'ImageLabelField':
            return (
                <>
                    <FormItem
                        shouldUpdate
                        name={name}
                        label={label}
                        tooltip={description}
                        initialValue={localPath || undefined}
                        valuePropName="file"
                        rules={[{ required: require, message: `${alias}` }]}
                    >
                        <TooltipDiv title={localPath}>
                            {localPath}
                        </TooltipDiv>
                    </FormItem>
                    <div className='flex-box'>
                        <Button
                            onClick={() => {
                                setSelectedPath(Object.assign(_.omit(config[1], 'value'), { id: name, fileType: 'file' }));
                                setSelectPathVisible(true);
                            }}
                            disabled={disabled}
                            style={{ marginRight: 8 }}
                        >
                            选择文件
                        </Button>
                        <Button
                            type='primary'
                            onClick={() => {
                                setPlatFormValue({ ...config[1], id: name, nodeName: node?.alias || node?.name });
                                setPlatFormVisible(true);
                            }}
                            disabled={!localPath || disabled}
                        >
                            开始标注
                        </Button>
                    </div>
                </>
            );
        case 'Measurement':
            return (
                <Form.Item
                    name={name}
                    label={label}
                    tooltip={description}
                    initialValue={value || defaultValue || {
                        num_0: { alias: 'num_0', value: undefined },
                        num_1: { alias: 'num_1', value: undefined },
                        num_2: { alias: 'num_2', value: undefined },
                        num_3: { alias: 'num_3', value: undefined },
                    }}
                    rules={[{ required: require, message: `${alias}` }]}
                >
                    <Measurement
                        disabled={disabled}
                        onChange={(val: any) => {
                            widgetChange?.(name, val, parent);
                        }}
                    />
                </Form.Item>
            );
        default:
            return null;
    }
};