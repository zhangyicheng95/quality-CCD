import React, { useEffect, useRef, useState } from 'react';
import { Input, InputNumber, Switch } from 'antd';
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
    buttonColor,
    reverse = false,
  } = props;
  const [lock, setLock] = useState(0);
  useEffect(() => {
    let index = 0;
    fontInBody.forEach((item: any, cIndex: number) => {
      if (item.value === (value || defaultValue || fontInBody?.[0]?.value)) {
        index = cIndex;
      }
    });
    setLock(index);
  }, [value, defaultValue]);

  return (
    <div
      className={`flex-box ${styles['segment-switch']}`}
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
        className={`${
          layout === 'vertical' ? 'flex-box-column' : 'flex-box'
        } segment-switch-box ${className}`}
        style={Object.assign({}, disabled ? { cursor: 'not-allowed' } : {})}
        onClick={
          !!onClick && !disabled
            ? () => {
                if (lock + 1 < fontInBody.length) {
                  setLock(lock + 1);
                  onClick?.(fontInBody[lock + 1]?.value);
                } else {
                  setLock(0);
                  onClick?.(fontInBody[0]?.value);
                }
              }
            : () => {}
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
            !!buttonColor
              ? { backgroundColor: buttonColor }
              : {
                  backgroundColor: fontInBody?.[lock]?.backgroundColor,
                },
          )}
        />
        {(fontInBody || [])?.map((item: any, index: number) => {
          const { value, label, color } = item;
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
                  setLock(index);
                  !!onChange && onChange?.(value);
                }
              }}
            >
              {loading ? <LoadingOutlined /> : label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SegmentSwitch;
