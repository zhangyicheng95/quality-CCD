import React, { useEffect, useMemo, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { connect, useModel } from 'umi';
import { Button, Form, Input, message, Modal } from 'antd';
import { FormatWidgetToDom } from '@/pages/home/components/Canvas/components/Operation2Charts';
import MonacoEditor from '@/components/MonacoEditor';
import PlatFormModal from '@/components/platForm';
import FileManager from '@/components/FileManager';
import TooltipDiv from '@/components/TooltipDiv';
import { updateParams } from '@/services/api';
import SegmentSwitch from '@/components/SegmentSwitch';

interface Props {
  data: any;
  id: any;
  setMyChartVisible?: any;
  onClick?: any;
}

const OperationCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id, started } = props;
  let {
    operationList,
    dataValue,
    fontSize,
    showLabel,
    ifPopconfirm,
    des_column,
    des_bordered,
    yName = 150,
    valueOnTop = false,
    passwordHelp = false,
    password
  } = data;
  if (!_.isBoolean(showLabel)) {
    showLabel = true;
  }
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
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
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    if (!_.isArray(operationList)) {
      console.log('OperationCharts:', dataValue);
      return;
    }
    const { flowData } = params;
    const { nodes } = flowData;
    const node = nodes.filter((i: any) => i.id === id.split('$$')[0])?.[0];
    if (!!node) {
      const { config = {} } = node;
      const { initParams = {} } = config;
      let resConfig: any = [];
      operationList?.forEach((item: any) => {
        if (initParams[item]) {
          resConfig = resConfig.concat(
            Object.assign({ enabled: true }, _.omit(initParams[item], 'show')),
          );
        }
      });
      setConfigList(resConfig);
    }
  }, [operationList, params]);
  const measurementLineNum = useMemo(() => {
    const { flowData } = params;
    const { nodes } = flowData;
    const node = nodes.filter((i: any) => i.id === id.split('$$')[0])?.[0];
    const { config = {} } = node;
    let { initParams = {} } = config;
    let num = 1;
    (operationList || []).forEach((item: any) => {
      if (initParams?.[item] && initParams?.[item]?.widget?.type === 'Measurement') {
        const length = Object?.keys?.(initParams?.[item]?.value)?.length || 1;
        if (length > num) {
          num = length;
        }
      }
    });
    return num;
  }, [operationList]);
  const widgetChange = (key: any, value: any) => {
    validateFields()
      .then((values) => {
        setConfigList((prev: any) => {
          const result = (prev || [])?.map?.((item: any, index: number) => {
            if (item.name === key) {
              return Object.assign(
                {},
                item,
                { value },
                _.isObject(value) && !_.isArray(value) && item?.widget?.type !== 'Measurement'
                  ? value
                  : { value },
                item?.widget?.type === 'codeEditor'
                  ? {
                    value:
                      value?.language === 'json'
                        ? _.isString(value?.value)
                          ? JSON.parse(value?.value)
                          : value?.value
                        : value?.value,
                  }
                  : {},
              );
            }
            return item;
          });
          const { flowData } = params;
          let { nodes } = flowData;
          nodes = nodes?.map?.((node: any) => {
            const { config = {} } = node;
            if (node.id === id.split('$$')[0]) {
              const { initParams = {} } = config;
              let obj = Object.assign({}, initParams);
              result.forEach((item: any, index: number) => {
                obj[item?.id || item?.name] = item;
              });
              return Object.assign({}, node, {
                config: Object.assign({}, config, {
                  initParams: obj,
                }),
              });
            }
            return node;
          });
          const requestParams = {
            id: params.id,
            data: Object.assign({}, params, {
              flowData: Object.assign({}, flowData, {
                nodes,
              }),
            }),
          };
          // console.log(requestParams);
          setInitialState((preInitialState: any) => ({
            ...preInitialState,
            params: requestParams.data,
          }));
          if (!ifPopconfirm) {
            updateParams(requestParams).then((res: any) => {
              if (res && res.code === 'SUCCESS') {
                message.success('修改成功');
              } else {
                message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
              }
            });
          }
          return result;
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onOk = () => {
    validateFields()
      .then((values) => {
        const { flowData } = params;
        let { nodes } = flowData;
        nodes = nodes?.map?.((node: any) => {
          const { config = {} } = node;
          if (node.id === id.split('$$')[0]) {
            const { initParams = {} } = config;
            let obj = Object.assign({}, initParams);
            configList.forEach((item: any, index: number) => {
              if (!!item.enabled) {
                obj[item?.id || item?.name] = item;
              }
            });
            return Object.assign({}, node, {
              config: Object.assign({}, config, {
                initParams: obj,
              }),
            });
          }
          return node;
        });
        const requestParams = {
          id: params.id,
          data: Object.assign({}, params, {
            flowData: Object.assign({}, flowData, {
              nodes,
            }),
          }),
        };
        console.log(requestParams);
        updateParams(requestParams).then((res: any) => {
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
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onCancel = () => {
    resetFields();
  };

  return (
    <div id={`echart-${id}`} className={`${styles.operationCharts} flex-box`} style={{ fontSize }}>
      <div className="operation-body">
        <Form form={form} scrollToFirstError>
          {useMemo(() => {
            return configList?.map?.((item: any, index: number) => {
              const { name, alias, widget = {}, enabled } = item;
              const { type } = widget;
              return (
                <div
                  className={`flex-box-start param-item ${des_bordered ? 'item-border' : ''}`}
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
                      : { marginBottom: index + des_column >= configList.length ? 0 : 16 },
                  )}
                >
                  {showLabel ? (
                    <div className="title-box" style={{ width: yName, maxWidth: yName }}>
                      <TooltipDiv
                        style={{ fontSize: fontSize + 2 }}
                        className="first"
                        title={alias || name}
                      >
                        {alias || name}
                      </TooltipDiv>
                      <TooltipDiv className="second" style={{ fontSize }}>
                        {name}
                      </TooltipDiv>
                    </div>
                  ) : null}
                  <div className="flex-box-start value-box">
                    <div style={{ flex: 1 }}>
                      <FormatWidgetToDom
                        key={item?.name}
                        id={item?.name}
                        fontSize={fontSize}
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
                        measurementLineNum={measurementLineNum}
                      />
                    </div>
                    {valueOnTop ? (
                      <div style={{ height: fontSize * 2, width: 60, minWidth: 60, marginLeft: 8 }}>
                        <SegmentSwitch
                          style={{ fontSize: 12 }}
                          defaultValue={enabled}
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
            });
          }, [
            configList,
            operationList,
            started,
            showLabel,
            des_bordered,
            yName,
            measurementLineNum,
          ])}
        </Form>
      </div>
      {!!ifPopconfirm ? (
        <div className="operation-footer flex-box-center">
          <Button type="primary" disabled={!!started} onClick={() => {
            if (passwordHelp) {
              setPasswordVisible(true);
            } else {
              onOk();
            }
          }}>
            确认
          </Button>
          {/* <Button disabled={!!started} onClick={() => onCancel()}>
            重置
          </Button> */}
        </div>
      ) : null}

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
      {
        !!passwordVisible ?
          <Modal
            title={'密码校验'}
            open={!!passwordVisible}
            onOk={() => {
              form1.validateFields().then((values) => {
                const { pass } = values;
                if (pass == password) {
                  form1.resetFields();
                  setPasswordVisible(false);
                  onOk();
                } else {
                  message.error('密码错误');
                }
              });
            }}
            onCancel={() => {
              form1.resetFields();
              setPasswordVisible(false);
            }}
            maskClosable={false}
          >
            <Form form={form1} scrollToFirstError>
              <Form.Item
                name={'pass'}
                label={'密码校验'}
                rules={[{ required: true, message: '密码' }]}
              >
                <Input />
              </Form.Item>
            </Form>
          </Modal>
          : null
      }
    </div>
  );
};

export default connect(({ home, themeStore }) => ({
  started: home.started || false,
}))(OperationCharts);
