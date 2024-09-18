import React, { useEffect, useMemo } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { Button, DatePicker, Form, Input, InputNumber, message, notification, Popconfirm, Popover } from 'antd';
import { useForm } from 'antd/es/form/Form';
import moment from 'moment';
import { btnFetch } from '@/services/api';
import { timeToString } from '@/utils/utils';
import { connect } from 'umi';

interface Props {
  data: any;
  id: any;
  setMyChartVisible?: any;
  onClick?: any;
}

const CountDownCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id, started } = props;
  let {
    dataValue = {}, fontSize, fetchType, xName, ifFetchParams, yName,
  } = data;
  const [form] = useForm();
  if (process.env.NODE_ENV === 'development') {
    // dataValue = { type: 'success', title: '我是标题', content: '内容啊啊啊啊啊啊' }
  };

  useEffect(() => {
    if (!started) return;
    if (!!Object.keys(dataValue)?.length) {
      const { countDown = 0, startTime, startLength } = dataValue;
      if (!!startTime) {
        form.setFieldsValue({
          countDown, startLength,
          startTime: moment(!!startTime ? new Date(startTime) : new Date(), 'YYYY-MM-DD HH:mm:ss'),
        });
        if ((new Date().getTime() - new Date(startTime).getTime()) >= (countDown - 3) * 24 * 60 * 60 * 1000) {
          notification.destroy();
          const leaveTime = timeToString(new Date().getTime() - new Date(startTime).getTime());
          notification['warning']({
            message: '提示',
            description: (countDown - leaveTime?.d) >= 0 ? `${ifFetchParams}剩余${countDown - leaveTime?.d}天，请注意时间！` : `${ifFetchParams}已超期${leaveTime?.d - countDown}天，请注意时间！`,
            duration: null
          });
        }
      }
    }
  }, [dataValue]);
  useEffect(() => {
    if (!started) return;
    setTimeout(() => {
      btnFetch(fetchType, xName, { type: 'get' }).then((res: any) => {
        if (!!res && res.code === 'SUCCESS') {
          const { countDown = 0, startTime, startLength } = res?.data;
          if (!!startTime) {
            form.setFieldsValue({
              countDown, startLength,
              startTime: moment(!!startTime ? new Date(startTime) : new Date(), 'YYYY-MM-DD HH:mm:ss'),
            });
            if ((new Date().getTime() - new Date(startTime).getTime()) >= (countDown - 3) * 24 * 60 * 60 * 1000) {
              notification.destroy();
              const leaveTime = timeToString(new Date().getTime() - new Date(startTime).getTime());
              notification['warning']({
                message: '提示',
                description: (countDown - leaveTime?.d) >= 0 ? `${ifFetchParams}剩余${countDown - leaveTime?.d}天，请注意时间！` : `${ifFetchParams}已超期${leaveTime?.d - countDown}天，请注意时间！`,
                duration: null
              });
            }
          }
        } else {
          // message.error(res?.message || '后台服务异常，请重启服务');
        }
      });
    }, 5000);
  }, [started]);
  const onSubmit = () => {
    if (!started) return;
    form
      .validateFields()
      .then((values) => {
        const { countDown, startTime } = values;
        btnFetch(fetchType, xName, {
          type: 'post',
          data: {
            countDown,
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
      <Form form={form} scrollToFirstError>
        <Form.Item
          name={`startLength`}
          label={`设备累计运行`}
          initialValue={0}
          className="count-down-start-length"
        >
          <Input addonAfter="天" disabled size='large' />
        </Form.Item>
        <Form.Item
          name={`countDown`}
          label={<div style={{ textIndent: '2em' }}>{`${ifFetchParams}周期`}</div>}
          rules={[{ required: false, message: '倒计时' }]}
        >
          <InputNumber disabled={!started} addonAfter="天" min={0} />
        </Form.Item>
        <Form.Item
          name={`startTime`}
          label={`上次${ifFetchParams}时间`}
          initialValue={moment(new Date(), 'YYYY-MM-DD HH:mm:ss')}
          rules={[{ required: false, message: '开始时间' }]}
        >
          <DatePicker disabled={!started} showTime />
        </Form.Item>
        <Form.Item className='flex-box-center' style={{ marginBottom: 0 }}>
          <Popconfirm
            disabled={!started}
            title="确认修改吗?"
            onConfirm={() => {
              onSubmit();
            }}
            okText="确认"
            cancelText="取消"
          >
            <Button
              type="primary"
              htmlType="submit"
              style={{ fontSize }}
              disabled={!started}
            >
              {yName || '确认'}
            </Button>
          </Popconfirm>
        </Form.Item>
      </Form>
    </div>
  );
};

export default connect(({ home, themeStore }) => ({
  started: home.started || false,
}))(CountDownCharts);
