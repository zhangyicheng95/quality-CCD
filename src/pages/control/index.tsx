import React, { Fragment, useEffect, useRef, useState } from 'react';
import styles from './index.module.less';
import {
  Button,
  message,
  Form,
  Input,
  Radio,
  Select,
  Checkbox,
  InputNumber,
  Switch,
  Modal,
  Row,
  Col,
  DatePicker,
  Tooltip,
  Cascader,
} from 'antd';
import * as _ from 'lodash';
import { updateParams } from '@/services/api';
import {
  AppstoreOutlined,
  CaretDownOutlined,
  CaretRightOutlined,
  DownOutlined,
  FolderOpenOutlined,
  FolderOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  RetweetOutlined,
  RightOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import PrimaryTitle from '@/components/PrimaryTitle';
import IpInput from '@/components/IpInputGroup';
import SliderGroup from '@/components/SliderGroup';
import TooltipDiv from '@/components/TooltipDiv';
import MonacoEditor from '@/components/MonacoEditor';
import PlatFormModal from '@/components/platForm';
import FileManager from '@/components/FileManager';
import { connect, useModel } from 'umi';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DropSortableItem from '@/components/DragComponents/DropSortableItem';
import DragSortableItem from '@/components/DragComponents/DragSortableItem';
import Measurement from '@/components/Measurement';
import { formatJson, guid } from '@/utils/utils';
import moment from 'moment';
import ChooseFileButton from '@/components/ChooseFileButton';
import ChooseDirButton from '@/components/ChooseDirButton';

const FormItem = Form.Item;
const { confirm } = Modal;
const Control: React.FC<any> = (props: any) => {
  const { initialState, setInitialState } = useModel<any>('@@initialState');
  const { params: paramsData } = initialState;
  const [form2] = Form.useForm();
  const [form1] = Form.useForm();
  const [form] = Form.useForm();
  const { validateFields, setFieldsValue, getFieldValue } = form;
  const saveRef = useRef<any>();
  const saveNumRef = useRef<any>(0);
  const [paramData, setParamData] = useState<any>({});
  const [nodeList, setNodeList] = useState<any>([]);
  const [selectedOption, setSelectedOption] = useState<any>({});
  const [tagRadioIds, setTagRadioIds] = useState<any>([]);
  const [editorVisible, setEditorVisible] = useState(false);
  const [editorValue, setEditorValue] = useState<any>({});
  const [platFormVisible, setPlatFormVisible] = useState(false);
  const [platFormValue, setPlatFormValue] = useState<any>({});
  const [selectPathVisible, setSelectPathVisible] = useState(false);
  const [selectImageLabelField, setSelectImageLabelField] = useState<any>(null);
  const [selectedPath, setSelectedPath] = useState<any>({});
  const [listType, setListType] = useState('line');
  const [configList, setConfigList] = useState<any>([]);
  const [addConfigVisible, setAddConfigVisible] = useState(false);
  const [nodeConnectVisible, setNodeConnectVisible] = useState(false);
  const [connectNodeList, setConnectNodeList] = useState<any>([]);
  const [connectNodeItem, setConnectNodeItem] = useState<any>({});

  useEffect(() => {
    if (!_.isEmpty(paramsData) && !_.isEmpty(paramsData?.flowData)) {
      const { flowData, configList, selectedConfig, listType = 'line' } = paramsData;
      const { nodes, edges } = flowData;
      let configOption: any = {},
        TagRadioList: any = [],
        list: any = [],
        connectNode: any = [];
      (nodes || [])?.forEach((node: any, index: number) => {
        const { alias, name, id, config } = node;
        const { initParams } = config;
        const childrenList = (Object.entries(initParams) || [])
          ?.map?.((par: any) => {
            const { alias, name, widget } = par[1];
            // if (['TagRadio', 'File', 'Dir', 'codeEditor', 'ImageLabelField', 'DataMap'].includes(widget.type)) return null;
            return {
              label: alias || name,
              value: name,
              __type: widget?.type,
              disabled: false,
            };
          })
          .filter(Boolean);
        if (!!initParams && Object.keys(initParams)?.length && childrenList?.length) {
          connectNode.push({
            label: alias || name,
            value: id,
            children: childrenList,
          });
        }

        (Object.entries(initParams) || [])?.forEach((res: any) => {
          const item = res[1];
          if (item?.widget?.type === 'TagRadio') {
            configOption[item.name] = (item?.widget?.options || {})
              .filter((i: any) => i.name === item.value)?.[0]
              ?.children?.map?.((child: any) => {
                return {
                  ...child,
                  parent: res[0],
                };
              });
            let ids = (item?.widget?.options || []).reduce((optionP: any, optionC: any) => {
              const { children } = optionC;
              const childIds = children?.map?.((item: any) => item.id || item.name);
              return optionP.concat(childIds);
            }, []);
            TagRadioList = Array.from(new Set(TagRadioList.concat(ids)));
          }
        });
        if (!node.sortId || node.sortId !== 0) {
          list.push({ ...node, sortId: index });
        } else {
          list.push(node);
        }
      });
      setParamData(paramsData);
      setNodeList(list);
      setConnectNodeList(connectNode);
      setSelectedOption?.(configOption);
      setTagRadioIds(TagRadioList);
      setListType(listType);
      if (!!configList?.length) {
        setConfigList(configList);
        //   configList?.map?.((config: any) => {
        //     if (config.value === 'default') {
        //       return {
        //         ...config,
        //         ...(config?.data?.length >= nodes?.length
        //           ? {
        //               data: nodes,
        //               edges,
        //             }
        //           : {}),
        //       };
        //     }
        //     return !!config?.edges ? config : { ...config, edges };
        //   }),
        // );
        if (!!selectedConfig) {
          const { data, value } =
            configList?.filter((i: any) => i.value === selectedConfig)[0] || {};
          setFieldsValue({
            'config-value': _.isObject(selectedConfig) ? selectedConfig : { value: selectedConfig },
          });
          if (!!data?.length && _.isArray(data)) {
            setNodeList(
              (value === 'default' ? (data?.length >= nodes?.length ? data : nodes) : data)?.map?.(
                (item: any, index: number) => {
                  if (!item.sortId || item.sortId !== 0) {
                    return { ...item, sortId: index };
                  }
                  return item;
                },
              ),
            );
          }
        }
      } else {
        setConfigList([{ label: '默认配置', value: 'default', data: nodes, edges: edges }]);
      }
    }
  }, [paramsData]);
  // 参数值改变
  const widgetChange = (key: any, value: any, parent?: any) => {
    key = key.split('@$@');
    parent = parent?.split('@$@');
    setNodeList((prev: any) => {
      return prev?.map?.((item: any, index: any) => {
        if (item.id === key[0]) {
          const initParams = Object.entries(item?.config?.initParams)?.reduce(
            (pre: any, cen: any) => {
              return Object.assign(
                {},
                pre,
                cen[1]?.type
                  ? {
                      [cen[0]]: Object.assign({}, cen[1], cen[1]?.name ? {} : { name: cen[0] }),
                    }
                  : {},
              );
            },
            {},
          );
          return Object.assign({}, item, {
            config: Object.assign({}, item?.config, {
              initParams: Object.assign(
                {},
                initParams,
                !!initParams?.[key[1]]?.name && !!initParams?.[key[1]]?.type
                  ? {
                      [key[1]]: Object.assign(
                        {},
                        initParams?.[key[1]],
                        _.isObject(value) &&
                          !_.isArray(value) &&
                          initParams[key[1]]?.widget?.type !== 'Measurement'
                          ? value
                          : { value },
                        initParams?.[key[1]]?.widget?.type === 'codeEditor'
                          ? {
                              value:
                                value?.language === 'json'
                                  ? _.isString(value?.value)
                                    ? JSON.parse(value?.value)
                                    : value?.value
                                  : value?.value,
                            }
                          : {},
                        initParams?.[key[1]]?.widget?.type === 'DataMap'
                          ? {
                              widget: {
                                ...initParams?.[key[1]]?.widget,
                                options: value,
                              },
                              value: (value || [])?.reduce((pre: any, cen: any) => {
                                return Object.assign({}, pre, {
                                  [cen.label]: cen.value,
                                });
                              }, {}),
                            }
                          : {},
                      ),
                    }
                  : {},
                // 有parent代表是TagRadio
                !!parent && !!initParams?.[parent[1]]
                  ? {
                      [parent[1]]: {
                        ...initParams[parent[1]],
                        widget: {
                          ...initParams[parent[1]]?.widget,
                          options: (initParams[parent[1]]?.widget?.options || [])?.map?.(
                            (option: any) => {
                              if (option?.name === initParams[parent[1]]?.value) {
                                return {
                                  ...option,
                                  children: (option?.children || [])?.map?.((child: any) => {
                                    if (child?.name === key[1]) {
                                      return {
                                        ...child,
                                        value,
                                      };
                                    }
                                    return child;
                                  }),
                                };
                              }
                              return option;
                            },
                          ),
                        },
                      },
                    }
                  : {},
              ),
            }),
          });
        }
        return item;
      });
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
  };
  // 另存为配置
  const onAddNewConfig = () => {
    validateFields()
      .then((values) => {
        const { flowData, configList } = paramsData;
        const { nodes, edges } = flowData;
        const id = guid();
        const result = {
          label: values['config-name'],
          value: id,
          data: formatNode(),
          edges: (edges || []).filter((edge: any) => {
            return (nodes || []).filter(
              (node: any) => node.id === edge?.source?.cell || node.id === edge?.target?.cell,
            ).length;
          }),
        };
        setConfigList((prev: any) => prev.concat(result));
        setFieldsValue({ 'config-value': id });
        setAddConfigVisible(false);

        const params = {
          id: paramData.id,
          data: Object.assign({}, paramData, {
            flowData: Object.assign({}, paramData.flowData, {
              nodes: result.data,
              edges: result.edges,
            }),
            configList: configList.concat(result),
            selectedConfig: id,
          }),
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
  const formatNode = () => {
    const result = nodeList?.map?.((node: any) => {
      const initParams = Object.entries(node?.config?.initParams || {}).reduce(
        (pre: any, cen: any) => {
          if (
            cen[1]?.widget?.type === 'ImageLabelField' &&
            !!cen[1]?.value &&
            !_.isArray(cen[1]?.value)
          ) {
            return {
              ...pre,
              [cen[0]]: {
                ...cen[1],
                value: Object.entries(cen[1]?.value || {})?.map?.((i: any) => i[1]),
              },
            };
          }
          return { ...pre, [cen[0]]: cen[1] };
        },
        {},
      );

      return {
        ...node,
        config: {
          ...node.config,
          initParams,
        },
      };
    });

    return result;
  };
  // 提交表单
  const onFinish = () => {
    validateFields()
      .then((values) => {
        const nodes = formatNode();
        console.log(nodes);
        const params = {
          id: paramData.id,
          data: Object.assign({}, paramData, {
            flowData: Object.assign({}, paramData.flowData, {
              nodes: nodes,
            }),
            configList: configList?.map?.((item: any) => {
              if (item.value === paramData.selectedConfig) {
                return Object.assign({}, item, { data: nodes });
              }
              return item;
            }),
            selectedConfig: values['config-value']?.value,
            listType: listType || 'line',
          }),
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
    const { data, edges } = option;
    const result = data?.map?.((item: any, index: number) => {
      if (!item.sortId || item.sortId !== 0) {
        return { ...item, sortId: index };
      }
      return item;
    });
    const params = {
      id: paramData.id,
      data: Object.assign({}, paramData, {
        flowData: Object.assign({}, paramData.flowData, {
          nodes: result,
          edges,
        }),
        configList: configList?.map?.((item: any) => {
          if (item.value === val?.value) {
            return Object.assign({}, item, { data: result });
          }
          return item;
        }),
        selectedConfig: val?.value,
      }),
    };
    setInitialState({ ...initialState, params: params.data });
    updateParams(params).then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        message.success('修改成功');
        window.location.reload();
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
      }),
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

  return (
    <div className={`${styles.control} flex-box page-size background-ubv`}>
      <PrimaryTitle title={'参数控制'}>
        <div className="flex-box title-btn-box">
          <Tooltip title={'节点属性关联'} placement="bottom">
            <RetweetOutlined onClick={() => setNodeConnectVisible(true)} />
          </Tooltip>
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
          <Form form={form} scrollToFirstError>
            <Form.Item
              name="config-value"
              label="配置文件"
              initialValue={{ value: 'default' }}
              rules={[{ required: false, message: '配置文件' }]}
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
                  const { value, propsKey } = option;
                  const item = JSON.parse(propsKey);
                  selectUpdate(val, item);
                }}
              >
                {configList?.map?.((item: any) => {
                  const { value, label } = item;
                  return (
                    <Select.Option value={value} propsKey={JSON.stringify(item)} key={value}>
                      <div className="flex-box">
                        <div style={{ flex: 1 }}>{label}</div>
                        {paramsData?.selectedConfig === value || value === 'default' ? null : (
                          <MinusCircleOutlined
                            onClick={(e) => {
                              // 防止鼠标击穿
                              e.preventDefault();
                              e.stopPropagation();
                              confirm({
                                title: (
                                  <div>
                                    确定删除配置 <span style={{ color: '#1890ff' }}>{label}</span>?
                                  </div>
                                ),
                                content: '删除后无法恢复',
                                onOk() {
                                  selectDelete(value);
                                },
                                onCancel() {},
                              });
                            }}
                          />
                        )}
                      </div>
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            {(nodeList || [])
              .sort((a: any, b: any) => a.sortId - b.sortId)
              ?.map?.((node: any, index: any) => {
                const { id, alias, name, config = {}, hidden, sortId } = node;
                const { initParams = {}, group = [] } = config;
                //判断属性是否在分组内
                const ifInGroup = group.reduce((pre: any, cen: any) => {
                  return pre.concat(cen.children);
                }, []);

                if (!!initParams && !_.isEmpty(initParams)) {
                  if (Object.entries(initParams).filter((i: any) => !i[1].onHidden).length === 0)
                    return null;
                  const TagRadioList = Object.entries(initParams).reduce((pre: any, cen: any) => {
                    const { widget } = cen[1] || {};
                    if (widget?.type === 'TagRadio') {
                      const ids = (widget?.options || []).reduce((optionP: any, optionC: any) => {
                        const { children = [] } = optionC;
                        const childIds = (children || [])?.map?.((item: any) => item.id);
                        return optionP.concat(childIds);
                      }, []);
                      return pre.concat(ids);
                    }
                    return pre;
                  }, []);
                  return (
                    <div key={id} className={`control-item ${listType === 'block' ? 'block' : ''}`}>
                      {
                        // @ts-ignore
                        <DropSortableItem name={name} index={sortId} moveCard={sortCommonFun}>
                          <div>
                            {
                              // @ts-ignore
                              <DragSortableItem name={name} index={sortId}>
                                <div
                                  className="item-title flex-box"
                                  style={hidden ? {} : { marginBottom: 8 }}
                                  onClick={() => {
                                    setNodeList((prev: any) => {
                                      return prev?.map?.((pre: any) => {
                                        if (pre.id === id) {
                                          return Object.assign({}, pre, {
                                            hidden: !hidden,
                                          });
                                        }
                                        return pre;
                                      });
                                    });
                                  }}
                                >
                                  {hidden ? <CaretRightOutlined /> : <CaretDownOutlined />}
                                  {alias || name}
                                </div>
                              </DragSortableItem>
                            }
                          </div>
                        </DropSortableItem>
                      }
                      {!hidden ? (
                        <Fragment>
                          {(Object.entries(initParams) || [])
                            ?.sort((a: any, b: any) => {
                              return a[1]?.orderId - b[1]?.orderId;
                            })
                            ?.map?.((item: any) => {
                              const { alias, name, widget, onHidden } = item[1];
                              const { type } = widget || {};
                              if (
                                !widget ||
                                onHidden ||
                                TagRadioList.includes(item[0]) ||
                                ifInGroup?.includes(item[0])
                              )
                                return null;
                              return (
                                <div
                                  className={`${
                                    type === 'TagRadio' ? '' : 'flex-box-start'
                                  } param-item`}
                                  key={`${id}@$@${item[0]}`}
                                >
                                  <div className="flex-box">
                                    {/* <div className="icon-box flex-box">
                                      {_.toUpper(type.slice(0, 1))}
                                    </div> */}
                                    <div
                                      className="title-box"
                                      style={listType === 'block' ? { width: 'auto' } : {}}
                                    >
                                      <TooltipDiv className="first" title={alias || name}>
                                        {alias || name}
                                      </TooltipDiv>
                                      <TooltipDiv className="second">{name}</TooltipDiv>
                                    </div>
                                  </div>
                                  <div
                                    className="value-box"
                                    style={
                                      type === 'TagRadio' ? { width: 'calc(100% - 16px)' } : {}
                                    }
                                  >
                                    <FormatWidgetToDom
                                      id={`${id}@$@${item[0]}`}
                                      node={node}
                                      config={item}
                                      form={form}
                                      form1={form1}
                                      disabled={false}
                                      selectedOption={selectedOption}
                                      setSelectedOption={setSelectedOption}
                                      widgetChange={widgetChange}
                                      setEditorVisible={setEditorVisible}
                                      setEditorValue={setEditorValue}
                                      setPlatFormVisible={setPlatFormVisible}
                                      setPlatFormValue={setPlatFormValue}
                                      setSelectPathVisible={setSelectPathVisible}
                                      setSelectImageLabelField={setSelectImageLabelField}
                                      setSelectedPath={setSelectedPath}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          {group?.map?.((grou: any) => {
                            if (!!!grou || _.isEmpty(grou)) {
                              return null;
                            }
                            const { name, id, open, children = [] } = grou;
                            return (
                              <div key={`${name}_${id}`} style={{ margin: '0 16px' }}>
                                <Row style={{ marginBottom: 8 }}>
                                  <Col
                                    className="label-style"
                                    style={{ flex: 1, cursor: 'pointer', paddingRight: 0 }}
                                    onClick={() => {
                                      setNodeList((prev: any) => {
                                        return prev?.map?.((item: any) => {
                                          if (item.id === node.id) {
                                            return Object.assign({}, item, {
                                              config: Object.assign({}, item.config, {
                                                group: item.config?.group?.map?.((grou: any) => {
                                                  if (grou?.id === id) {
                                                    return Object.assign({}, grou, { open: !open });
                                                  }
                                                  return grou;
                                                }),
                                              }),
                                            });
                                          }
                                          return item;
                                        });
                                      });
                                    }}
                                  >
                                    <div className="flex-box-justify-between config-box-item">
                                      <div className="flex-box" style={{ width: '90%' }}>
                                        {open ? <FolderOpenOutlined /> : <FolderOutlined />}
                                        <TooltipDiv title={name} style={{ margin: '0 16px 0 4px' }}>
                                          {name}
                                        </TooltipDiv>
                                      </div>
                                      {open ? <DownOutlined /> : <RightOutlined />}
                                    </div>
                                  </Col>
                                </Row>
                                <div style={open ? {} : { display: 'none' }}>
                                  {(children || [])?.map?.((child: any) => {
                                    const parent = initParams || {};
                                    let item: any = {};
                                    if (parent[child]) {
                                      item = {
                                        ...parent[child],
                                      };
                                    } else {
                                      return null;
                                    }
                                    const { alias, name, widget } = item;
                                    const { type } = widget || {};
                                    return (
                                      <div
                                        className={`${
                                          type === 'TagRadio' ? '' : 'flex-box'
                                        } param-item`}
                                        key={`${id}@$@${child}`}
                                      >
                                        <div className="flex-box-start">
                                          <div className="icon-box flex-box">
                                            {_.toUpper(type.slice(0, 1))}
                                            {/* <BlockOutlined className="item-icon" /> */}
                                          </div>
                                          <div
                                            className="title-box"
                                            style={listType === 'block' ? { width: 'auto' } : {}}
                                          >
                                            <TooltipDiv className="first" title={alias || name}>
                                              {alias || name}
                                            </TooltipDiv>
                                            <TooltipDiv className="second">{name}</TooltipDiv>
                                          </div>
                                        </div>
                                        <div
                                          className="value-box"
                                          style={
                                            type === 'TagRadio'
                                              ? { width: 'calc(100% - 16px)' }
                                              : {}
                                          }
                                        >
                                          <FormatWidgetToDom
                                            id={`${node.id}@$@${child}`}
                                            node={node}
                                            config={[child, item]}
                                            form={form}
                                            form1={form1}
                                            disabled={false}
                                            selectedOption={selectedOption}
                                            setSelectedOption={setSelectedOption}
                                            widgetChange={widgetChange}
                                            setEditorVisible={setEditorVisible}
                                            setEditorValue={setEditorValue}
                                            setPlatFormVisible={setPlatFormVisible}
                                            setPlatFormValue={setPlatFormValue}
                                            setSelectPathVisible={setSelectPathVisible}
                                            setSelectImageLabelField={setSelectImageLabelField}
                                            setSelectedPath={setSelectedPath}
                                          />
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </Fragment>
                      ) : null}
                    </div>
                  );
                }
                return null;
              })}
          </Form>
        </DndProvider>
      </div>
      <div className="control-footer flex-box">
        <Button onClick={() => setAddConfigVisible(true)}>另存为新配置</Button>
        <Button
          ref={saveRef}
          type="primary"
          onClick={() => {
            if (saveNumRef.current === 1) {
              saveNumRef.current = 0;
              onFinish();
            } else {
              saveNumRef.current = 1;
              setTimeout(() => saveRef.current.click(), 500);
            }
          }}
        >
          保存
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
            setEditorValue?.({});
            setEditorVisible?.(false);
          }}
          onCancel={() => {
            setEditorVisible?.(false);
          }}
        />
      ) : null}
      {platFormVisible ? (
        <PlatFormModal
          visible={platFormVisible}
          data={platFormValue}
          onOk={(val: any) => {
            const { id, ...rest } = val;
            widgetChange(id, rest);
            setPlatFormValue?.({});
            setPlatFormVisible?.(false);
          }}
          onCancel={() => {
            setPlatFormValue?.({});
            setPlatFormVisible?.(false);
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
            setFieldsValue({ [id]: value });
            setSelectedPath?.({});
            setSelectPathVisible?.(false);
          }}
          onCancel={() => {
            setSelectPathVisible?.(false);
            setSelectedPath?.({});
          }}
        />
      ) : null}
      {addConfigVisible ? (
        <Modal
          title={'另存为配置'}
          open={addConfigVisible}
          onOk={() => {
            onAddNewConfig();
          }}
          onCancel={() => {
            setAddConfigVisible(false);
          }}
          getContainer={false}
        >
          <Form form={form} scrollToFirstError>
            <Form.Item
              name="config-name"
              label="新增配置名称"
              rules={[{ required: true, message: '新增配置名称' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      ) : null}
      {!!selectImageLabelField && !!Object.keys(selectImageLabelField) ? (
        <Modal
          title={'设置实时接口'}
          open={!!selectImageLabelField}
          centered
          onOk={() => {
            form1
              ?.validateFields()
              .then((values) => {
                widgetChange?.(selectImageLabelField?.id, values, selectImageLabelField?.parent);
                setSelectImageLabelField?.(null);
                form1?.resetFields();
              })
              .catch((err) => {
                const { errorFields } = err;
                errorFields?.length && message.error(`${errorFields[0]?.errors[0]} 是必填项`);
              });
          }}
          onCancel={() => {
            setSelectImageLabelField?.(null);
            form1?.resetFields();
          }}
          maskClosable={false}
        >
          <Form form={form1} scrollToFirstError>
            <Form.Item
              name={`fetchType`}
              label={'http类型'}
              rules={[{ required: false, message: 'http类型' }]}
            >
              <Select
                style={{ width: '100%' }}
                placeholder="http类型"
                options={['get', 'post', 'put', 'delete']?.map?.((item: any) => ({
                  value: item,
                  label: _.toUpper(item),
                }))}
              />
            </Form.Item>
            <Form.Item
              name={`xName`}
              label={'接口地址'}
              rules={[{ required: false, message: '接口地址' }]}
            >
              <Input placeholder="接口地址" size="large" />
            </Form.Item>
            <Form.Item name="ifFetch" label="是否实时反馈" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Form>
        </Modal>
      ) : null}
      {nodeConnectVisible ? (
        <Modal
          title={'节点属性关联'}
          open={nodeConnectVisible}
          className="node-connect-modal"
          centered
          onOk={() => {
            form2
              .validateFields()
              .then((values) => {
                const { connectNode, value } = values;
                let obj = {};
                const newNodeList = (connectNode || []).reduce((pre: any, cen: any) => {
                  const node = paramData.flowData.nodes?.filter((i: any) => i.id === cen[0])?.[0];
                  obj = Object.assign({}, obj, {
                    [cen.join('@$@')]: value,
                  });
                  return Object.assign({}, pre, {
                    [cen[0]]: {
                      ...node,
                      config: {
                        ...node.config,
                        initParams: {
                          ...node.config.initParams,
                          [cen[1]]: {
                            ...node.config.initParams?.[cen[1]],
                            value,
                          },
                        },
                      },
                    },
                  });
                }, {});
                form.setFieldsValue(obj);
                setNodeList((prev: any) =>
                  (prev || [])?.map?.((node: any) => {
                    const { id } = node;
                    if (newNodeList[id]) {
                      return {
                        ...node,
                        config: {
                          ...node.config,
                          initParams: newNodeList[id].config.initParams,
                        },
                      };
                    }
                    return node;
                  }),
                );
                setNodeConnectVisible(false);
                // setConnectNodeItem({});
                // form2.resetFields();
              })
              .catch((err) => {
                const { errorFields } = err;
                errorFields?.length && message.error(`${errorFields[0]?.errors[0]} 是必填项`);
              });
          }}
          onCancel={() => {
            setNodeConnectVisible(false);
            // setConnectNodeItem({});
            // form2.resetFields();
          }}
          maskClosable={false}
        >
          <Form form={form2} scrollToFirstError>
            <Form.Item
              name={`connectNode`}
              label={'关联节点'}
              style={{ marginBottom: 24 }}
              rules={[{ required: false, message: '关联节点' }]}
            >
              <Cascader
                style={{ width: '100%' }}
                showSearch
                multiple
                options={connectNodeList}
                onChange={(e: any, selectOptions: any) => {
                  if (e?.length) {
                    if (e.length > 1) return;
                    const item = paramData.flowData.nodes?.filter(
                      (i: any) => i.id === e?.[0]?.[0],
                    )?.[0];
                    const widget = !!e?.[0]?.[1]
                      ? item?.config?.initParams?.[e?.[0]?.[1]]
                      : item?.config?.initParams?.[selectOptions[0]?.[0]?.children?.[0]?.value];
                    setConnectNodeList((pre: any) =>
                      (pre || [])?.map?.((i: any) => ({
                        ...i,
                        children: (i.children || [])?.map?.((child: any) => ({
                          ...child,
                          disabled: child?.__type !== widget?.widget?.type,
                        })),
                      })),
                    );
                    setConnectNodeItem({
                      node: item,
                      widget: widget,
                    });
                  } else {
                    setConnectNodeList((pre: any) =>
                      (pre || [])?.map?.((i: any) => ({
                        ...i,
                        children: (i.children || [])?.map?.((child: any) => ({
                          ...child,
                          disabled: false,
                        })),
                      })),
                    );
                    setConnectNodeItem({});
                  }
                }}
              />
            </Form.Item>
            {!!connectNodeItem.node &&
            !['TagRadio', 'File', 'Dir', 'codeEditor', 'ImageLabelField', 'DataMap'].includes(
              connectNodeItem?.widget.type,
            ) ? (
              <FormatWidgetToDom
                label={'关联属性值'}
                id={'value'}
                node={connectNodeItem?.node}
                config={[connectNodeItem?.widget?.name, connectNodeItem?.widget]}
                form={form2}
                disabled={false}
              />
            ) : null}
          </Form>
        </Modal>
      ) : null}
    </div>
  );
};

export default connect(({ home, themeStore }) => ({}))(Control);

export const FormatWidgetToDom: any = (props: any) => {
  const {
    form,
    form1,
    id,
    label = '',
    node,
    config = [],
    parent = undefined,
    disabled,
    display,
    widgetChange,
    selectedOption,
    setSelectedOption,
    setEditorVisible,
    setEditorValue,
    setPlatFormVisible,
    setPlatFormValue,
    setSelectPathVisible,
    setSelectedPath,
    setSelectImageLabelField,
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
    options = options?.map?.((option: string) => ({ label: option, value: option }));
  }
  const name = `${id}`;

  useEffect(() => {
    if (type1 === 'TagRadio') {
      const children = (options || []).filter((i: any) => i.name === value)[0]?.children;
      setSelectedOption?.({ [aliasDefault]: children });
    }
  }, [type1]);

  switch (type1) {
    case 'Input':
      return (
        <FormItem
          name={name}
          label={label}
          style={display ? { display: 'none' } : {}}
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
          style={display ? { display: 'none' } : {}}
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
          style={display ? { display: 'none' } : {}}
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
          style={display ? { display: 'none' } : {}}
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
            style={display ? { display: 'none' } : {}}
            tooltip={description}
            initialValue={(_.isArray(value) ? value[0] : value) || undefined}
            rules={[{ required: require, message: `${alias}` }]}
          >
            <Select
              disabled={disabled}
              onChange={(e: any, option: any) => {
                const { value, propsKey } = option;
                const { children = [] } = JSON.parse(propsKey);
                setSelectedOption?.({ [aliasDefault]: children });
                widgetChange?.(name, value, parent);
              }}
            >
              {(options || [])?.map?.((option: any) => {
                const { id, name } = option;
                return (
                  <Select.Option key={name} value={name} propsKey={JSON.stringify(option)}>
                    {name}
                  </Select.Option>
                );
              })}
            </Select>
          </FormItem>
          {(selectedOption?.[aliasDefault] || [])?.map?.((item: any, index: number) => {
            if (!item || !item.widget) {
              return null;
            }
            return (
              <div style={{ marginTop: 24 }} key={item.id || index}>
                <FormatWidgetToDom
                  key={item.name || guid()}
                  id={node?.id ? `${node.id}@$@${item?.name}@@@${guid()}` : item?.name}
                  config={[item.name, item]}
                  label={item?.alias || item?.name}
                  parent={name}
                  form={form}
                  setEditorVisible={setEditorVisible}
                  disabled={disabled}
                  widgetChange={widgetChange}
                />
              </div>
            );
          })}
        </>
      );
    case 'Select':
      return (
        <FormItem
          name={name}
          label={label}
          style={display ? { display: 'none' } : {}}
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
                <Radio key={id || value} value={value}>
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
          style={display ? { display: 'none' } : {}}
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
          style={display ? { display: 'none' } : {}}
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
        <FormItem
          name={name}
          label={label}
          style={display ? { display: 'none' } : {}}
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
          />
        </FormItem>
      );
    case 'Slider':
      return (
        <FormItem
          name={name}
          label={label}
          style={display ? { display: 'none' } : {}}
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
          style={display ? { display: 'none' } : {}}
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
          style={display ? { display: 'none' } : {}}
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
                  setSelectedPath?.(Object.assign(config[1], { id: name, fileType: 'file' }));
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
          style={display ? { display: 'none' } : {}}
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
        <FormItem
          name={name}
          label={label}
          style={display ? { display: 'none' } : {}}
          tooltip={description}
          className="codeEditor"
        >
          {!!value ? (
            <Input.TextArea
              autoSize={{ maxRows: 5 }}
              value={language === 'json' && _.isObject(value) ? formatJson(value) : value}
              style={{ marginBottom: 8 }}
              disabled
            />
          ) : null}
          <Button
            onClick={() => {
              setEditorValue?.({
                id: name,
                value: language === 'json' && _.isObject(value) ? formatJson(value) : value,
                language: language || 'json',
              });
              setEditorVisible?.(true);
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
            style={display ? { display: 'none' } : {}}
            tooltip={description}
            initialValue={localPath || undefined}
            valuePropName="file"
            rules={[{ required: require, message: `${alias}` }]}
          >
            <TooltipDiv title={localPath}>{localPath}</TooltipDiv>
          </FormItem>
          <div className="flex-box">
            <Button
              onClick={() => {
                const param = { id, config: config[1], parent };
                form1?.setFieldsValue({
                  fetchType: config[1]?.fetchType,
                  xName: config[1]?.xName,
                  ifFetch: config[1]?.ifFetch || false,
                });
                setSelectImageLabelField?.(param);
              }}
              disabled={disabled}
              style={{ marginRight: 8 }}
            >
              设置接口
            </Button>
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
              onClick={() => {
                setPlatFormValue?.({ ...config[1], id: name, nodeName: node?.alias || node?.name });
                setPlatFormVisible?.(true);
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
          style={display ? { display: 'none' } : {}}
          tooltip={description}
          initialValue={
            value ||
            defaultValue || {
              num_0: { alias: 'num_0', value: undefined },
              num_1: { alias: 'num_1', value: undefined },
              num_2: { alias: 'num_2', value: undefined },
              num_3: { alias: 'num_3', value: undefined },
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
            max={max}
            min={min}
            type={type}
          />
        </Form.Item>
      );
    case 'DataMap':
      return (
        <>
          <Form.Item
            name={name}
            label={label}
            style={display ? { display: 'none' } : {}}
            tooltip={description}
          >
            {(options || [])?.map?.((item: any, index: number) => {
              const { id, label, value } = item;
              return (
                <div
                  className="flex-box"
                  key={id || index}
                  style={{ marginBottom: index + 1 !== options.length ? 24 : 0 }}
                >
                  <div style={{ paddingRight: 12, whiteSpace: 'nowrap' }}>原始值 :</div>
                  <Input
                    style={{ width: '50%' }}
                    defaultValue={label}
                    onBlur={(e) => {
                      const { value } = e.target;
                      !!updateTimer?.current && clearTimeout(updateTimer?.current);
                      updateTimer.current = setTimeout(() => {
                        const result = options?.map?.((tag: any) => {
                          if (tag.id === id) {
                            return Object.assign({}, tag, {
                              label: value,
                            });
                          }
                          return tag;
                        });
                        widgetChange?.(name, result, parent);
                      }, 300);
                    }}
                  />
                  <div style={{ padding: '0 12px', whiteSpace: 'nowrap' }}>映射值 :</div>
                  <Input
                    style={{ width: '50%' }}
                    defaultValue={value}
                    onBlur={(e) => {
                      const { value } = e.target;
                      !!updateTimer?.current && clearTimeout(updateTimer?.current);
                      updateTimer.current = setTimeout(() => {
                        const result = options?.map?.((tag: any) => {
                          if (tag.id === id) {
                            return Object.assign({}, tag, {
                              value: value,
                            });
                          }
                          return tag;
                        });
                        widgetChange?.(name, result, parent);
                      }, 300);
                    }}
                  />
                  <MinusCircleOutlined
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                      if (options.length > 1) {
                        !!updateTimer?.current && clearTimeout(updateTimer?.current);
                        updateTimer.current = setTimeout(() => {
                          const result = options.filter((i: any) => i.id !== id);
                          widgetChange?.(name, result, parent);
                        }, 300);
                      }
                    }}
                  />
                </div>
              );
            })}

            <Button
              type="dashed"
              style={{ marginTop: 24 }}
              onClick={() => {
                const result = (options || []).concat({
                  id: guid(),
                  label: '',
                  value: '',
                });
                widgetChange?.(name, result, parent);
              }}
              block
              icon={<PlusOutlined />}
            >
              添加可选项
            </Button>
          </Form.Item>
        </>
      );
    default:
      return null;
  }
};
