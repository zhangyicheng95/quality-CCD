import React, { useEffect, useMemo } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { Button, DatePicker, Form, InputNumber, message, notification } from 'antd';
import { useForm } from 'antd/es/form/Form';
import moment from 'moment';
import { btnFetch } from '@/services/api';
import { timeToString } from '@/utils/utils';

interface Props {
  data: any;
  id: any;
  setMyChartVisible?: any;
  onClick?: any;
}

const CountDownCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let {
    dataValue = {}, fontSize, fetchType, xName, ifFetchParams,
  } = data;
  const [form] = useForm();
  if (process.env.NODE_ENV === 'development') {
    // dataValue = { type: 'success', title: '我是标题', content: '内容啊啊啊啊啊啊' }
  };

  useEffect(() => {
    btnFetch(fetchType, xName, { type: 'get' }).then((res: any) => {
      if (!!res && res.code === 'SUCCESS') {
        const { timeLength, startTime } = res?.data;
        form.setFieldsValue({
          timeLength,
          startTime: moment(!!startTime ? new Date(startTime) : new Date(), 'YYYY-MM-DD HH:mm:ss'),
        });
        if (!!timeLength && !!startTime) {
          if ((new Date().getTime() - new Date(startTime).getTime()) >= (timeLength - 3) * 24 * 60 * 60 * 1000) {
            notification.destroy();
            const leaveTime = timeToString(new Date().getTime() - new Date(startTime).getTime());
            notification['warning']({
              message: '提示',
              description: (timeLength - leaveTime?.d) >= 0 ? `${ifFetchParams}剩余${timeLength - leaveTime?.d}天，请注意时间！` : `${ifFetchParams}已超期${leaveTime?.d - timeLength}天，请注意时间！`,
              duration: null
            });
          }
        }
      } else {
        message.error(res?.message || '后台服务异常，请重启服务');
      }
    });
  }, []);
  const onSubmit = (values: any) => {
    form
      .validateFields()
      .then((values) => {
        const { timeLength, startTime } = values;
        btnFetch(fetchType, xName, {
          type: 'post',
          data: {
            timeLength,
            startTime: moment(new Date(startTime)).format('YYYY-MM-DD HH:mm:ss')
          }
        }).then((res: any) => {
          if (!!res && res.code === 'SUCCESS') {
            message.success('success');
          } else {
            message.error(res?.message || '后台服务异常，请重启服务');
          }
        });
      });
  };
  return (
    <div
      id={`echart-${id}`}
      className={`${styles.countDownCharts}`}
      style={{ fontSize }}
    >
      <Form form={form} scrollToFirstError onFinish={onSubmit}>
        <Form.Item
          name={`timeLength`}
          label={<div style={{ textIndent: '1em' }}>倒计时</div>}
          rules={[{ required: false, message: '倒计时' }]}
        >
          <InputNumber addonAfter="天" min={0} />
        </Form.Item>
        <Form.Item
          name={`startTime`}
          label={'开始时间'}
          initialValue={moment(new Date(), 'YYYY-MM-DD HH:mm:ss')}
          rules={[{ required: false, message: '开始时间' }]}
        >
          <DatePicker showTime />
        </Form.Item>
        <Form.Item className='flex-box-center' style={{ marginBottom: 0 }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ fontSize }}
          >
            确认
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CountDownCharts;
