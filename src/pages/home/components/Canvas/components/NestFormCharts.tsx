import React, { memo, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { Button, Form, message, Popconfirm } from 'antd';
import styles from '../index.module.less';
import { useModel } from 'umi';
import TooltipDiv from '@/components/TooltipDiv';
import { FormatWidgetToDom } from './Operation2Charts';
import SegmentSwitch from '@/components/SegmentSwitch';
import { updateParams } from '@/services/api';
import moment from 'moment';

interface Props {
  data: any;
  id: any;
  setMyChartVisible?: any;
  onClick?: any;
}

const NestFormCharts: React.FC<Props> = (props: any) => {
  const [form] = Form.useForm();
  const { validateFields, resetFields, setFieldsValue } = form;
  const { initialState, setInitialState } = useModel<any>('@@initialState');
  const { params } = initialState;
  const { flowData } = params;
  const { nodes } = flowData;

  let { data = {}, id } = props;
  let { dataValue = [], fontSize = 20, des_column, des_bordered, yName } = data;

  const [configList, setConfigList] = useState<any>([]);
  const [locked, setLocked] = useState(true);

  const measurementLineNum = useMemo(() => {
    const node = nodes.filter((i: any) => i.id === id.split('$$')[0])?.[0] || {};
    const { config = {} } = node;
    let { initParams = {} } = config;
    const nestMapItem: any = Object.entries(initParams)?.filter(
      (i: any) => i[1]?.widget?.type === 'NestMap',
    )?.[0];
    const options = Object.entries(nestMapItem?.[1]?.widget?.options || {})?.map((item: any) => {
      return item[1];
    });

    let num = 1;
    (Object.entries(options) || []).forEach?.((item: any) => {
      if (item[1] && item[1]?.widget?.type === 'Measurement') {
        const length = Object?.keys?.(item[1]?.value || {})?.length || 1;
        if (length > num) {
          num = length;
        }
      }
    });
    return num;
  }, [nodes]);
  // 初始化
  const init = (data?: any) => {
    const node = nodes.filter((i: any) => i.id === id.split('$$')[0])?.[0] || {};
    const { config = {} } = node;
    let { initParams = {} } = config;
    const nestMapItem: any = Object.entries(initParams)?.filter(
      (i: any) => i[1]?.widget?.type === 'NestMap',
    )?.[0];
    const options = Object.entries(nestMapItem?.[1]?.widget?.options || {})?.map((item: any) => {
      const initValue = nestMapItem?.[1]?.value || {};
      return {
        ...item[1],
        ...(!_.isUndefined(initValue?.[item[0]]?.value)
          ? { value: initValue?.[item[0]]?.value }
          : {}),
      };
    });
    setConfigList(options);
  };
  // 进来初始化
  useEffect(() => {
    resetFields();
    init();
  }, []);
  // 参数修改
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
          let result = {};
          (Object.entries(values) || []).forEach?.((res: any, index: number) => {
            const name = res[0]?.split('$$')?.[0];
            const value: any =
              !_.isUndefined(res[1]) && !_.isNull(res[1])
                ? res[1]
                : pre?.filter((i: any) => i.name === name)?.[0]?.value;
            result[name] = {
              // @ts-ignore
              value: value instanceof moment ? new Date(value).getTime() : value,
              enabled: _.isBoolean(pre?.filter((i: any) => i.name === name)?.[0]?.enabled)
                ? pre?.filter((i: any) => i.name === name)?.[0]?.enabled
                : true,
            };
          });
          const { flowData } = params;
          let { nodes } = flowData;
          nodes = nodes?.map?.((node: any) => {
            const { config = {} } = node;
            if (node.id === id.split('$$')[0]) {
              let { initParams = {}, execParams } = config;
              const nestMapItem: any = Object.entries(initParams)?.filter(
                (i: any) => i[1]?.widget?.type === 'NestMap',
              )?.[0];
              return {
                ...node,
                config: {
                  ...node?.config,
                  initParams: {
                    ...node?.config?.initParams,
                    [nestMapItem[0]]: {
                      ...nestMapItem[1],
                      value: result,
                      widget: {
                        ...nestMapItem[1]?.widget,
                        options: (Object.entries(nestMapItem[1]?.widget?.options) || [])?.reduce(
                          (pre: any, cen: any) => {
                            return {
                              ...pre,
                              [cen[0]]: {
                                ...cen[1],
                                enabled: result[cen[0]]?.enabled,
                              },
                            };
                          },
                          {},
                        ),
                      },
                    },
                  },
                },
              };
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
          console.log(resultParams);
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

  return (
    <div id={`echart-${id}`} className={`${styles.operationCharts} flex-box`} style={{ fontSize }}>
      <div className={`operation-body`}>
        <Form form={form} scrollToFirstError>
          {configList?.map?.((item: any, index: number) => {
            const { name, alias, widget = {}, addType, show, enabled } = item;
            return (
              <div
                className={`${['codeEditor', 'ImageLabelField'].includes(widget?.type)
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
                )}
              >
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
                <div
                  className={`${['codeEditor', 'ImageLabelField'].includes(widget?.type)
                    ? 'flex-box-start'
                    : 'flex-box'
                    } value-box`}
                >
                  <div style={{ flex: 1 }}>
                    <FormatWidgetToDom
                      key={item?.name}
                      id={item?.name}
                      fontSize={fontSize}
                      // label={item?.alias || item?.name}
                      config={[item?.name, item]}
                      widgetChange={widgetChange}
                      form={form}
                      disabled={locked}
                      // setEditorVisible={setEditorVisible}
                      // setEditorValue={setEditorValue}
                      // setPlatFormVisible={setPlatFormVisible}
                      // setPlatFormValue={setPlatFormValue}
                      // setSelectPathVisible={setSelectPathVisible}
                      // setSelectedPath={setSelectedPath}
                      measurementLineNum={measurementLineNum}
                    />
                  </div>
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
                      disabled={locked}
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
                </div>
              </div>
            );
          })}
        </Form>
      </div>
      <div className="operation-footer flex-box-center">
        <Button
          type="primary"
          onClick={() => {
            setLocked((prev) => !prev);
          }}
        >
          {locked ? '解锁' : '锁定'}
        </Button>
        <Popconfirm
          disabled={locked}
          title="确认修改吗?"
          onConfirm={() => {
            onOk();
          }}
          okText="确认"
          cancelText="取消"
        >
          <Button type="primary" disabled={locked}>
            修改
          </Button>
        </Popconfirm>

        <Button disabled={locked} onClick={() => onCancel()}>
          重置
        </Button>
      </div>
    </div>
  );
};

export default memo(NestFormCharts);
