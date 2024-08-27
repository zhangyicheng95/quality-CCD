import React, { useEffect, useState } from 'react';
import styles from '../../index.module.less';
import * as _ from 'lodash';
import { Form, message, Select } from 'antd';
import CustomWindowBody from '@/components/CustomWindowBody';
import { btnFetch } from '@/services/api';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const FormulaCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let {
    dataValue, titleFontSize = 24, fontSize = 24, fetchType, xName, ifOnShowTab,
  } = data;
  const [form] = Form.useForm();
  const [options, setOptions] = useState({
    testFormula: [],
    sortingFormula: [],
  });
  useEffect(() => {
    btnFetch(fetchType, xName, { type: 'formula', method: 'read' }).then((res: any) => {
      if (!!res && res.code === 'SUCCESS') {
        setOptions(res.data);
      } else {
        message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
      }
    });
  }, []);
  useEffect(() => {
    form?.setFieldsValue({
      testFormula: undefined,
      sortingFormula: undefined,
      ...(!!dataValue ? dataValue : {}),
    });
  }, []);
  const onChange = () => {
    form
      .validateFields()
      .then((values: any) => {
        if (Object.values(values).filter(Boolean)?.length > 1) {
          btnFetch(fetchType, xName, {
            type: 'formula',
            method: 'write',
            value: values,
          }).then((res: any) => {
            if (!!res && res.code === 'SUCCESS') {
            } else {
              message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
            }
          });
        }
      })
      .catch((err: any) => {
        const { errorFields } = err;
        errorFields?.length && message.error(`${errorFields[0]?.errors[0]} 是必填项`);
      });
  };
  if (!ifOnShowTab) return null;
  return (
    <div
      id={`echart-${id}`}
      className={`${styles.formulaCharts}`}
      style={{ fontSize: titleFontSize }}
    >
      <CustomWindowBody title="配方" style={{ fontSize }} titleFontSize={titleFontSize}>
        <Form form={form} scrollToFirstError>
          <Form.Item
            name={`testFormula`}
            label={'检测配方'}
            rules={[{ required: false, message: '检测配方' }]}
          >
            <Select
              options={options?.testFormula || []}
              style={{ width: '100%' }}
              onChange={(e) => onChange()}
            />
          </Form.Item>
          <Form.Item
            name={`sortingFormula`}
            label={'分选配方'}
            rules={[{ required: false, message: '分选配方' }]}
            style={{ marginBottom: 0 }}
          >
            <Select
              options={options?.sortingFormula || []}
              style={{ width: '100%' }}
              onChange={(e) => onChange()}
            />
          </Form.Item>
        </Form>
      </CustomWindowBody>
    </div>
  );
};

export default FormulaCharts;
