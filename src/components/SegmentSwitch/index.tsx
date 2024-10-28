import React, { useEffect, useState } from 'react';
import { Form, Input, message, Modal } from 'antd';
import * as _ from 'lodash';
import styles from './index.less';
import { LoadingOutlined } from '@ant-design/icons';

interface Props {
  loading?: Boolean;
  disabled?: Boolean;
  value?: any;
  defaultValue?: any;
  className?: any;
  onChange?: any;
  onClick?: any;
  style?: any;
  title?: any;
  ref?: any;
  fontInBody?: any;
  layout?: string;
  border?: boolean;
  buttonColor?: any;
  reverse?: boolean;
}

const SegmentSwitch: React.FC<Props> = (props: any) => {
  const {
    onChange = null,
    onClick = null,
    value,
    defaultValue,
    disabled = false,
    loading = false,
    className = '',
    style,
    title,
    ref,
    fontInBody = [],
    layout,
    border = false,
    buttonColor = '',
    reverse = false,
  } = props;
  const [form] = Form.useForm();
  const [lock, setLock] = useState(0);
  const [tabPasswordVisible, setTabPasswordVisible] = useState<any>({});

  useEffect(() => {
    let index = 0;
    fontInBody.forEach?.((item: any, cIndex: number) => {
      if (item.value === (!_.isUndefined(value) ? value : defaultValue)) {
        index = cIndex;
      }
    });
    setLock(index);
  }, [value, defaultValue]);

  // tab切换
  const onTabChange = (item: any) => {
    const { value, index } = item;
    if (!!onClick) {
      setLock(index);
      !!onClick && onClick?.(value);
    } else {
      setLock(index);
      !!onChange && onChange?.(value);
    }
  };
  const onSubmit = () => {
    form.validateFields().then((values) => {
      const { pass } = values;
      const { password } = tabPasswordVisible;
      if (pass == password) {
        onTabChange(tabPasswordVisible);
        form.resetFields();
        setTabPasswordVisible({});
      } else {
        message.error('密码错误');
      }
    });
  };

  return (
    <div
      className={`flex-box segment-switch-box ${styles['segment-switch']}`}
      ref={ref}
      style={Object.assign(
        {},
        style ? { ...style } : {},
        reverse ? { flexDirection: 'row-reverse' } : {},
      )}
    >
      {!!title ? (
        <div className="segment-switch-title" style={{ textAlign: reverse ? 'left' : 'right' }}>
          {title}
        </div>
      ) : null}
      <div
        className={`${layout === 'vertical' ? 'flex-box-column' : 'flex-box'
          } segment-switch-box ${className}`}
        style={Object.assign({}, disabled ? { cursor: 'not-allowed' } : {})}
        onClick={
          !!onClick && !disabled
            ? () => {
              if (lock + 1 < fontInBody.length) {
                if (!!fontInBody[lock + 1]?.password) {
                  setTabPasswordVisible({ ...fontInBody[lock + 1], index: lock + 1 });
                } else {
                  onTabChange({ ...fontInBody[lock + 1], index: lock + 1 })
                }
              } else {
                if (!!fontInBody[0]?.password) {
                  setTabPasswordVisible({ ...fontInBody[0], index: 0 });
                } else {
                  onTabChange({ ...fontInBody[0], index: 0 });
                }
              }
            }
            : () => { }
        }
      >
        <div
          className="flex-box-center segment-switch-btn"
          style={Object.assign(
            layout === 'vertical'
              ? {
                width: 'calc(100% - 4px)',
                height: `calc(${100 / fontInBody?.length}% - 4px)`,
                top: `calc(${(100 / fontInBody?.length) * lock}% + 2px)`,
              }
              : {
                width: `calc(${100 / fontInBody?.length}% - 4px)`,
                left: `calc(${(100 / fontInBody?.length) * lock}% + 2px)`,
              },
            { backgroundColor: fontInBody?.[lock]?.backgroundColor },
            !!buttonColor ? { backgroundColor: buttonColor } : {},
          )}
        />
        {(fontInBody || [])?.map((item: any, index: number) => {
          const { label, color, password } = item;
          return (
            <div
              className={`flex-box-center segment-switch-box-item ${color}`}
              style={Object.assign(
                {},
                !border ? { border: 0 } : {},
                lock === index ? { color: '#fff' } : {},
              )}
              key={`segment-switch-box-item-${index}`}
              onClick={() => {
                if (lock !== index && !disabled && !loading) {
                  if (!!password) {
                    setTabPasswordVisible({ ...item, index });
                  } else {
                    onTabChange({ ...item, index });
                  }
                }
              }}
            >
              {loading ? <LoadingOutlined /> : label}
            </div>
          );
        })}
      </div>
      {
        // tab切换-密码框
        !!Object.keys?.(tabPasswordVisible)?.length ? (
          <Modal
            title={'密码校验'}
            open={!!Object.keys?.(tabPasswordVisible)?.length}
            onOk={() => onSubmit()}
            onCancel={() => {
              form.resetFields();
              setTabPasswordVisible({});
            }}
            maskClosable={false}
          >
            <Form form={form} scrollToFirstError>
              <Form.Item
                name={'pass'}
                label={'密码校验'}
                rules={[{ required: true, message: '密码' }]}
              >
                <Input autoFocus />
              </Form.Item>
            </Form>
          </Modal>
        ) : null
      }
    </div>
  );
};

export default SegmentSwitch;
