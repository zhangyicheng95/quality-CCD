import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as _ from 'lodash';
import styles from '../index.module.less';
import BasicTable from '@/components/BasicTable';
import { useModel } from 'umi';
import { btnFetch } from '@/services/api';
import { Button, Divider, Form, Input, message } from 'antd';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}
const localData = [
  {
    key: 1,
    name: 'John Brown sr.',
    name1: 'John Brown sr.',
    age2: '',
    address2: '',
    age: '',
    address: '',
    children: [
      {
        key: 11,
        name: 'John Brown',
        age: 42,
        address: 'New York No. 2 Lake Park',
      },
      {
        key: 12,
        name: 'John Brown jr.',
        age: '',
        address: '',
        children: [
          {
            key: 121,
            name: 'Jimmy Brown',
            age: 16,
            address: 'New York No. 3 Lake Park',
          },
        ],
      },
      {
        key: 13,
        name: 'Jim Green sr.',
        age: '',
        address: '',
        children: [
          {
            key: 131,
            name: 'Jim Green',
            age: '',
            address: '',
            children: [
              {
                key: 1311,
                name: 'Jim Green jr.',
                age: 25,
                address: 'London No. 3 Lake Park',
              },
              {
                key: 1312,
                name: 'Jimmy Green sr.',
                age: 18,
                address: 'London No. 4 Lake Park',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    key: 2,
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  },
];
const TableAntdCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let {
    dataValue = [],
    tableFontSize = 14,
    fontSize = 12,
    fetchType,
    xName,
    yName,
    ifFetch,
    reverse,
    interlacing,
    des_bordered,
    headerBackgroundColor,
    valueColor,
    timeSelectDefault,
    staticHeight,
    ifOnShowTab,
  } = data;
  const [form] = Form.useForm();
  const { validateFields, setFieldsValue, resetFields } = form;
  const { initialState } = useModel<any>('@@initialState');
  const { params } = initialState;
  if (process.env.NODE_ENV === 'development') {
    dataValue = localData;
  }
  if (reverse) {
    const result = !!reverse ? _.cloneDeep(dataValue).reverse() : dataValue;
    console.log(result);
  }
  const domRef = useRef<any>(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>([]);
  const [dataSource, setDataSource] = useState<any>([]);
  const searchBox = useMemo(() => {
    let result: any = [];
    if (!!dataValue?.[0] && !!Object.keys(dataValue?.[0])?.length) {
      let obj = Object.keys(_.omit(_.omit(dataValue?.[0], 'key'), 'children'));
      obj.forEach?.((item: string, index: number) => {
        if (_.isString(item)) {
          result.push(item);
        }
      });
    }
    return result;
  }, [dataValue]);
  const columns: any = useMemo(() => {
    let result: any = [];
    if (!!dataValue?.[0] && !!Object.keys(dataValue?.[0])?.length) {
      let obj = Object.keys(_.omit(_.omit(dataValue?.[0], 'key'), 'children'));
      obj.forEach?.((item: string, index: number) => {
        if (_.isString(item)) {
          result.push({
            title: item,
            dataIndex: item,
            key: item,
          });
        }
      });
    }
    let length = 0;
    (timeSelectDefault || [])?.forEach?.((item: any) => {
      const { label } = item;
      length += label?.length;
    });
    return timeSelectDefault?.length
      ? result.concat({
        title: '操作项',
        dataIndex: 'operation',
        key: 'operation',
        width: length * fontSize + 16 + 40,
        render: (text: any, record: any) => {
          return (
            <div className="flex-box">
              {(timeSelectDefault || [])?.map((item: any, index: number) => {
                const { value, label } = item;
                return (
                  <div className="flex-box" key={`operation-${value}`}>
                    <a
                      onClick={() => {
                        if (!!fetchType && !!xName) {
                          btnFetch(fetchType, xName, { value }).then((res: any) => {
                            if (res && res.code === 'SUCCESS') {
                              message.success('success');
                            } else {
                              message.error(
                                res?.msg || res?.message || '后台服务异常，请重启服务',
                              );
                            }
                          });
                        }
                      }}
                    >
                      {label}
                    </a>
                    {index + 1 === timeSelectDefault?.length ? null : (
                      <span className="operation-line">|</span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        },
      })
      : result;
  }, [dataValue, timeSelectDefault]);
  const onSearch = (params?: any) => {
    if (!!fetchType && !!xName) {
      btnFetch(fetchType, xName, params).then((res: any) => {
        if (!!res && res.code === 'SUCCESS') {
        } else {
          message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
        }
      });
    }
  };
  useEffect(() => {
    onSearch();
  }, []);
  useEffect(() => {
    if (!!localStorage.getItem(`table4-${params.id}-${id}`)) {
      setExpandedRowKeys(JSON.parse(localStorage.getItem(`table4-${params.id}-${id}`) || '[]'));
    } else {
      let result: any = [];
      function func(obj: any) {
        result.push(obj.key);
        if (!!obj?.children?.length) {
          (obj?.children || []).forEach?.((i: any) => {
            func(i);
          });
        }
      }
      (dataValue || []).forEach?.((i: any) => {
        func(i);
      });

      setExpandedRowKeys(result);
    }
  }, [dataValue]);
  if (!ifOnShowTab) return null;
  return (
    <div
      id={`echart-${id}`}
      className={`flex-box-column ${styles.tableAntdCharts}`}
      ref={domRef}
      style={{ fontSize }}
    >
      {searchBox?.length ? (
        <div className="table-antd-search-box">
          <Form form={form} scrollToFirstError>
            {(searchBox || [])?.map((item: any, index: number) => {
              return (
                <Form.Item
                  name={item}
                  label={item}
                  style={{
                    width: 300,
                    maxHeight: (fontSize / 2) * 3,
                    float: 'left',
                    marginRight: 16,
                  }}
                  rules={[{ required: false, message: item }]}
                >
                  <Input />
                </Form.Item>
              );
            })}
          </Form>
          <Button
            type="primary"
            style={{
              fontSize: 'inherit',
              float: 'left',
              height: (fontSize / 2) * 3 + 2,
              marginTop: 3,
            }}
            onClick={() => {
              validateFields().then((values: any) => {
                console.log(values);
                onSearch(values);
              });
            }}
          >
            查询
          </Button>
        </div>
      ) : null}
      <div className="table-antd-body-box">
        <BasicTable
          columns={columns}
          dataSource={dataValue}
          bordered={des_bordered}
          size={staticHeight}
          defaultExpandAllRows={true}
          defaultExpandedRowKeys={expandedRowKeys}
          expandedRowKeys={expandedRowKeys}
          onExpandedRowsChange={(e: any) => {
            const value = Array.from(new Set(e));
            localStorage.setItem(`table4-${params.id}-${id}`, JSON.stringify(value));
            setExpandedRowKeys(value);
          }}
          pagination={null}
          className={`expand-icon-size-${fontSize < 24 ? (fontSize > 16 ? '20' : '16') : '24'
            } header-color-${headerBackgroundColor}
        body-color-${interlacing}`}
        />
      </div>
    </div>
  );
};

export default TableAntdCharts;
