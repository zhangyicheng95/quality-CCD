import React, { Fragment, useEffect, useState } from 'react';
import _ from 'lodash';
import { Button, Form, message } from 'antd';
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

  useEffect(() => {
    if (modelUpload) {
      btnFetch('get', xName).then((res: any) => {
        if (!!res && res.code === 'SUCCESS') {
          message.success('success');
          setSelectOptions(res.data || {});
        } else {
          message.error(res?.message || '后台服务异常，请重启服务');
        }
      });
    }
  }, [modelUpload]);

  const onSubmit = () => {
    form.validateFields().then((values) => {
      console.log(values);
      // const params = {};
      // btnFetch(fetchType, xName, params).then((res: any) => {
      //   if (!!res && res.code === 'SUCCESS') {
      //     message.success('success');
      //   } else {
      //     message.error(res?.message || '后台服务异常，请重启服务');
      //   }
      // });
    });
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
              const { name, alias, sort = 0, type, className } = item;
              if (type === 'Button') {
                return (
                  <Button
                    type={!!className ? 'default' : 'primary'}
                    className={`form-charts-ant-btn ${className}`}
                    key={name}
                    onClick={() => {
                      btnFetch(fetchType, xName, { value: name }).then((res: any) => {
                        if (!!res && res.code === 'SUCCESS') {
                          message.success('success');
                        } else {
                          message.error(res?.message || '后台服务异常，请重启服务');
                        }
                      });
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
    </div>
  );
};

export default FormCharts;
