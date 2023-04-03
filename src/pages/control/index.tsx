import React, { Fragment, useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import { Button, message, Form, Input, Radio, Select, Checkbox, InputNumber, Switch, Modal, Row, Col, } from "antd";
import * as _ from "lodash";
import { updateParams } from "@/services/api";
import { AppstoreOutlined, CaretDownOutlined, CaretRightOutlined, DownOutlined, FolderOpenOutlined, FolderOutlined, MinusCircleOutlined, RightOutlined, UnorderedListOutlined } from "@ant-design/icons";
import PrimaryTitle from "@/components/PrimaryTitle";
import IpInput from "@/components/IpInputGroup";
import SliderGroup from "@/components/SliderGroup";
import TooltipDiv from "@/components/TooltipDiv";
import MonacoEditor from "@/components/MonacoEditor";
import PlatFormModal from "@/components/platForm";
import FileManager from "@/components/FileManager";
import { connect, useModel } from "umi";
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import DropSortableItem from "@/components/DragComponents/DropSortableItem";
import DragSortableItem from "@/components/DragComponents/DragSortableItem";
import Measurement from "@/components/Measurement";
import { formatJson, guid } from "@/utils/utils";

const FormItem = Form.Item;
const { confirm } = Modal;
const Control: React.FC<any> = (props: any) => {
  const { initialState, setInitialState } = useModel<any>('@@initialState');
  const { params: paramsData } = initialState;
  const [form] = Form.useForm();
  const { validateFields, setFieldsValue, getFieldValue } = form;
  const [paramData, setParamData] = useState<any>({});
  const [nodeList, setNodeList] = useState<any>([]);
  const [selectedOption, setSelectedOption] = useState<any>([]);
  const [editorVisible, setEditorVisible] = useState(false);
  const [editorValue, setEditorValue] = useState<any>({});
  const [platFormVisible, setPlatFormVisible] = useState(false);
  const [platFormValue, setPlatFormValue] = useState<any>({});
  const [selectPathVisible, setSelectPathVisible] = useState(false);
  const [selectedPath, setSelectedPath] = useState<any>({});
  const [listType, setListType] = useState('line');
  const [configList, setConfigList] = useState<any>([]);
  const [addConfigVisible, setAddConfigVisible] = useState(false);

  useEffect(() => {
    if (!_.isEmpty(paramsData) && !_.isEmpty(paramsData?.flowData)) {
      const { flowData, configList, selectedConfig } = paramsData;
      const { nodes } = flowData;
      setParamData(paramsData);
      setNodeList(nodes.map((item: any, index: number) => {
        if (!item.sortId || item.sortId !== 0) {
          return { ...item, sortId: index };
        }
        return item;
      }));
      if (!!configList?.length) {
        setConfigList(configList.map((config: any) => {
          if (config.value === 'default') {
            return {
              ...config,
              data: (config?.data?.length > nodes?.length) ? config?.data : nodes
            };
          };
          return config;
        }));
        if (!!selectedConfig) {
          const { data, value, listType = 'line' } = configList?.filter((i: any) => i.value === selectedConfig)[0] || {};
          setListType(listType);
          setFieldsValue({ 'config-value': _.isObject(selectedConfig) ? selectedConfig : { value: selectedConfig } });
          if (!!data?.length && _.isArray(data)) {
            setNodeList((value === 'default' ? ((data?.length > nodes?.length) ? data : nodes) : data)
              .map((item: any, index: number) => {
                if (!item.sortId || item.sortId !== 0) {
                  return { ...item, sortId: index };
                }
                return item;
              })
            );
          }
        }
      } else {
        setConfigList([{ label: '默认配置', value: 'default', data: nodes, listType: 'line' }]);
      }
    }
  }, [paramsData]);
  // 参数值改变
  const widgetChange = (key: any, value: any) => {
    key = key.split('@$@');
    setNodeList((prev: any) => {
      return prev.map((item: any, index: any) => {
        if (item.id === key[0]) {
          return Object.assign({}, item, {
            config: Object.assign({}, item?.config, {
              initParams: Object.assign({}, item?.config?.initParams, {
                [key[1]]: Object.assign({},
                  item?.config?.initParams?.[key[1]],
                  (_.isObject(value) && item?.config?.initParams[key[1]]?.widget?.type !== "Measurement") ? value : { value },
                  item?.config?.initParams?.[key[1]]?.widget?.type === 'codeEditor'
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
                    : {},
                  // item?.config?.initParams?.[key[1]]?.widget?.type === 'TagRadio' ? {
                  //   widget: Object.assign({}, item?.config?.initParams?.[key[1]]?.widget, {
                  //     options: item?.config?.initParams?.[key[1]]?.widget?.options?.map((option: any) => {
                  //       if (option.name === values[cent[0]]) {
                  //         return Object.assign({}, option, {
                  //           children: selectedOption
                  //         })
                  //       }
                  //       return option;
                  //     })
                  //   })
                  // } : {}
                )
              })
            })
          })
        }
        return item;
      })
    });
  };
  // 拖拽排序
  const sortCommonFun = (dragIndex: any, hoverIndex: any) => {
    const source = nodeList.filter((i: any) => i.sortId === dragIndex)[0];
    const target = nodeList.filter((i: any) => i.sortId === hoverIndex)[0];
    if (source && target) {
      setNodeList((prev: any) => {
        const list = _.cloneDeep(prev);
        list[dragIndex] = { ...target, sortId: dragIndex };
        list[hoverIndex] = { ...source, sortId: hoverIndex };
        return list;
      });
    } else {
      message.warning('排序出错，请联系开发人员。');
    }
  };
  // 切换排列方式
  const onChangeView = (type: string) => {
    setListType(type);
    setConfigList((prev: any) => {
      return prev.map((item: any) => {
        if (item.value === getFieldValue('config-value')) {
          return Object.assign({}, item, {
            listType: type,
          })
        };
        return item;
      })
    })
  };
  // 另存为配置
  const onAddNewConfig = () => {
    validateFields()
      .then((values) => {
        const id = guid();
        const result = configList.concat({
          label: values['config-name'],
          value: id,
          data: nodeList,
          listType: 'line'
        });
        setConfigList(result);
        setFieldsValue({ 'config-value': id });
        setAddConfigVisible(false);

        const params = {
          id: paramData.id,
          data: Object.assign({}, paramData, {
            flowData: Object.assign({}, paramData.flowData, {
              nodes: nodeList
            }),
            configList: result,
            selectedConfig: id,
          })
        };
        setInitialState({ ...initialState, params: params.data });
        updateParams(params).then((res: any) => {
          if (res && res.code === 'SUCCESS') {
            message.success('修改成功');
          } else {
            message.error(res?.msg || res?.message || '接口异常');
          }
        });

      })
      .catch((err) => {
        const { errorFields } = err;
        errorFields?.length && message.error(`${errorFields[0]?.errors[0]} 是必填项`);
      });
  };
  // 提交表单
  const onFinish = () => {
    validateFields()
      .then((values) => {
        const params = {
          id: paramData.id,
          data: Object.assign({}, paramData, {
            flowData: Object.assign({}, paramData.flowData, {
              nodes: nodeList
            }),
            configList: configList.map((item: any) => {
              if (item.value === paramData.selectedConfig) {
                return Object.assign({}, item, { data: nodeList });
              }
              return item;
            }),
            selectedConfig: values['config-value']?.value,
          })
        };
        setInitialState({ ...initialState, params: params.data });
        updateParams(params).then((res: any) => {
          if (res && res.code === 'SUCCESS') {
            message.success('修改成功');
          } else {
            message.error(res?.msg || res?.message || '接口异常');
          }
        });
      })
      .catch((err) => {
        const { errorFields } = err;
        errorFields?.length && message.error(`${errorFields[0]?.errors[0]} 是必填项`);
      });
  };
  // 配置文件改变
  const selectUpdate = (val: any, option: any) => {
    const { data, listType = 'line' } = option;
    const result = data.map((item: any, index: number) => {
      if (!item.sortId || item.sortId !== 0) {
        return { ...item, sortId: index };
      }
      return item;
    });

    const params = {
      id: paramData.id,
      data: Object.assign({}, paramData, {
        flowData: Object.assign({}, paramData.flowData, {
          nodes: result
        }),
        configList: configList.map((item: any) => {
          if (item.value === val?.value) {
            return Object.assign({}, item, { data: result });
          }
          return item;
        }),
        selectedConfig: val?.value,
      })
    };
    updateParams(params).then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        setInitialState({ ...initialState, params: params.data });
        message.success('修改成功');
      } else {
        message.error(res?.msg || res?.message || '接口异常');
      }
    });
  };
  // 配置文件列表删除
  const selectDelete = (val: string) => {
    const params = {
      id: paramData.id,
      data: Object.assign({}, paramData, {
        configList: configList.filter((item: any) => item.value !== val),
      })
    };
    updateParams(params).then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        setInitialState({ ...initialState, params: params.data });
        message.success('修改成功');
      } else {
        message.error(res?.msg || res?.message || '接口异常');
      }
    });
  }

  return (
    <div className={`${styles.control} flex-box page-size background-ubv`}>
      <PrimaryTitle title={"参数控制"} >
        <div className="flex-box title-btn-box">
          <UnorderedListOutlined
            className={listType === 'line' ? 'selected' : ''}
            onClick={() => onChangeView('line')}
          />
          <AppstoreOutlined
            className={listType === 'block' ? 'selected' : ''}
            onClick={() => onChangeView('block')}
          />
        </div>
      </PrimaryTitle>
      <div className="control-body">
        <DndProvider backend={HTML5Backend}>
          <Form
            form={form}
            scrollToFirstError
          >
            <Form.Item
              name="config-value"
              label="配置文件"
              initialValue={{ value: "default" }}
              rules={[{ required: false, message: "历史记录服务端地址" }]}
            >
              <Select
                style={{ width: '100%' }}
                size="large"
                // options={configList}
                placeholder="配置文件"
                showSearch
                labelInValue
                filterOption={(inputValue: any, option: any) => {
                  return option?.option?.label?.indexOf(inputValue) > -1;
                }}
                onChange={(val, option: any) => {
                  selectUpdate(val, option?.option)
                }}
              >
                {
                  configList.map((item: any) => {
                    const { value, label } = item;
                    return <Select.Option value={value} option={item} key={value}>
                      <div className="flex-box">
                        <div style={{ flex: 1 }}>{label}</div>
                        {
                          (paramsData?.selectedConfig === value || value === 'default') ?
                            null
                            :
                            <MinusCircleOutlined onClick={(e) => {
                              // 组织鼠标击穿
                              e.preventDefault();
                              e.stopPropagation();
                              confirm({
                                title: <div>确定删除配置 <span style={{ color: "#1890ff" }}>{label}</span>?</div>,
                                content: '删除后无法恢复',
                                onOk() {
                                  selectDelete(value);
                                },
                                onCancel() {

                                },
                              });
                            }} />
                        }
                      </div>
                    </Select.Option>
                  })
                }
              </Select>
            </Form.Item>
            {
              (nodeList || []).sort((a: any, b: any) => a.sortId - b.sortId).map((node: any, index: any) => {
                const { id, alias, name, config = {}, hidden, sortId } = node;
                const { initParams = {}, group = [] } = config;
                //判断属性是否在分组内
                const ifInGroup = group.reduce((pre: any, cen: any) => {
                  return pre.concat(cen.children)
                }, []);

                if (!!initParams && !_.isEmpty(initParams)) {
                  if (Object.entries(initParams).filter((i: any) => !i[1].onHidden).length === 0) return null;
                  const TagRadioList = Object.entries(initParams).reduce((pre: any, cen: any) => {
                    const { widget } = cen[1] || {};
                    if (widget?.type === 'TagRadio') {
                      const ids = (widget?.options || []).reduce((optionP: any, optionC: any) => {
                        const { children } = optionC;
                        const childIds = children.map((item: any) => item.id);
                        return optionP.concat(childIds);
                      }, []);
                      return pre.concat(ids)
                    }
                    return pre;
                  }, []);
                  return <div key={id} className={`control-item ${listType === 'block' ? 'block' : ''}`}>
                    {
                      // @ts-ignore
                      <DropSortableItem name={name} index={sortId} moveCard={sortCommonFun} >
                        <div>
                          {
                            // @ts-ignore
                            <DragSortableItem name={name} index={sortId} >
                              <div className="item-title flex-box" onClick={() => {
                                setNodeList((prev: any) => {
                                  return prev.map((pre: any) => {
                                    if (pre.id === id) {
                                      return Object.assign({}, pre, {
                                        hidden: !hidden,
                                      });
                                    }
                                    return pre;
                                  })
                                })
                              }}>
                                {hidden ? <CaretRightOutlined /> : <CaretDownOutlined />}
                                {alias || name}
                              </div>
                            </DragSortableItem>
                          }
                        </div>
                      </DropSortableItem>
                    }
                    {
                      !hidden ?
                        <Fragment>
                          {
                            (Object.entries(initParams) || [])
                              ?.sort((a: any, b: any) => {
                                return a[1]?.orderId - b[1]?.orderId
                              }).map((item: any) => {
                                const { alias, name, widget, onHidden } = item[1];
                                const { type } = widget || {};
                                if (!widget || onHidden || TagRadioList.includes(item[0]) || ifInGroup?.includes(item[0])) return null;
                                return <div className="flex-box param-item" key={`${id}@$@${item[0]}`}>
                                  <div className="icon-box flex-box">
                                    {_.toUpper(type.slice(0, 1))}
                                    {/* <BlockOutlined className="item-icon" /> */}
                                  </div>
                                  <div className="title-box">
                                    <TooltipDiv className="first">{alias}</TooltipDiv>
                                    <TooltipDiv className="second">{name}</TooltipDiv>
                                  </div>
                                  <div className="value-box">
                                    <FormatWidgetToDom
                                      id={`${id}@$@${item[0]}`}
                                      node={node}
                                      config={item}
                                      form={form}
                                      disabled={false}
                                      selectedOption={selectedOption}
                                      setSelectedOption={setSelectedOption}
                                      widgetChange={widgetChange}
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
                          }
                          {
                            group?.map((grou: any) => {
                              const { name, id, open, children } = grou;
                              return (
                                <div key={`${name}_${id}`} style={{ marginLeft: 24 }}>
                                  <Row style={{ marginBottom: 8 }}>
                                    <Col className='label-style' style={{ flex: 1, cursor: 'pointer', paddingRight: 0 }} onClick={() => {
                                      setNodeList((prev: any) => {
                                        return prev.map((item: any) => {
                                          if (item.id === node.id) {
                                            return Object.assign({}, item, {
                                              config: Object.assign({}, item.config, {
                                                group: item.config?.group.map((grou: any) => {
                                                  if (grou?.id === id) {
                                                    return Object.assign({}, grou, { open: !open })
                                                  }
                                                  return grou;
                                                })
                                              })
                                            });
                                          }
                                          return item;
                                        })
                                      })
                                    }}>
                                      <div className="flex-box-justify-between config-box-item">
                                        <div className="flex-box" style={{ width: '90%' }}>
                                          {open ? (
                                            <FolderOpenOutlined />
                                          ) : (
                                            <FolderOutlined />
                                          )}
                                          <TooltipDiv title={name} style={{ margin: '0 16px 0 4px' }}>
                                            {name}
                                          </TooltipDiv>
                                        </div>
                                        {open ? (
                                          <DownOutlined />
                                        ) : (
                                          <RightOutlined />
                                        )}
                                      </div>
                                    </Col>
                                  </Row>
                                  <div style={open ? {} : { display: 'none' }}>
                                    {
                                      children.map((child: any) => {
                                        const parent = initParams;
                                        let item: any = {};
                                        if (parent[child]) {
                                          item = {
                                            ...parent[child]
                                          };
                                        } else {
                                          return null;
                                        }
                                        const { alias, name, widget, } = item;
                                        const { type } = widget || {};
                                        return <div className="flex-box param-item" key={`${id}@$@${child}`}>
                                          <div className="icon-box flex-box">
                                            {_.toUpper(type.slice(0, 1))}
                                            {/* <BlockOutlined className="item-icon" /> */}
                                          </div>
                                          <div className="title-box">
                                            <TooltipDiv className="first">{alias}</TooltipDiv>
                                            <TooltipDiv className="second">{name}</TooltipDiv>
                                          </div>
                                          <div className="value-box">
                                            <FormatWidgetToDom
                                              id={`${node.id}@$@${child}`}
                                              node={node}
                                              config={[child, item]}
                                              form={form}
                                              disabled={false}
                                              selectedOption={selectedOption}
                                              setSelectedOption={setSelectedOption}
                                              widgetChange={widgetChange}
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
                                    }
                                  </div>
                                </div>
                              );
                            })
                          }
                        </Fragment>
                        : null
                    }
                  </div>
                }
                return null;
              })
            }
          </Form>
        </DndProvider>
      </div>
      <div className="control-footer flex-box">
        <Button onClick={() => setAddConfigVisible(true)}>另存为新配置</Button>
        <Button type="primary" onClick={() => onFinish()}>保存</Button>
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
      {
        addConfigVisible ?
          <Modal
            title={'另存为配置'}
            open={addConfigVisible}
            onOk={() => {
              onAddNewConfig()
            }}
            onCancel={() => {
              setAddConfigVisible(false);
            }}
            getContainer={false}
          >
            <Form
              form={form}
              scrollToFirstError
            >
              <Form.Item
                name="config-name"
                label="新增配置名称"
                rules={[{ required: true, message: "新增配置名称" }]}
              >
                <Input />
              </Form.Item>
            </Form>
          </Modal>
          : null
      }
    </div >
  );
};

export default connect(({ home, themeStore }) => ({

}))(Control);

export const FormatWidgetToDom = (props: any) => {
  const {
    id, label = '', node, config = [], disabled, widgetChange,
    setSelectedOption,
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
      const children = options.filter((i: any) => i.name === value)[0]?.children;
      setSelectedOption(children);
    };
  }, [type1]);

  switch (type1) {
    case 'Input':
      return (
        <FormItem
          name={`${name}$$${guid()}`}
          label={label}
          tooltip={description}
          initialValue={value || undefined}
          rules={[{ required: require, message: `${alias}` }]}
        >
          <Input
            placeholder={`请输入${alias}`}
            disabled={disabled}
            onBlur={(e) => {
              widgetChange?.(name, e.target.value);
            }}
          />
        </FormItem>
      );
    case 'IpInput':
      return (
        <Form.Item
          name={`${name}$$${guid()}`}
          label={label}
          tooltip={description}
          initialValue={value || undefined}
          rules={[{ required: require, message: `${alias}` }]}
        >
          <IpInput
            disabled={disabled}
            onChange={(val: string) => {
              widgetChange?.(name, val);
            }}
          />
        </Form.Item>
      );
    case 'Radio':
      return (
        <FormItem
          name={`${name}$$${guid()}`}
          label={label}
          tooltip={description}
          initialValue={(_.isArray(value) ? value[0] : value) || undefined}
          rules={[{ required: require, message: `${alias}` }]}
        >
          <Radio.Group onChange={(e) => {
            widgetChange?.(name, e.target.value);
          }}>
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
            name={`${name}$$${guid()}`}
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
                setSelectedOption(children);
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
            // (selectedOption || []).filter((child: any) => !stateData.configPanelChange[child.id]).map((item: any, index: number) => {
            //   if (!item || !item.widget) {
            //     return null;
            //   }
            //   return <div style={{ marginTop: 24 }} key={item.id}>
            //     <FormatWidgetToDom
            //       key={item.id || guid()}
            //       config={[item.id, item]}
            //       form={form}
            //       setEditorVisible={setEditorVisible}
            //       disabled={disabled}
            //       widgetChange={widgetChange}
            //     />
            //   </div>
            // })
          }
        </>
      );
    case 'Select':
      return (
        <FormItem
          name={`${name}$$${guid()}`}
          label={label}
          tooltip={description}
          initialValue={(_.isArray(value) ? value[0] : value) || false}
          rules={[{ required: require, message: `${alias}` }]}
        >
          <Select
            placeholder={`${alias}`}
            disabled={disabled}
            onChange={(e: any) => {
              widgetChange?.(name, e)
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
          name={`${name}$$${guid()}`}
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
              widgetChange?.(name, e)
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
          name={`${name}$$${guid()}`}
          label={label}
          tooltip={description}
          initialValue={value || undefined}
          rules={[{ required: require, message: `${alias}` }]}
        >
          <Checkbox.Group
            options={options}
            disabled={disabled}
            onChange={(e) => {
              widgetChange?.(name, e)
            }}
          />
        </FormItem>
      );
    case 'InputNumber':
      return (
        <Fragment>
          <FormItem
            name={`${name}$$${guid()}`}
            label={label}
            tooltip={description}
            initialValue={(value || value == 0) ? value : defaultValue}
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
                widgetChange?.(name, Number(value < max ? value : max));
              }}
            />
          </FormItem>
        </Fragment>
      );
    case 'Slider':
      return (
        <FormItem
          name={`${name}$$${guid()}`}
          label={label}
          tooltip={description}
          initialValue={(value || value == 0) ? value : defaultValue}
          rules={[{ required: require, message: `${alias}` }]}
        >
          <SliderGroup
            step={step}
            max={max}
            min={min}
            precision={precision}
            onChange={(e: any) => {
              !!updateTimer?.current && clearTimeout(updateTimer?.current);
              updateTimer.current = setTimeout(() => {
                widgetChange?.(name, Number(e))
              }, 300)
            }}
          />
        </FormItem>
      );
    case 'Switch':
      return (
        <FormItem
          name={`${name}$$${guid()}`}
          label={label}
          tooltip={description}
          initialValue={value || false}
          valuePropName="checked"
          rules={[{ required: require, message: `${alias}` }]}
        >
          <Switch
            disabled={disabled}
            onChange={(e) => {
              widgetChange?.(name, e)
            }}
          />
        </FormItem>
      );
    case 'File':
      return (
        <FormItem
          shouldUpdate
          name={`${name}$$${guid()}`}
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
          name={`${name}$$${guid()}`}
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
          name={`${name}$$${guid()}`}
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
            name={`${name}$$${guid()}`}
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
              disabled={!localPath}
            >
              开始标注
            </Button>
          </div>
        </>
      );
    case 'Measurement':
      return (
        <Form.Item
          name={`${name}$$${guid()}`}
          label={label}
          tooltip={description}
          initialValue={value || defaultValue || {
            num_0: undefined,
            num_1: undefined,
            num_2: undefined,
            num_3: undefined,
          }}
          rules={[{ required: require, message: `${alias}` }]}
        >
          <Measurement
            disabled={disabled}
            onChange={(val: any) => {
              widgetChange?.(name, val);
            }}
          />
        </Form.Item>
      );
    default:
      return null;
  }
};