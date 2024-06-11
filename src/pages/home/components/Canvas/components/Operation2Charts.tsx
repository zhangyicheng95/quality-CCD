import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { connect, useModel } from 'umi';
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Radio,
  Select,
} from 'antd';
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
import ChooseFileButton from '@/components/ChooseFileButton';
import ChooseDirButton from '@/components/ChooseDirButton';
import SegmentSwitch from '@/components/SegmentSwitch';

const FormItem = Form.Item;
interface Props {
  data: any;
  id: any;
  setMyChartVisible?: any;
  onClick?: any;
}

const Operation2Charts: React.FC<Props> = (props: any) => {
  let { data = {}, id, started } = props;
  let {
    operationList = [],
    dataValue,
    xName = '',
    fontSize,
    ifUpdateProject,
    ifUpdatetoInitParams,
    ifFetch,
    ifPopconfirm,
    showLabel,
    des_column,
    des_bordered,
    yName = 150,
    valueOnTop = false,
  } = data;
  if (!_.isBoolean(showLabel)) {
    showLabel = true;
  }
  const [form] = Form.useForm();
  const { validateFields, resetFields, setFieldsValue } = form;
  const { initialState, setInitialState } = useModel<any>('@@initialState');
  const { params } = initialState;
  const { flowData } = params;
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

  const measurementLineNum = useMemo(() => {
    const node = nodes.filter((i: any) => i.id === id.split('$$')[0])?.[0] || {};
    const { config = {} } = node;
    let { initParams = {}, execParams = {} } = config;
    if (!execParams || _.isEmpty(execParams)) {
      execParams = initParams;
    }
    let num = 1;
    (operationList || []).forEach((item: any) => {
      if (execParams?.[item] && execParams?.[item]?.widget?.type === 'Measurement') {
        const length = Object?.keys?.(execParams?.[item]?.value || {})?.length || 1;
        if (length > num) {
          num = length;
        }
      }
    });
    return num;
  }, [operationList]);
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
        resConfig = resConfig.concat(
          Object.assign(
            { enabled: true },
            execParams[item],
            { show: !itemGroup },
            !!data && !_.isEmpty(data) ? { value: data[item] } : {},
          ),
        );
        if (execParams[item]?.widget?.type === 'TagRadio') {
          const children =
            (execParams[item]?.widget?.options || []).filter(
              (i: any) => i.name === execParams[item]?.value,
            )?.[0]?.children || [];
          selectedOptions[item] = children;
        }
      }
    });
    setConfigGroup(group?.map?.((i: any) => ({ ...i, show: true })));
    setSelectedOption(selectedOptions);
    setConfigList(resConfig);
  };
  // 进来初始化
  useEffect(() => {
    if (locked) {
      if (!!dataValue && !_.isEmpty(dataValue)) {
        resetFields();
        init();
        let obj = {};
        Object.entries(dataValue)?.map?.((res: any) => {
          obj[res[0]] = res[1];
        });
        setFieldsValue(obj);
      } else {
        init();
      }
    }
  }, [dataValue, operationList, locked]);
  const widgetChange = (key: string, value: any) => {
    setConfigList((prev: any) =>
      (prev || [])?.map?.((item: any) => {
        if ((item.name || item.id) === key) {
          if (!!value?.widget?.type || item?.widget?.type === 'codeEditor') {
            setFieldsValue({ [key]: value?.value });
            return {
              ...item,
              ...value,
            };
          }
          if (!!value?.widget?.type || item?.widget?.type === 'TagRadio') {
            setFieldsValue({ [key]: value?.value });
            return {
              ...item,
              ...value,
            };
          }
          return {
            ...item,
            value,
          };
        }
        return item;
      }),
    );
  };
  const onOk = () => {
    validateFields()
      .then((values) => {
        setConfigList((pre: any) => {
          // 1.直接发送动态数据
          let result = {};
          let resultEnabled = {};
          (Object.entries(values) || []).forEach((res: any, index: number) => {
            const name = res[0]?.split('$$')?.[0];
            const value: any =
              !_.isUndefined(res[1]) && !_.isNull(res[1])
                ? res[1]
                : pre?.filter((i: any) => i.name === name)?.[0]?.value;
            // @ts-ignore
            result[name] = value instanceof moment ? new Date(value).getTime() : value;
            resultEnabled[name] = _.isBoolean(
              pre?.filter((i: any) => i.name === name)?.[0]?.enabled,
            )
              ? pre?.filter((i: any) => i.name === name)?.[0]?.enabled
              : true;
          });
          const requestParams = {
            id: params.id,
            data: result,
          };
          if (started) {
            // 如果没启动，就不发送
            btnFetch('post', xName, requestParams).then((res) => {
              setTimeout(() => {
                setFieldsValue(result);
              }, 500);
            });
          }
          if (ifUpdateProject) {
            // 2.保存数据到节点中
            const { flowData } = params;
            let { nodes } = flowData;
            nodes = nodes?.map?.((node: any) => {
              const { config = {} } = node;
              if (node.id === id.split('$$')[0]) {
                let { initParams = {}, execParams } = config;
                if (!execParams || _.isEmpty(execParams)) {
                  execParams = initParams;
                }
                let obj = Object.assign({}, execParams);
                pre.forEach((item: any, index: number) => {
                  if (!!item?.name && item?.name !== 'undefined') {
                    obj[item?.name] = {
                      ...item,
                      value: result[item?.name],
                      ...{ enabled: resultEnabled[item?.name] },
                      ...(item?.widget?.type === 'TagRadio'
                        ? {
                            widget: {
                              ...item?.widget,
                              options: (item?.widget?.options || [])?.map?.((option: any) => {
                                if (option.name === item?.value) {
                                  return {
                                    ...option,
                                    children: (option?.children || [])?.map?.((child: any) => {
                                      return {
                                        ...child,
                                        value: result[child?.name],
                                      };
                                    }),
                                  };
                                }
                                return option;
                              }),
                            },
                          }
                        : {}),
                    };
                  }
                });
                return Object.assign({}, node, {
                  config: Object.assign(
                    {},
                    config,
                    {
                      execParams: obj,
                    },
                    ifUpdatetoInitParams ? { initParams: obj } : {},
                  ),
                });
              }
              return node;
            });
            const resultParams = {
              id: params.id,
              data: Object.assign({}, params, {
                flowData: Object.assign({}, flowData, {
                  nodes,
                }),
              }),
            };
            updateParams(resultParams).then((res: any) => {
              if (res && res.code === 'SUCCESS') {
                message.success('修改成功');
                setInitialState((preInitialState: any) => ({
                  ...preInitialState,
                  params: res?.data,
                }));
              } else {
                message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
              }
            });
          }
          setTimeout(() => {
            setLocked(true);
          }, 1000);
          return pre;
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onCancel = () => {
    resetFields();
    init();
  };
  const initItem = (item: any, index: number) => {
    let { name, alias, widget = {}, addType, show, locked, enabled } = item;
    const { type } = widget;
    if (!name) {
      name = item?.id;
    }
    return (
      <div
        className={`${
          type === 'TagRadio'
            ? ''
            : ['codeEditor', 'ImageLabelField'].includes(type)
            ? 'flex-box-start'
            : 'flex-box'
        } param-item ${des_bordered ? 'item-border' : ''}`}
        key={`${id}@$@${name}`}
        style={Object.assign(
          {},
          des_column > 1
            ? {
                width: `calc(${100 / des_column}% - 8px)`,
                marginRight: configList?.length % des_column === des_column - 1 ? 0 : 8,
              }
            : {},
          configList?.length % des_column === 1
            ? { marginBottom: index + 1 === configList.length ? 0 : 16 }
            : { marginBottom: 8 }, //index + des_column >= configList.length ? 0 : 16 },
          !_.isBoolean(show) || show ? {} : { height: 0, marginBottom: 0, padding: 0 },
        )}
      >
        {showLabel ? (
          <div className="title-box" style={{ width: yName, maxWidth: yName }}>
            <TooltipDiv style={{ fontSize }} className="first" title={alias || name}>
              {alias || name}
            </TooltipDiv>
            <TooltipDiv className="second" style={{ fontSize: fontSize - 4 }}>
              {name}
            </TooltipDiv>
          </div>
        ) : null}
        {/* </div> */}
        <div
          className={`${
            ['codeEditor', 'ImageLabelField'].includes(type) ? 'flex-box-start' : 'flex-box'
          } value-box`}
          style={type === 'TagRadio' ? { width: 'calc(100% - 16px)' } : {}}
        >
          <div style={{ flex: 1 }}>
            <FormatWidgetToDom
              key={name}
              id={name}
              fontSize={fontSize}
              config={[item?.name, item]}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              form={form}
              disabled={locked}
              setEditorVisible={setEditorVisible}
              setEditorValue={setEditorValue}
              setPlatFormVisible={setPlatFormVisible}
              setPlatFormValue={setPlatFormValue}
              setSelectPathVisible={setSelectPathVisible}
              setSelectedPath={setSelectedPath}
              measurementLineNum={measurementLineNum}
            />
          </div>
          {valueOnTop ? (
            <div style={{ height: fontSize * 2, width: 60, minWidth: 60, marginLeft: 8 }}>
              <SegmentSwitch
                style={{ fontSize: 12 }}
                defaultValue={enabled}
                disabled={locked}
                fontInBody={[
                  { label: '禁', value: false, backgroundColor: 'grey' },
                  {
                    label: '启',
                    value: true,
                    backgroundColor: 'rgba(24, 144, 255, 1)',
                  },
                ]}
                onChange={(val: boolean) => {
                  setConfigList((prev: any) =>
                    (prev || [])?.map?.((item: any) => {
                      if ((item.name || item.id) === name) {
                        return {
                          ...item,
                          enabled: val,
                        };
                      }
                      return item;
                    }),
                  );
                }}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <div id={`echart-${id}`} className={`${styles.operationCharts} flex-box`} style={{ fontSize }}>
      <div className={`operation-body`}>
        <Form form={form} scrollToFirstError>
          {useMemo(() => {
            return (
              <Fragment>
                {configList?.map?.((item: any, index: number) =>
                  initItem({ ...item, locked }, index),
                )}
                {configGroup?.map?.((group: any, index: number) => {
                  const { name, id, children, show } = group;
                  return (
                    <div className={`param-item param-group-item`} key={id}>
                      <div
                        className="flex-box param-group-item-title"
                        onClick={() =>
                          setConfigGroup((prev: any) =>
                            prev?.map?.((item: any) => {
                              if (item.id === id) {
                                return {
                                  ...item,
                                  show: !show,
                                };
                              }
                              return item;
                            }),
                          )
                        }
                      >
                        {name}
                      </div>
                      <div className="param-group-item-body" style={!show ? { height: 0 } : {}}>
                        {(children || [])?.map?.((child: any, index: number) => {
                          const item = configList.filter((i: any) => i?.name === child)?.[0];
                          if (!item) return null;
                          return (
                            <div
                              className="flex-box param-group-item-body-box"
                              key={`param-group-item-body-box-${index}`}
                            >
                              {/* <div className="param-line-row" >--</div> */}
                              {initItem({ ...item, show, locked }, index)}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </Fragment>
            );
          }, [
            selectedOption,
            configList,
            configGroup,
            started,
            locked,
            fontSize,
            showLabel,
            des_column,
            des_bordered,
            yName,
            measurementLineNum,
          ])}
        </Form>
      </div>
      {/* {
                locked ?
                    <div className="operation2-mask-body" />
                    : null
            } */}
      <div className="operation-footer flex-box-center">
        <Button
          type="primary"
          // disabled={!started}
          onClick={() => {
            setLocked((prev) => !prev);
          }}
        >
          {locked ? '解锁' : '锁定'}
        </Button>
        {ifPopconfirm ? (
          <Popconfirm
            disabled={locked} //{!started || locked}
            title="确认修改吗?"
            onConfirm={() => {
              onOk();
            }}
            okText="确认"
            cancelText="取消"
          >
            <Button
              type="primary"
              disabled={locked} //{!started || locked}
            >
              修改
            </Button>
          </Popconfirm>
        ) : (
          <Button
            type="primary"
            onClick={() => onOk()}
            disabled={locked} //{!started || locked}
          >
            修改
          </Button>
        )}
        <Button
          disabled={locked} //{!started || locked}
          onClick={() => onCancel()}
        >
          重置
        </Button>
      </div>

      {editorVisible ? (
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
      ) : null}
      {platFormVisible ? (
        <PlatFormModal
          visible={platFormVisible}
          data={{ ...platFormValue, ifFetch: false }}
          onOk={(val: any) => {
            const { id, ...rest } = val;
            // if (!!ifFetch) {
            //   btnFetch('post', xName, rest.value).then((res) => {
            //     console.log(res);
            //   });
            // }
            widgetChange(id, rest);
            setPlatFormValue({});
            setPlatFormVisible(false);
          }}
          onCancel={() => {
            setPlatFormValue({});
            setPlatFormVisible(false);
          }}
        />
      ) : null}
      {selectPathVisible ? (
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
      ) : null}
    </div>
  );
};

export default connect(({ home, themeStore }) => ({
  started: home.started || false,
}))(Operation2Charts);

export function FormatWidgetToDom(props: any) {
  const {
    form,
    id,
    label = '',
    fontSize = 12,
    node,
    config = [],
    parent = undefined,
    disabled,
    widgetChange,
    selectedOption,
    setSelectedOption,
    setEditorVisible,
    setEditorValue,
    setPlatFormVisible,
    setPlatFormValue,
    setSelectPathVisible,
    setSelectedPath,
    measurementLineNum = 4,
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
    options = options?.map?.((option: string) => ({ label: option, value: option }));
  }
  const name = `${id}`;

  useEffect(() => {
    if (type1 === 'TagRadio') {
      const children = (options || []).filter((i: any) => i.name === value)[0]?.children;
      setSelectedOption?.((prev: any) =>
        Object.assign({}, prev, {
          [name]: children,
        }),
      );
    }
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
            onBlur={(e: any) => {
              widgetChange?.(name, e.target.value, parent);
            }}
            onPressEnter={(e: any) => {
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
            {options?.map?.((option: any, index: any) => {
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
                setSelectedOption?.((prev: any) =>
                  Object.assign({}, prev, {
                    [name]: children,
                  }),
                );
                const result = children.reduce((pre: any, cen: any) => {
                  return {
                    ...pre,
                    [cen.name]: cen.value,
                  };
                }, {});
                setFieldsValue(result);
                widgetChange?.(name, value);
              }}
            >
              {(options || [])?.map?.((option: any) => {
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
            // (selectedOption?.[name] || [])?.map?.((item: any, index: number) => {
            //     if (!item || !item.widget) {
            //         return null;
            //     }
            //     return <div style={{ marginTop: 24 }} key={item.id}>
            //         <FormatWidgetToDom
            //             key={item.name || guid()}
            //             id={node?.id ? `${node.id}@$@${item?.name}` : item?.name}
            //             fontSize={fontSize}
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
            {options?.map?.((option: any, index: any) => {
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
            {options?.map?.((option: any, index: any) => {
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
            initialValue={
              value || value == 0
                ? value
                : defaultValue || defaultValue == 0
                ? defaultValue
                : undefined
            }
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
              onPressEnter={(e: any) => {
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
          initialValue={value || value == 0 ? value : defaultValue}
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
              }, 300);
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
          rules={[{ required: require, message: `${alias}` }]}
        >
          <SegmentSwitch
            style={{ height: fontSize * 2 }}
            fontInBody={[
              { label: '', value: false, backgroundColor: 'grey' },
              { label: '', value: true, backgroundColor: '' },
            ]}
            disabled={disabled}
            onClick={(e: boolean) => {
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
          <div className="flex-box dir">
            <TooltipDiv title={value}>{value}</TooltipDiv>
            <ChooseFileButton
              name={name}
              onClick={() => {
                if (!!localStorage.getItem('parentOrigin')) {
                  window?.parent?.postMessage?.(
                    { type: 'openFile', name, suffix },
                    localStorage.getItem('parentOrigin') || '',
                  );
                } else {
                  setSelectedPath(Object.assign(config[1], { id: name, fileType: 'file' }));
                  setSelectPathVisible(true);
                }
              }}
              onOk={(value: any) => {
                widgetChange(name, { ...config[1], value });
                form.setFieldsValue({ [name]: value });
                setSelectedPath?.({});
                setSelectPathVisible?.(false);
              }}
              disabled={disabled}
            >
              选择文件
            </ChooseFileButton>
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
          <div className="flex-box dir">
            <TooltipDiv title={value}>{value}</TooltipDiv>
            <ChooseDirButton
              name={name}
              onClick={() => {
                if (!!localStorage.getItem('parentOrigin')) {
                  window?.parent?.postMessage?.(
                    { type: 'openDir', name },
                    localStorage.getItem('parentOrigin') || '',
                  );
                } else {
                  setSelectedPath?.(Object.assign(config[1], { id: name, fileType: 'dir' }));
                  setSelectPathVisible?.(true);
                }
              }}
              onOk={(value: any) => {
                widgetChange(name, { ...config[1], value });
                form.setFieldsValue({ [name]: value });
                setSelectedPath?.({});
                setSelectPathVisible?.(false);
              }}
              disabled={disabled}
            >
              选择文件夹
            </ChooseDirButton>
          </div>
        </FormItem>
      );
    case 'codeEditor':
      return (
        <FormItem name={name} label={label} tooltip={description} className="codeEditor">
          {!!value ? (
            <Input.TextArea
              autoSize={{ maxRows: 5 }}
              value={language === 'json' && _.isObject(value) ? formatJson(value) : value}
              style={{ marginBottom: 8 }}
              disabled
            />
          ) : null}
          <Button
            style={{ fontSize: 'inherit' }}
            onClick={() => {
              setEditorValue({
                id: name,
                value: language === 'json' && _.isObject(value) ? formatJson(value) : value,
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
            <TooltipDiv title={localPath}>{localPath}</TooltipDiv>
          </FormItem>
          <div className="flex-box" style={{ gap: 8 }}>
            <ChooseFileButton
              name={name}
              onClick={() => {
                if (!!localStorage.getItem('parentOrigin')) {
                  window?.parent?.postMessage?.(
                    { type: 'openFile', name, suffix },
                    localStorage.getItem('parentOrigin') || '',
                  );
                } else {
                  setSelectedPath?.(
                    Object.assign(_.omit(config[1], 'value'), { id: name, fileType: 'file' }),
                  );
                  setSelectPathVisible?.(true);
                }
              }}
              onOk={(value: any) => {
                widgetChange(name, { ...config[1], localPath: value });
                form.setFieldsValue({ [name]: value });
                setSelectedPath?.({});
                setSelectPathVisible?.(false);
              }}
              disabled={disabled}
              style={{ marginRight: 8 }}
            >
              选择文件
            </ChooseFileButton>
            <Button
              type="primary"
              style={{ fontSize: 'inherit' }}
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
          initialValue={
            value ||
            defaultValue || {
              num_0: { alias: 'num_0', value: undefined },
            }
          }
          rules={[{ required: require, message: `${alias}` }]}
        >
          <Measurement
            disabled={disabled}
            onChange={(val: any) => {
              widgetChange?.(name, val, parent);
            }}
            precision={precision}
            step={step}
            gap={8}
            lineNum={measurementLineNum}
            max={max}
            min={min}
            type={type}
          />
        </Form.Item>
      );
    default:
      return null;
  }
}
