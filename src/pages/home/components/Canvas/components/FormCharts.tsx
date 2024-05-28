import React, { Fragment, useEffect, useMemo, useState } from 'react';
import _ from 'lodash';
import { Button, Form, Input, InputNumber, message, Modal } from 'antd';
import styles from '../index.module.less';
import { btnFetch } from '@/services/api';
import CustomWindowBody from '@/components/CustomWindowBody';
import { FormatWidgetToDom } from './Operation2Charts';
import { init } from '@umijs/deps/compiled/webpack';
import BasicTable from '@/components/BasicTable';
import { guid } from '@/utils/utils';

interface Props {
  data: any;
  id: any;
  setMyChartVisible?: any;
  onClick?: any;
}

const FormCharts: React.FC<Props> = (props: any) => {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  let { data = {}, id } = props;
  let {
    dataValue = [],
    titleFontSize = 24,
    fontSize = 20,
    timeSelectDefault,
    yName,
    xName,
    fetchType,
    modelUpload,
    ifNeedAllow,
    modelRotate,
  } = data;
  const [selectOptions, setSelectOptions] = useState({
    1: { value: '', type: '', options: [{ label: 'aaa', value: 'aaa' }] },
    2: { value: '', type: '', options: [{ label: 'aaa', value: 'aaa' }] },
    3: { value: '', type: '', options: [{ label: 'aaa', value: 'aaa' }] },
  });
  const [formModalEdit, setFormModalEdit] = useState('');
  const [formModalValue, setFormModalValue] = useState({});

  const [visible, setVisible] = useState(false);
  const [tableDataSource, setTableDataSource] = useState([]);
  // 初始化函数
  const init = (value: any) => {
    setSelectOptions(value || {});
    const result = Object.entries(value)?.reduce((pre: any, cen: any) => {
      return {
        ...pre,
        [cen[0]]: cen[1]?.value,
      };
    }, {});
    form.setFieldsValue(result);
    form1.setFieldsValue(result);

    let list: any = {};
    (timeSelectDefault || []).forEach((item: any) => {
      const { name, parent } = item;
      if (!!parent) {
        list = {
          ...list,
          [parent]: list?.[parent]
            ? list[parent].concat({ [name]: value?.[name] })
            : { [name]: value?.[name] },
        };
      }
    });
    setFormModalValue(list);
  };
  // 初始化进入
  useEffect(() => {
    if (modelUpload) {
      btnFetch('get', xName).then((res: any) => {
        if (!!res && res.code === 'SUCCESS') {
          message.success('success');
          init(res.data);
        } else {
          message.error(res?.message || '后台服务异常，请重启服务');
        }
      });
    }
  }, []);
  // socket监听dataValue
  useEffect(() => {
    if (!_.isEmpty(dataValue)) {
      init(dataValue);
    }
  }, [dataValue]);
  // 提交
  const onSubmit = () => {
    form.validateFields().then((values) => {
      const child = Object.entries(formModalValue || {})?.reduce((pre: any, cen: any) => {
        return {
          ...pre,
          ...cen[1],
        };
      }, {});
      const params = {
        ...Object.entries(values)?.reduce((pre: any, cen: any) => {
          return {
            ...pre,
            [cen[0]]: { ...selectOptions?.[cen[0]], value: values[cen[0]] },
          };
        }, {}),
        ...child,
      };
      btnFetch(fetchType, xName, params).then((res: any) => {
        if (!!res && res.code === 'SUCCESS') {
          message.success('success');
        } else {
          message.error(res?.message || '后台服务异常，请重启服务');
        }
      });
    });
  };
  // 表单关闭
  const onModalCancel = () => {
    form1.resetFields();
    setFormModalEdit('');
  };
  // 预设单号表格
  const columns = useMemo(
    () =>
      timeSelectDefault
        .map((item: any) => {
          const { name, alias } = item;
          return {
            title: alias,
            key: name,
            dataIndex: name,
            render: (text: any, record: any, index: number) => {
              return text + '';
            },
          };
        })
        .concat({
          title: '操作',
          dataIndex: 'operation',
          key: 'operation',
          width: '150px',
          render: (text: any, record: any, index: number) => {
            return (
              <Button
                type="link"
                onClick={() => {
                  const centerList = JSON.parse(
                    localStorage.getItem(`${id}-orderInformationList`) || '[]',
                  );
                  _.pullAt(centerList, index);
                  localStorage.setItem(`${id}-orderInformationList`, JSON.stringify(centerList));
                  setTableDataSource(centerList);
                }}
              >
                删除
              </Button>
            );
          },
        }),
    [timeSelectDefault],
  );
  // 预设单号表格关闭
  const onCancel = () => {
    form.resetFields();
    setVisible(false);
  };
  // 切换单号
  const onChange = () => {
    const list = JSON.parse(localStorage.getItem(`${id}-orderInformationList`) || '[]');
    const nextInfo = list?.[0] || undefined;
    if (!!nextInfo) {
      btnFetch(fetchType, xName, { type: 'orderInfo', value: nextInfo }).then((res: any) => {
        if (!!res && res.code === 'SUCCESS') {
          _.pullAt(list, 0);
          form.setFieldsValue(nextInfo);
          localStorage.setItem(`${id}-orderInformationList`, JSON.stringify(list));
        } else {
          message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
        }
      });
    } else {
      message.error('无预设单号');
    }
  };

  return (
    <div id={`echart-${id}`} className={`flex-box-column ${styles.formCharts}`}>
      <CustomWindowBody
        title={yName}
        titleFontSize={titleFontSize}
        className="form-charts-needAllow"
        style={{ fontSize }}
        headerRight={
          modelRotate ? (
            <div className="flex-box" style={{ fontSize: titleFontSize }}>
              <Button
                type="link"
                style={{ fontSize: 'inherit' }}
                onClick={() => {
                  setVisible(true);
                  const list = JSON.parse(
                    localStorage.getItem(`${id}-orderInformationList`) || '[]',
                  );
                  setTableDataSource(list);
                }}
              >
                预设单号
              </Button>
              <Button
                type="link"
                style={{ fontSize: 'inherit' }}
                onClick={() => {
                  onChange();
                }}
              >
                切换订单
              </Button>
            </div>
          ) : null
        }
      >
        <Form form={form} scrollToFirstError>
          {(timeSelectDefault || [])
            ?.sort((a: any, b: any) => a.sort - b.sort)
            ?.map((item: any, index: number) => {
              const { name, alias, sort = 0, type, className, parent, disabled = false } = item;
              if (!!parent) {
                return null;
              }
              if (['Button', 'ModalButton'].includes(type)) {
                return (
                  <Button
                    type={className}
                    disabled={disabled}
                    className={`form-charts-ant-btn ${className}`}
                    key={name}
                    onClick={() => {
                      if (type === 'ModalButton') {
                        setFormModalEdit(name);
                        form1.setFieldsValue(formModalValue?.[name] || {});
                      } else {
                        btnFetch(fetchType, xName, { value: name }).then((res: any) => {
                          if (!!res && res.code === 'SUCCESS') {
                            message.success('success');
                          } else {
                            message.error(res?.message || '后台服务异常，请重启服务');
                          }
                        });
                      }
                    }}
                  >
                    {alias}
                  </Button>
                );
              }
              item = {
                alias,
                name,
                onHidden: false,
                orderId: sort,
                require: !disabled,
                type: 'string',
                value: ['MultiSelect', 'Select'].includes(type) ? [] : undefined,
                widget: Object.assign(
                  {},
                  { type },
                  ['MultiSelect', 'Select'].includes(type)
                    ? {
                        options: selectOptions?.[name]?.options || [],
                      }
                    : {},
                ),
              };
              return (
                <FormatWidgetToDom
                  key={item?.name}
                  form={form}
                  id={item?.name}
                  fontSize={fontSize}
                  label={item?.alias || item?.name}
                  config={[item?.name, item]}
                  disabled={disabled}
                  widgetChange={() => {
                    if (!ifNeedAllow) {
                      onSubmit();
                    }
                  }}
                />
              );
            })}
        </Form>
      </CustomWindowBody>
      {ifNeedAllow ? (
        <div className="flex-box-center">
          <Button
            type="primary"
            style={{ height: 40, width: 200 }}
            onClick={() => {
              onSubmit();
            }}
          >
            确认
          </Button>
        </div>
      ) : null}

      {
        // 自定义表单-二级窗口
        !!formModalEdit ? (
          <Modal
            title={'表单弹窗'}
            centered
            open={!!formModalEdit}
            onOk={() => {
              form1.validateFields().then((values) => {
                setFormModalValue((prev: any) => {
                  return {
                    ...prev,
                    [formModalEdit]: Object.entries(formModalValue?.[formModalEdit])?.reduce(
                      (pre: any, cen: any) => {
                        return {
                          ...pre,
                          [cen[0]]: {
                            ...cen[1],
                            value: values[cen[0]],
                          },
                        };
                      },
                      {},
                    ),
                  };
                });
                onModalCancel();
              });
            }}
            onCancel={() => onModalCancel()}
            maskClosable={false}
          >
            <Form form={form1} scrollToFirstError>
              {timeSelectDefault
                ?.sort((a: any, b: any) => a.sort - b.sort)
                ?.map((item: any, index: number) => {
                  const { name, alias, sort = 0, type, disabled, className, parent } = item;
                  if (formModalEdit === parent) {
                    item = {
                      alias,
                      name,
                      onHidden: false,
                      orderId: sort,
                      require: !disabled,
                      type: 'string',
                      value: ['MultiSelect', 'Select'].includes(type) ? [] : undefined,
                      widget: Object.assign(
                        {},
                        { type },
                        ['MultiSelect', 'Select'].includes(type)
                          ? {
                              options: selectOptions?.[name]?.options || [],
                            }
                          : {},
                      ),
                    };
                    return (
                      <FormatWidgetToDom
                        key={item?.name}
                        form={form1}
                        id={item?.name}
                        fontSize={fontSize}
                        label={item?.alias || item?.name}
                        config={[item?.name, item]}
                        disabled={disabled}
                        widgetChange={() => {
                          if (!ifNeedAllow) {
                            onSubmit();
                          }
                        }}
                      />
                    );
                  }
                  return null;
                })}
            </Form>
          </Modal>
        ) : null
      }

      <Modal
        title={'单号预输入'}
        width="40vw"
        wrapClassName={'order-information-modal'}
        centered
        open={!!visible}
        footer={null}
        onCancel={() => onCancel()}
      >
        <div className="order-information-modal-body">
          <div className="flex-box-align-end order-information-modal-body-top">
            <div className="order-information-modal-body-top-form-box">
              <Form form={form}>
                {timeSelectDefault?.map((item: any) => {
                  const { name, alias, sort = 0, type, className, parent, disabled = false } = item;
                  if (!!parent || ['Button', 'ModalButton'].includes(type)) {
                    return null;
                  }
                  item = {
                    alias,
                    name,
                    onHidden: false,
                    orderId: sort,
                    require: !disabled,
                    type: 'string',
                    value: ['MultiSelect', 'Select'].includes(type) ? [] : undefined,
                    widget: Object.assign(
                      {},
                      { type },
                      ['MultiSelect', 'Select'].includes(type)
                        ? {
                            options: selectOptions?.[name]?.options || [],
                          }
                        : {},
                    ),
                  };
                  return (
                    <FormatWidgetToDom
                      key={item?.name}
                      form={form}
                      id={item?.name}
                      fontSize={fontSize}
                      label={item?.alias || item?.name}
                      config={[item?.name, item]}
                    />
                  );
                })}
              </Form>
            </div>
            <div className="flex-box order-information-modal-body-top-btn-box">
              <Button
                type="primary"
                onClick={() => {
                  form
                    .validateFields()
                    .then((values: any) => {
                      const centerList = JSON.parse(
                        localStorage.getItem(`${id}-orderInformationList`) || '[]',
                      );
                      const result = centerList.concat(values);
                      localStorage.setItem(`${id}-orderInformationList`, JSON.stringify(result));
                      setTableDataSource(result);
                      form.resetFields();
                    })
                    .catch((err: any) => {
                      const { errorFields } = err;
                      errorFields?.length && message.error(`${errorFields[0]?.errors[0]} 是必填项`);
                    });
                }}
              >
                新增
              </Button>
              <Button
                type="default"
                danger
                onClick={() => {
                  form.resetFields();
                }}
              >
                删除
              </Button>
              <Button type="primary" danger onClick={() => onCancel()}>
                退出
              </Button>
            </div>
          </div>
          <div className="order-information-modal-body-bottom">
            <BasicTable
              columns={columns}
              dataSource={(tableDataSource || [])?.map?.((item: any) => ({ ...item, key: guid() }))}
              scroll={{
                y: 290,
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FormCharts;
