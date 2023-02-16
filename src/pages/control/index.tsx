import React, { Fragment, useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import { Button, message, Form, Input, Radio, Select, Checkbox, InputNumber, Switch, } from "antd";
import * as _ from "lodash";
import { updateParams } from "@/services/api";
import { AppstoreOutlined, CaretDownOutlined, CaretRightOutlined, UnorderedListOutlined } from "@ant-design/icons";
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
import ROIMark from "@/components/ROIMark";

const FormItem = Form.Item;
const Control: React.FC<any> = (props: any) => {
  const { initialState, setInitialState } = useModel<any>('@@initialState');
  const { params: paramsData } = initialState;
  const [form] = Form.useForm();
  const { validateFields, } = form;
  const [paramData, setParamData] = useState<any>({});
  const [nodeList, setNodeList] = useState<any>([]);
  const [selectedOption, setSelectedOption] = useState<any>([]);
  const [editorVisible, setEditorVisible] = useState(false);
  const [editorValue, setEditorValue] = useState<any>({});
  const [platFormVisible, setPlatFormVisible] = useState(false);
  const [platFormValue, setPlatFormValue] = useState<any>({});
  const [selectPathVisible, setSelectPathVisible] = useState(false);
  const [selectedPath, setSelectedPath] = useState<any>({});
  const [listTyoe, setListType] = useState('line');

  useEffect(() => {
    if (!_.isEmpty(paramsData)) {
      const { flowData, contentData } = paramsData;
      const { nodes } = flowData;
      const { listTyoe } = contentData;
      setListType(listTyoe || 'line');
      setParamData(paramsData);
      setNodeList(nodes.map((item: any, index: number) => {
        if (_.isUndefined(item.sortId)) {
          return { ...item, sortId: index };
        }
        return item;
      }));
    }
  }, [paramsData]);
  // 参数值改变
  const widgetChange = (key: any, value: any) => {
    key = key.split('@$@');
    setNodeList((prev: any) => {
      return prev.map((item: any, index: any) => {
        if (item.id === key[0]) {
          return Object.assign({}, item, {
            config: Object.assign({}, item.config, {
              initParams: Object.assign({}, item.config.initParams, {
                [key[1]]: Object.assign({}, item.config.initParams[key[1]], _.isObject(value) ? value : {
                  value
                })
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
    setNodeList((prev: any) => {
      const list = _.cloneDeep(prev);
      list[dragIndex] = { ...target, sortId: dragIndex };
      list[hoverIndex] = { ...source, sortId: hoverIndex };
      return list;
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
            contentData: Object.assign({}, paramData.contentData, {
              listTyoe
            }),
          })
        };
        updateParams(params).then((res: any) => {
          if (res && res.code === 'SUCCESS') {
            message.success('修改成功')
          } else {
            message.error(res?.msg || res?.message || '接口异常');
          }
        })
      })
      .catch((err) => {
        const { errorFields } = err;
        errorFields?.length && message.error(`${errorFields[0]?.errors[0]} 是必填项`);
      });
  };

  return (
    <div className={`${styles.control} flex-box page-size background-ubv`}>
      <PrimaryTitle title={"参数控制"} >
        <div className="flex-box title-btn-box">
          <UnorderedListOutlined
            className={listTyoe === 'line' ? 'selected' : ''}
            onClick={() => setListType('line')}
          />
          <AppstoreOutlined
            className={listTyoe === 'block' ? 'selected' : ''}
            onClick={() => setListType('block')}
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
              name="path-value"
              label="配置文件"
              initialValue={"default" || undefined}
              rules={[{ required: false, message: "历史记录服务端地址" }]}
            >
              <Select
                style={{ width: '100%' }}
                size="large"
                options={[
                  { label: '默认配置', value: 'default' }
                ]}
                placeholder="方案ID"
              />
            </Form.Item>
            {
              (nodeList || []).sort((a: any, b: any) => a.sortId - b.sortId).map((node: any, index: any) => {
                const { id, alias, name, config = {}, hidden, sortId } = node;
                const { initParams = {} } = config;
                if (!!initParams && !_.isEmpty(initParams)) {
                  if (Object.entries(initParams).filter((i: any) => !i[1].onHidden).length === 0) return null;
                  const TagRadioList = Object.entries(initParams).reduce((pre: any, cen: any) => {
                    const { widget } = cen[1];
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
                  return <div key={id} className={`control-item ${listTyoe === 'block' ? 'block' : ''}`}>
                    <DropSortableItem
                      name={name}
                      index={sortId}
                      moveCard={sortCommonFun}
                    >
                      <div>
                        <DragSortableItem
                          name={name}
                          index={sortId}
                        >
                          <div>
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
                            {
                              !hidden && (Object.entries(initParams) || []).map((item: any) => {
                                const { alias, name, widget, onHidden } = item[1];
                                const { type } = widget;
                                if (onHidden || TagRadioList.includes(item[0])) return null;
                                return <div className="flex-box param-item" key={`${id}@$@${item[0]}`}>
                                  <div className="icon-box flex-box">
                                    {_.toUpper(type.slice(0, 1))}
                                    {/* <BlockOutlined className="item-icon" /> */}
                                  </div>
                                  <div className="title-box">
                                    <div>{alias}</div>
                                    <span>{name}</span>
                                  </div>
                                  <div className="value-box">
                                    <FormatWidgetToDom
                                      id={`${id}@$@${item[0]}`}
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
                          </div>
                        </DragSortableItem>
                      </div>
                    </DropSortableItem>
                  </div>
                }
                return null;
              })
            }
          </Form>
        </DndProvider>
      </div>
      <div className="control-footer flex-box">
        <Button type="primary" onClick={() => onFinish()}>确认</Button>
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
              console.log(val);
              widgetChange(id, { ...rest, localPath: value });
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
    </div >
  );
};

export default connect(({ home, themeStore }) => ({

}))(Control);

const FormatWidgetToDom = (props: any) => {
  const {
    id, config = [], disabled, widgetChange,
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
    localPath,
    description,
    widget = {},
    default: defaultValue,
  } = config[1];

  let { max, min, options, precision, step, suffix, type: type1 } = widget;
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
          name={name}
          tooltip={description}
          initialValue={value || undefined}
          rules={[{ required: require, message: `${alias}` }]}
        >
          <Input
            placeholder={`请输入${alias}`}
            disabled={disabled}
            onBlur={(e) => {
              widgetChange(name, e.target.value);
            }}
          />
        </FormItem>
      );
    case 'IpInput':
      return (
        <Form.Item
          name={name}
          tooltip={description}
          initialValue={value || undefined}
          rules={[{ required: require, message: `${alias}` }]}
        >
          <IpInput
            disabled={disabled}
            onChange={(val: string) => {
              widgetChange(name, val);
            }}
          />
        </Form.Item>
      );
    case 'Radio':
      return (
        <FormItem
          name={name}
          tooltip={description}
          initialValue={(_.isArray(value) ? value[0] : value) || undefined}
          rules={[{ required: require, message: `${alias}` }]}
        >
          <Radio.Group onChange={(e) => {
            widgetChange(name, e.target.value);
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
            name={name}
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
                widgetChange(name, value);
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
          name={name}
          tooltip={description}
          initialValue={(_.isArray(value) ? value[0] : value) || false}
          rules={[{ required: require, message: `${alias}` }]}
        >
          <Select
            placeholder={`${alias}`}
            disabled={disabled}
            onChange={(e: any) => {
              widgetChange(name, e)
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
          tooltip={description}
          initialValue={value || undefined}
          rules={[{ required: require, message: `${alias}` }]}
        >
          <Select
            placeholder={`请选择${alias}`}
            mode="multiple"
            disabled={disabled}
            onChange={(e) => {
              widgetChange(name, e)
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
          tooltip={description}
          initialValue={value || undefined}
          rules={[{ required: require, message: `${alias}` }]}
        >
          <Checkbox.Group
            options={options}
            disabled={disabled}
            onChange={(e) => {
              widgetChange(name, e)
            }}
          />
        </FormItem>
      );
    case 'InputNumber':
      return (
        <Fragment>
          <FormItem
            name={name}
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
                widgetChange(name, Number(value < max ? value : max));
              }}
            />
          </FormItem>
        </Fragment>
      );
    case 'Slider':
      return (
        <FormItem
          name={name}
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
                widgetChange(name, Number(e))
              }, 300)
            }}
          />
        </FormItem>
      );
    case 'Switch':
      return (
        <FormItem
          name={name}
          tooltip={description}
          initialValue={value || false}
          valuePropName="checked"
          rules={[{ required: require, message: `${alias}` }]}
        >
          <Switch
            disabled={disabled}
            onChange={(e) => {
              widgetChange(name, e)
            }}
          />
        </FormItem>
      );
    case 'File':
      return (
        <FormItem
          shouldUpdate
          name={name}
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
                setSelectedPath(Object.assign({ id: name, fileType: 'file' }, config[1]));
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
                setSelectedPath(Object.assign({ id: name, fileType: 'dir' }, config[1]));
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
        <FormItem name={name} tooltip={description}>
          <Button
            onClick={() => {
              setEditorValue({
                id: name,
                value: config[1].value,
                language: config[1].language,
              });
              setEditorVisible(true);
            }}
            disabled={disabled}
          >
            打开编辑器
          </Button>
        </FormItem>
      );
    case 'platForm':
      return (
        <>
          <FormItem
            shouldUpdate
            name={name}
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
                setSelectedPath(Object.assign({ id: name, fileType: 'file' }, { ..._.omit(config[1], 'value'), value: config[1].localPath }));
                setSelectPathVisible(true);
              }}
              disabled={disabled}
              style={{ marginRight: 8 }}
            >
              选择标注文件
            </Button>
            <Button
              type='primary'
              onClick={() => {
                setPlatFormValue(Object.assign({ id: name }, config[1]));
                setPlatFormVisible(true);
              }}
              disabled={disabled}
            >
              开始标注
            </Button>
          </div>
        </>
      );
    case 'ROIMark':
      return (
        <Form.Item
          name={name}
          tooltip={description}
          initialValue={value || undefined}
          rules={[{ required: require, message: `${alias}` }]}
        >
          <ROIMark
            disabled={disabled}
            onChange={(val: any) => {
              widgetChange(name, val);
            }}
          />
        </Form.Item>
      );
    default:
      return null;
  }
};

// 拖放节点的外层
const ParentDiv = (props: any) => {
  const { typeId, children, typeName, index, sortGroupFun, setStartDrag } = props;
  // @ts-ignore
  return <DropSortableItem
    key={index}
    index={index}
    name={typeName}
    moveCard={(dragIndex: any, hoverIndex: any) => {
      sortGroupFun(dragIndex, hoverIndex, 'allGroupSort')
    }}
    setStartDrag={setStartDrag}
  >
    <div>
      {/* <DragSortableItem
        key={index}
        index={index}
        name={typeName}
      > */}
      {children}
      {/* </DragSortableItem> */}
    </div>
  </DropSortableItem>

};
