import React, { useEffect, useState, useRef } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { Form, message, Select } from 'antd';
import { FrownOutlined, SmileOutlined } from '@ant-design/icons';
import { guid } from '@/utils/utils';
import { btnFetch } from '@/services/api';
import { connect } from 'umi';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}
// 状态组件
const SelectCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id, started } = props;
  let {
    dataValue = [], fontSize = 12, fetchType, xName, yName, ifNeedAllow, timeSelectDefault
  } = data;
  if (process.env.NODE_ENV === 'development') {
    dataValue = '1';
  };
  const domRef = useRef<any>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      value: dataValue
    });
  }, [dataValue]);

  return (
    <div id={`echart-${id}`} className={styles.selectCharts} ref={domRef} style={{ fontSize }}>
      {
        !!domRef?.current?.clientHeight ?
          <Form form={form} scrollToFirstError>
            <Form.Item
              name="value"
              label={yName || ''}
            >
              <Select
                mode={ifNeedAllow ? "multiple" : undefined}
                disabled={!started}
                style={{ height: domRef?.current?.clientHeight }}
                options={timeSelectDefault || dataValue}
                onChange={(e) => {
                  btnFetch('post', xName, { data: e });
                }}
              />
            </Form.Item>
          </Form>
          : null
      }
    </div>
  );
};

export default connect(({ home, themeStore }) => ({
  started: home.started || false,
}))(SelectCharts);
