import React, { Fragment, useEffect, useState } from 'react';
import _ from 'lodash';
import { Button, Form, message, Modal } from 'antd';
import styles from '../index.module.less';
import { btnFetch } from '@/services/api';
import CustomWindowBody from '@/components/CustomWindowBody';
import { FormatWidgetToDom } from './Operation2Charts';

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
  } = data;
  const [selectOptions, setSelectOptions] = useState({
    name1: [{ label: 'aaa', value: 'aaa' }],
  });
  const [formModalEdit, setFormModalEdit] = useState('');
  const [formModalValue, setFormModalValue] = useState({});

  useEffect(() => {
    if (modelUpload) {
      btnFetch('get', xName).then((res: any) => {
        if (!!res && res.code === 'SUCCESS') {
          message.success('success');
          setSelectOptions(res.data || {});
          form.setFieldsValue(res?.dat?.__default || {});
          form1.setFieldsValue(res?.dat?.__default || {});

          let list: any = {};
          (timeSelectDefault || []).forEach((item: any) => {
            const { name, parent } = item;
            if (!!parent) {
              list = {
                ...list,
                [parent]: list?.[parent]
                  ? list[parent].concat({ [name]: res?.dat?.__default?.[name] })
                  : { [name]: res?.dat?.__default?.[name] },
              };
            }
          });
          setFormModalValue(list);
        } else {
          message.error(res?.message || '后台服务异常，请重启服务');
        }
      });
    }
  }, []);

  const onSubmit = () => {
    form.validateFields().then((values) => {
      const child = Object.entries(formModalValue || {})?.reduce((pre: any, cen: any) => {
        return {
          ...pre,
          ...cen[1],
        };
      }, {});
      const params = {
        ...values,
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

  const onModalCancel = () => {
    form1.resetFields();
    setFormModalEdit('');
  };

  return (
    <div id={`echart-${id}`} className={`flex-box-column ${styles.formCharts}`}>
      <CustomWindowBody
        title={yName}
        titleFontSize={titleFontSize}
        className="form-charts-needAllow"
        style={{ fontSize }}
      >
        <Form form={form} scrollToFirstError>
          {(timeSelectDefault || [])
            ?.sort((a: any, b: any) => a.sort - b.sort)
            ?.map((item: any, index: number) => {
              const { name, alias, sort = 0, type, className, parent } = item;
              if (!!parent) {
                return null;
              }
              if (['Button', 'ModalButton'].includes(type)) {
                return (
                  <Button
                    type={className}
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
                require: true,
                type: 'string',
                value: ['MultiSelect', 'Select'].includes(type) ? [] : undefined,
                widget: Object.assign(
                  {},
                  { type },
                  ['MultiSelect', 'Select'].includes(type)
                    ? {
                        options: selectOptions?.[name] || [],
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
                    [formModalEdit]: values,
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
                  const { name, alias, sort = 0, type, className, parent } = item;
                  if (formModalEdit === parent) {
                    item = {
                      alias,
                      name,
                      onHidden: false,
                      orderId: sort,
                      require: true,
                      type: 'string',
                      value: ['MultiSelect', 'Select'].includes(type) ? [] : undefined,
                      widget: Object.assign(
                        {},
                        { type },
                        ['MultiSelect', 'Select'].includes(type)
                          ? {
                              options: selectOptions?.[name] || [],
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
    </div>
  );
};

export default FormCharts;
