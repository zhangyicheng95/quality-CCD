import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { Button, Form, Input, InputNumber, message, Switch } from 'antd';
import { btnFetch } from '@/services/api';
import { connect } from 'umi';
import SegmentSwitch from '@/components/SegmentSwitch';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const RangeDomainCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id, updateTabs } = props;
  let {
    dataValue,
    fontSize = 14,
    des_column = 1,
    hiddenAxis,
    labelInxAxis,
    fetchType,
    xName,
    ifFetch,
    barRadius,
    timeSelectDefault,
    parentBodyBoxTab,
    formCustom,
  } = data;
  const [dataSource, setDataSource] = useState<any>([
    {
      alias: '灰尘',
      name: 'point_defect',
      data: [
        { key: 'length', value: '1.00', type: 'float' },
        { key: 'width', value: '5.00', type: 'float' },
        { key: 'edge_switch', value: false, type: 'bool' },
        { key: 'global_switch', value: false, type: 'bool' },
      ],
    },
    {
      alias: '划痕',
      name: 'scratch',
      data: [
        { key: 'length', value: '1.00', type: 'float' },
        { key: 'width', value: '5.00', type: 'float' },
        { key: 'edge_switch', value: false, type: 'bool' },
        { key: 'global_switch', value: false, type: 'bool' },
      ],
    },
    {
      alias: '手印',
      name: 'handprint',
      data: [
        { key: 'length', value: '1.00', type: 'float' },
        { key: 'width', value: '5.00', type: 'float' },
        { key: 'edge_switch', value: false, type: 'bool' },
        { key: 'global_switch', value: false, type: 'bool' },
      ],
    },
    {
      alias: '崩边',
      name: 'broken_edge',
      data: [
        { key: 'length', value: '1.00', type: 'float' },
        { key: 'width', value: '5.00', type: 'float' },
        { key: 'edge_switch', value: false, type: 'bool' },
        { key: 'global_switch', value: false, type: 'bool' },
      ],
    },
    {
      alias: '气泡',
      name: 'bubble',
      data: [
        { key: 'length', value: '1.00', type: 'float' },
        { key: 'width', value: '5.00', type: 'float' },
        { key: 'edge_switch', value: false, type: 'bool' },
        { key: 'global_switch', value: false, type: 'bool' },
      ],
    },
    {
      alias: '脏污',
      name: 'dirty',
      data: [
        { key: 'length', value: '1.00', type: 'float' },
        { key: 'width', value: '5.00', type: 'float' },
        { key: 'edge_switch', value: false, type: 'bool' },
        { key: 'global_switch', value: false, type: 'bool' },
      ],
    },
    {
      alias: '叠片',
      name: 'fold_flat',
      data: [
        { key: 'length', value: '1.00', type: 'float' },
        { key: 'width', value: '5.00', type: 'float' },
        { key: 'edge_switch', value: false, type: 'bool' },
        { key: 'global_switch', value: false, type: 'bool' },
      ],
    },
    {
      alias: '裂纹',
      name: 'flaw',
      data: [
        { key: 'length', value: '1.00', type: 'float' },
        { key: 'width', value: '5.00', type: 'float' },
        { key: 'edge_switch', value: false, type: 'bool' },
        { key: 'global_switch', value: false, type: 'bool' },
      ],
    },
    {
      alias: '毛条',
      name: 'woolen',
      data: [
        { key: 'length', value: '1.00', type: 'float' },
        { key: 'width', value: '5.00', type: 'float' },
        { key: 'edge_switch', value: false, type: 'bool' },
        { key: 'global_switch', value: false, type: 'bool' },
      ],
    },
    {
      alias: '点缺陷',
      name: 'point_defect_real',
      data: [
        { key: 'length', value: '1.00', type: 'float' },
        { key: 'width', value: '5.00', type: 'float' },
        { key: 'edge_switch', value: false, type: 'bool' },
        { key: 'global_switch', value: false, type: 'bool' },
      ],
    },
    {
      alias: '疑似划伤',
      name: 'suspected_ws',
      data: [
        { key: 'length', value: '1.00', type: 'float' },
        { key: 'width', value: '5.00', type: 'float' },
        { key: 'edge_switch', value: false, type: 'bool' },
        { key: 'global_switch', value: false, type: 'bool' },
      ],
    },
  ]);
  const inputDom = useRef<any>(null);

  const init = () => {
    if (!!xName) {
      btnFetch('get', xName).then((res: any) => {
        if (!!res && res.code === 'SUCCESS') {
          setDataSource(res?.data || []);
          const valData = (res.data || [])?.reduce((pre: any, cen: any) => {
            const { name, data } = cen;
            let list = {};
            data.forEach((item: any) => {
              const { key, value } = item;
              const listName =
                key == name
                  ? `${parentBodyBoxTab}$$${key}`
                  : `${parentBodyBoxTab}$$${key}$$${name}`;
              list[listName] = value;
            });
            return {
              ...pre,
              ...list,
            };
          }, {});
          formCustom.setFieldsValue({
            ...valData,
          });
        } else {
          message.error(res?.message || '后台服务异常，请重启服务');
        }
      });
    }
  };
  useEffect(() => {
    init();
  }, []);
  useEffect(() => {
    if (!!updateTabs?.length && updateTabs.includes(id)) {
      init();
    }
  }, [updateTabs]);

  const titleLength = useMemo(() => {
    let length = 0;
    dataSource?.forEach((item: any) => {
      if (item?.alias?.length > length) {
        length = item?.alias?.length;
      }
    });
    return length;
  }, [dataSource]);

  const onValueChange = (name: any, key: any, value: any) => {
    if (ifFetch) {
      if (!fetchType || !xName || !key) return;
      formCustom?.validateFields?.()?.then((values: any) => {
        const range = Object.entries(values)?.reduce((pre: any, cen: any) => {
          const title = cen[0]?.split('$$');
          if (title[0] === parentBodyBoxTab) {
            return {
              ...pre,
              [title?.[2]]: {
                ...(pre?.[title?.[2]] || {}),
                [title?.[1]]: cen[1],
              },
            };
          }
          return pre;
        }, {});
        const rangeKeys = Object.keys(range);

        const params = dataSource?.map((dataItem: any) => {
          return {
            ...dataItem,
            data: dataItem.data?.map((cDataItem: any) => {
              if (dataItem.name === name) {
                if (cDataItem.key === key) {
                  return {
                    ...cDataItem,
                    value: value,
                  };
                }
              }
              if (
                rangeKeys.includes(dataItem.name) &&
                !_.isUndefined(range?.[dataItem.name]?.[cDataItem.key])
              ) {
                return {
                  ...cDataItem,
                  value: range?.[dataItem.name]?.[cDataItem.key],
                };
              }
              return cDataItem;
            }),
          };
        });
        btnFetch(fetchType, xName, params).then((res: any) => {
          if (res && res.code === 'SUCCESS') {
            message.success('success');
            setDataSource(res?.data);
            const valData = (res.data || [])?.reduce((pre: any, cen: any) => {
              const { name, data } = cen;
              let list = {};
              data.forEach((item: any) => {
                const { key, value } = item;
                const listName =
                  key == name
                    ? `${parentBodyBoxTab}$$${key}`
                    : `${parentBodyBoxTab}$$${key}$$${name}`;
                list[listName] = value;
              });
              return {
                ...pre,
                ...list,
              };
            }, {});
            formCustom.setFieldsValue({
              // ...formCustom.getFieldValue(),
              ...valData,
            });
          } else {
            message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
          }
        });
      });
    }
  };

  return (
    <div id={`echart-${id}`} className={`${styles.rangeDomainCharts}`} style={{ fontSize }}>
      <Form form={formCustom} scrollToFirstError className="range-domain flex-box-justify-between">
        <div className="range-domain-box">
          {(dataSource || [])?.map((item: any, index: number) => {
            const { name, alias, data } = item;
            return (
              <div
                className="flex-box-end range-domain-box-item"
                style={Object.assign(
                  {},
                  des_column > 1
                    ? {
                        width: `calc(${100 / des_column}% - 8px)`,
                        marginRight: dataSource?.length % des_column === des_column - 1 ? 0 : 8,
                      }
                    : {},
                  dataSource?.length % des_column === 1
                    ? { marginBottom: index + 1 === dataSource.length ? 0 : 8 }
                    : { marginBottom: index + des_column >= dataSource.length ? 0 : 8 },
                )}
                key={`range-domain-box-item-${index}`}
              >
                {labelInxAxis ? (
                  <div
                    className="flex-box-justify-end range-domain-box-item-title"
                    style={{
                      width: titleLength * fontSize,
                      minWidth: titleLength * fontSize,
                    }}
                  >
                    {alias}
                  </div>
                ) : null}
                {(data || [])?.map((cItem: any, cIndex: number) => {
                  const { key, value, type } = cItem;
                  return (
                    <div
                      className="flex-box-column range-domain-box-item-td"
                      key={`range-domain-box-item-td-${cIndex}`}
                      style={Object.assign({}, type !== 'bool' ? { width: '100%' } : {}, {
                        height: hiddenAxis && index < des_column ? fontSize + 8 + 38 : fontSize + 8,
                      })}
                    >
                      {hiddenAxis ? (
                        <div
                          className="flex-box-center range-domain-box-item-td-th"
                          style={index < des_column ? {} : { height: 0 }}
                        >
                          {timeSelectDefault[cIndex]?.label}
                        </div>
                      ) : null}
                      {type === 'bool' ? (
                        <Form.Item
                          name={`${parentBodyBoxTab}$$${key}$$${name}`}
                          label={''}
                          style={{ marginBottom: 0, height: fontSize + 8, width: 60 }}
                          initialValue={value}
                          rules={[{ required: false, message: alias }]}
                        >
                          <SegmentSwitch
                            fontInBody={[
                              { label: '', value: false },
                              { label: '', value: true },
                            ]}
                            className={value ? 'OK' : 'NG'}
                            buttonColor="white"
                            onChange={() => {
                              onValueChange(name, key, !value);
                            }}
                          />
                        </Form.Item>
                      ) : barRadius ? (
                        <Form.Item
                          name={`${parentBodyBoxTab}$$${key}$$${name}`}
                          label={''}
                          style={{ marginBottom: 0, height: fontSize + 8 }}
                          initialValue={value}
                          rules={[{ required: false, message: alias }]}
                        >
                          {['int', 'float', 'number'].includes(_.lowerCase(type)) ? (
                            <InputNumber
                              ref={inputDom}
                              min={0}
                              stringMode
                              step={JSON.parse(`0.${(value + '')?.split('.')?.[1]?.length || 0}`)}
                              onBlur={(e) => {
                                const val = e.target.value;
                                onValueChange(name, key, Number(val));
                              }}
                              onPressEnter={(e: any) => {
                                inputDom.current.blur();
                              }}
                            />
                          ) : (
                            <Input
                              ref={inputDom}
                              onBlur={(e) => {
                                const val = e.target.value;
                                onValueChange(name, key, val);
                              }}
                              onPressEnter={(e: any) => {
                                inputDom.current.blur();
                              }}
                            />
                          )}
                        </Form.Item>
                      ) : (
                        <div
                          className="flex-box range-domain-box-item-td-read"
                          style={{ width: '100%', height: fontSize + 8 }}
                        >
                          {value}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </Form>
    </div>
  );
};

export default connect(({ home, themeStore }) => ({
  updateTabs: home.updateTabs || [],
}))(RangeDomainCharts);