import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { connect, useModel } from 'umi';
import { Button, Checkbox, DatePicker, Form, Input, InputNumber, message, Popconfirm, Radio, Select, Switch } from 'antd';
import MonacoEditor from '@/components/MonacoEditor';
import PlatFormModal from '@/components/platForm';
import FileManager from '@/components/FileManager';
import TooltipDiv from '@/components/TooltipDiv';
import { btnFetch, updateParams } from '@/services/api';
import Measurement from '@/components/Measurement';
import SliderGroup from '@/components/SliderGroup';
import { formatJson } from '@/utils/utils';
import IpInput from '@/components/IpInputGroup';
import moment from 'moment';

const FormItem = Form.Item;
interface Props {
    data: any,
    id: any,
    setMyChartVisible?: any,
    onClick?: any,
}

const Operation2Charts: React.FC<Props> = (props: any) => {
    let { data = {}, id, started } = props;
    let {
        operationList = [], dataValue, xName = '', operationLock, fontSize,
        ifUpdateProject, ifFetch, listType, blockType, blockTypeLines = 2
    } = data;
    if (process.env.NODE_ENV === 'development') {
        started = true;
    }
    const [form] = Form.useForm();
    const { validateFields, resetFields, setFieldsValue } = form;
    const { initialState, setInitialState } = useModel<any>('@@initialState');
    const { params } = initialState;
    const { flowData, } = params;
    const { nodes } = flowData;

    const [configGroup, setConfigGroup] = useState<any>([]);
    const [configList, setConfigList] = useState<any>([]);
    const [editorVisible, setEditorVisible] = useState(false);
    const [editorValue, setEditorValue] = useState<any>({});
    const [platFormVisible, setPlatFormVisible] = useState(false);
    const [platFormValue, setPlatFormValue] = useState<any>({});
    const [selectPathVisible, setSelectPathVisible] = useState(false);
    const [selectedPath, setSelectedPath] = useState<any>({});
    const [selectedOption, setSelectedOption] = useState<any>({});
    const [locked, setLocked] = useState(true);
    // 初始化
    const init = (data?: any) => {
        const node = nodes.filter((i: any) => i.id === id.split('$$')[0])?.[0] || {};
        const { config = {} } = node;
        let { group = [], initParams = {}, execParams = {} } = config;
        if (!execParams || _.isEmpty(execParams)) {
            execParams = initParams;
        }
        let resConfig: any = [],
            selectedOptions = {};
        operationList?.forEach((item: any) => {
            const itemGroup = group.filter((i: any) => i.children.includes(item))?.[0];
            if (execParams?.[item]) {
                resConfig = resConfig.concat(Object.assign(
                    execParams[item],
                    { show: !itemGroup },
                    (!!data && !_.isEmpty(data)) ? { value: data[item], } : {}
                ));
                if (execParams[item]?.widget?.type === "TagRadio") {
                    const children = (
                        (execParams[item]?.widget?.options || [])
                            .filter((i: any) => i.name === execParams[item]?.value)?.[0]?.children || []
                    );
                    selectedOptions[item] = children;
                }

            }
        });
        setConfigGroup(group.map((i: any) => ({ ...i, show: true })));
        setSelectedOption(selectedOptions);
        setConfigList(resConfig);
    };
    // 进来初始化
    useEffect(() => {
        if (locked) {
            if (!!dataValue && !_.isEmpty(dataValue)) {
                resetFields();
                init(dataValue);
                let obj = {};
                Object.entries(dataValue)?.map((res: any) => {
                    obj[res[0]] = res[1];
                });
                setFieldsValue(obj);
            } else {
                init();
            }
        }
    }, [dataValue, params, locked]);
    const widgetChange = (key: string, value: any) => {
        setConfigList((prev: any) => (prev || [])?.map((item: any) => {
            if (item.name === key) {
                if (!!value?.widget?.type || item?.widget?.type === "codeEditor") {
                    setFieldsValue({ [key]: value?.value });
                    return {
                        ...item,
                        ...value,
                    };
                };
                console.log(value)
                if (!!value?.widget?.type || item?.widget?.type === "TagRadio") {
                    console.log(value)
                    setFieldsValue({ [key]: value?.value });
                    return {
                        ...item,
                        ...value,
                    };
                };
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
                setConfigList((pre: any) => {
                    // 1.直接发送动态数据
                    let result = {};
                    (Object.entries(values) || []).forEach((res: any, index: number) => {
                        const name = res[0]?.split('$$')?.[0];
                        const value: any = (!_.isUndefined(res[1]) && !_.isNull(res[1]))
                            ? res[1]
                            : pre?.filter((i: any) => i.name === name)?.[0]?.value;
                        // @ts-ignore
                        result[name] = (value instanceof moment) ? new Date(value).getTime() : value
                    });
                    const requestParams = {
                        id: params.id,
                        data: result
                    };
                    btnFetch('post', xName, requestParams).then((res) => {
                        setLocked(true);
                    });
                    if (ifUpdateProject) {
                        console.log(result)
                        // 2.保存数据到节点中
                        const { flowData, } = params;
                        let { nodes } = flowData;
                        nodes = nodes.map((node: any) => {
                            const { config = {} } = node;
                            if (node.id === id.split('$$')[0]) {
                                let { initParams = {}, execParams } = config;
                                if (!execParams || _.isEmpty(execParams)) {
                                    execParams = initParams;
                                }
                                let obj = Object.assign({}, execParams);
                                pre.forEach((item: any, index: number) => {
                                    obj[item?.name] = {
                                        ...item,
                                        value: result[item?.name],
                                        ...(item?.widget?.type === "TagRadio" ? {
                                            widget: {
                                                ...item?.widget,
                                                options: (item?.widget?.options || [])?.map((option: any) => {
                                                    if (option.name === item?.value) {
                                                        return {
                                                            ...option,
                                                            children: (option?.children || [])?.map((child: any) => {
                                                                return {
                                                                    ...child,
                                                                    value: result[child?.name],
                                                                }
                                                            })
                                                        }
                                                    };
                                                    return option;
                                                })
                                            }
                                        } : {})
                                    };
                                });
                                return Object.assign({}, node, {
                                    config: Object.assign({}, config, {
                                        execParams: obj
                                    })
                                });
                            }
                            return node
                        });
                        const resultParams = {
                            id: params.id,
                            data: Object.assign({}, params, {
                                flowData: Object.assign({}, flowData, {
                                    nodes
                                })
                            })
                        };
                        updateParams(resultParams).then((res: any) => {
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
                    }
                    return pre;
                });
            }).catch((err) => {
                console.log(err);
            });
    };
    const onCancel = () => {
        resetFields();
        init();
    };
    const initItem = (item: any) => {
        const { name, alias, widget = {}, addType, show, locked } = item;
        const { type } = widget;
        // let optionList: any = [];
        // Object.values(selectedOption)?.forEach(option => {
        //     optionList = optionList.concat(option);
        // });
        // if (optionList?.filter((i: any) => i.name === name)?.length) return null;
        return <div
            className={`${type === 'TagRadio' ? '' : 'flex-box'} param-item ${blockType === 'waterafall' ? '' : listType}`}
            key={`${id}@$@${name}`}
            style={show ? {} : { height: 0, padding: 0 }}
        >
            {/* <div className="flex-box"> */}
            {/* <div className="icon-box flex-box">
                                            {_.toUpper(type.slice(0, 1))} */}
            {/* <BlockOutlined className="item-icon" /> */}
            {/* </div> */}
            <div className="title-box">
                <TooltipDiv style={{ fontSize: fontSize + 4 }} className="first" title={alias || name}>{alias || name}</TooltipDiv>
                <TooltipDiv className="second" style={{ fontSize }}>{name}</TooltipDiv>
            </div>
            {/* </div> */}
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
                    disabled={!started || locked}
                    setEditorVisible={setEditorVisible}
                    setEditorValue={setEditorValue}
                    setPlatFormVisible={setPlatFormVisible}
                    setPlatFormValue={setPlatFormValue}
                    setSelectPathVisible={setSelectPathVisible}
                    setSelectedPath={setSelectedPath}
                />
            </div>
        </div>
    };

    return (
        <div
            id={`echart-${id}`}
            className={`${styles.operationCharts} flex-box`}
            style={{ fontSize }}
        >
            <div className={`operation-body ${blockType}`} style={blockType === 'waterfall' ? { columnCount: blockTypeLines } : {}}>
                <Form
                    form={form}
                    scrollToFirstError
                >
                    {
                        useMemo(() => {
                            return <Fragment>
                                {
                                    configList?.map((item: any, index: number) => initItem({ ...item, locked }))
                                }
                                {
                                    configGroup?.map((group: any, index: number) => {
                                        const { name, id, children, show } = group;
                                        return <div className={`param-item param-group-item ${blockType === 'waterfall' ? '' : listType}`} key={id}>
                                            <div className="flex-box param-group-item-title" onClick={() => setConfigGroup((prev: any) => prev.map((item: any) => {
                                                if (item.id === id) {
                                                    return {
                                                        ...item,
                                                        show: !show,
                                                    };
                                                };
                                                return item;
                                            }))}>
                                                {name}
                                            </div>
                                            <div className="param-group-item-body" style={!show ? { height: 0 } : {}}>
                                                {
                                                    (children || [])?.map((child: any, index: number) => {
                                                        const item = configList.filter((i: any) => i?.name === child)?.[0];
                                                        if (!item) return null;
                                                        return <div className="flex-box param-group-item-body-box">
                                                            {/* <div className="param-line-row" >--</div> */}
                                                            {
                                                                initItem({ ...item, show, locked })
                                                            }
                                                        </div>
                                                    })
                                                }
                                            </div>
                                        </div>
                                    })
                                }
                            </Fragment>
                        }, [selectedOption, configList, configGroup, started, locked, listType, blockType, fontSize])
                    }
                </Form>
            </div>
            {/* {
                locked ?
                    <div className="operation2-mask-body" />
                    : null
            } */}
            <div className="operation-footer flex-box-center">
                {
                    operationLock ?
                        <Button type="primary" disabled={!started} onClick={() => {
                            setLocked((prev) => !prev);
                        }}>{locked ? '解锁' : '锁定'}</Button>
                        : null
                }
                <Popconfirm
                    disabled={!started || locked}
                    title="确认修改吗?"
                    onConfirm={() => {
                        onOk();
                    }}
                    okText="确认"
                    cancelText="取消"
                >
                    <Button type="primary" disabled={!started || locked}>修改</Button>
                </Popconfirm>
                <Button disabled={!started || locked} onClick={() => onCancel()}>重置</Button>
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
                        data={{ ...platFormValue, ifFetch: false }}
                        onOk={(val: any) => {
                            const { id, ...rest } = val;
                            if (!!ifFetch) {
                                btnFetch('post', xName, rest.value).then((res) => {
                                    console.log(res);
                                });
                            }
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


function FormatWidgetToDom(props: any) {
    const {
        form, id, label = '', node, config = [],
        parent = undefined, disabled, widgetChange,
        selectedOption, setSelectedOption,
        setEditorVisible, setEditorValue,
        setPlatFormVisible, setPlatFormValue,
        setSelectPathVisible, setSelectedPath,
    } = props;
    const { setFieldsValue, getFieldValue } = form;
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
        case 'DatePicker':
            return (
                <Form.Item
                    name={name}
                    label={label}
                    tooltip={description}
                    initialValue={moment(value || undefined)}
                    rules={[{ required: require, message: `${alias}` }]}
                >
                    {
                        // @ts-ignore
                        <DatePicker
                            placeholder={`请输入${alias}`}
                            disabled={disabled}
                            onBlur={(e: any) => {
                                widgetChange?.(name, new Date(e.target.value).getTime(), parent);
                            }}
                            showTime
                            style={{ width: '100%' }}
                        />
                    }
                </Form.Item>
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
                        <Select
                            disabled={disabled}
                            onChange={(e: any, option: any) => {
                                const { value, propsKey } = option;
                                const { children = [] } = JSON.parse(propsKey);
                                setSelectedOption?.((prev: any) => Object.assign({}, prev, {
                                    [name]: children
                                }));
                                const result = children.reduce((pre: any, cen: any) => {
                                    return {
                                        ...pre,
                                        [cen.name]: cen.value
                                    }
                                }, {});
                                setFieldsValue(result);
                                widgetChange?.(name, value);
                            }}
                        >
                            {(options || []).map((option: any) => {
                                const { id, name } = option;
                                return (
                                    //@ts-ignore
                                    <Option key={name} value={name} propsKey={JSON.stringify(option)}>
                                        {name}
                                    </Option>
                                );
                            })}
                        </Select>
                    </FormItem>
                    {
                        // (selectedOption?.[name] || []).map((item: any, index: number) => {
                        //     if (!item || !item.widget) {
                        //         return null;
                        //     }
                        //     return <div style={{ marginTop: 24 }} key={item.id}>
                        //         <FormatWidgetToDom
                        //             key={item.name || guid()}
                        //             id={node?.id ? `${node.id}@$@${item?.name}` : item?.name}
                        //             config={[item.name, item]}
                        //             label={item?.alias || item?.name}
                        //             parent={name}
                        //             form={form}
                        //             setEditorVisible={setEditorVisible}
                        //             disabled={disabled}
                        //             widgetChange={widgetChange}
                        //         />
                        //     </div>
                        // })
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
                        precision={precision}
                        step={step}
                        max={max}
                        min={min}
                    />
                </Form.Item>
            );
        default:
            return null;
    }
};