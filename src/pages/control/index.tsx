import React, { Fragment, useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import { Button, message, Form, Input, Radio, Select, Checkbox, InputNumber, Switch, Upload, } from "antd";
import * as _ from "lodash";
import { getParams, updateParams } from "@/services/api";
import { CaretDownOutlined, CaretRightOutlined } from "@ant-design/icons";
import PrimaryTitle from "@/components/PrimaryTitle";
import IpInput from "@/components/IpInputGroup";
import SliderGroup from "@/components/SliderGroup";
import TooltipDiv from "@/components/TooltipDiv";
import MonacoEditor from "@/components/MonacoEditor";
import PlatFormModal from "@/components/platForm";
import FileManager from "@/components/FileManager";

const FormItem = Form.Item;
const Control: React.FC<any> = (props: any) => {
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

  useEffect(() => {
    if (!localStorage.getItem("ipUrl-history") || !localStorage.getItem("ipString")) return;
    getParams(localStorage.getItem("ipString") || '').then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        const { data = {} } = res;
        const { flowData } = data;
        const { nodes } = flowData;
        setParamData(data);
        setNodeList(nodes);
      } else {
        message.error(res?.msg || '接口异常');
      }
    });
  }, []);
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
  const onFinish = () => {
    validateFields()
      .then((values) => {
        updateParams({
          id: paramData.id,
          data: Object.assign({}, paramData, {
            flowData: Object.assign({}, paramData.flowData, {
              nodes: nodeList
            })
          })
        }).then((res: any) => {
          if (res && res.code === 'SUCCESS') {
            message.success('修改成功')
          } else {
            message.error(res?.msg || '接口异常');
          }
        })
      })
      .catch((err) => {
        const { errorFields } = err;
        errorFields?.length && message.error(`${errorFields[0]?.errors[0]} 是必填项`);
      });
  };
  return (
    <div className={`${styles.control} flex-box page-size`}>
      <PrimaryTitle title={"参数控制"} />
      <div className="control-body">
        <Form
          form={form}
          scrollToFirstError
        >
          {
            (nodeList || []).map((node: any, index: any) => {
              const { id, alias, name, config = {}, hidden } = node;
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
                return <div key={id} className="control-item">
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
              }
              return null;
            })
          }
        </Form>
      </div>
      <div className="control-footer flex-box">
        <Button type="primary" onClick={() => onFinish()}>确认</Button>
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
              const { id, ...rest } = val;
              console.log(val);
              widgetChange(id, rest);
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

export default Control;

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
                widgetChange(name, value < max ? value : max);
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
                widgetChange(name, e)
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
            initialValue={value || undefined}
            valuePropName="file"
            rules={[{ required: require, message: `${alias}` }]}
          >
            <TooltipDiv title={value}>
              {value}
            </TooltipDiv>
          </FormItem>
          <div className='flex-box'>
            <Button
              onClick={() => {
                setSelectedPath(Object.assign({ id: name, fileType: 'file' }, config[1]));
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
    default:
      return null;
  }
};
