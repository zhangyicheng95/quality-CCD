import React, { useEffect, useRef, useState } from 'react';
import { Input, InputNumber, Switch } from 'antd';
import * as _ from 'lodash';
import styles from './index.less';

interface Props {
  disabled?: Boolean;
  value?: boolean;
  defaultValue: boolean;
  className?: any;
  onChange?: any;
  style?: any;
  title?: any;
  ref?: any;
  fontInBody?: any;
  layout?: string;
  border?: boolean;
}

const SegmentSwitch: React.FC<Props> = (props: any) => {
  const {
    onChange = null,
    value = false,
    defaultValue = false,
    disabled,
    className = '',
    style,
    title,
    ref,
    fontInBody = [],
    layout,
    border = false,
  } = props;
  const [lock, setLock] = useState(0);

  useEffect(() => {
    setLock(value || defaultValue);
  }, [value, defaultValue]);

  return (
    <div
      className={`flex-box ${styles['segment-switch']} ${className}`}
      ref={ref}
      style={style ? { ...style } : {}}
    >
      {!!title ? <div className="segment-switch-title">{title}</div> : null}
      <div
        className="flex-box segment-switch-box"
        style={
          layout === 'vertical'
            ? {
                flexDirection: 'column',
              }
            : {}
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
          )}
        />
        {(fontInBody || [])?.map((item: any, index: number) => {
          const { value, label } = item;
          return (
            <div
              className="flex-box-center segment-switch-box-item"
              style={!border ? { border: 0 } : {}}
              key={`segment-switch-box-item-${index}`}
              onClick={() => {
                if (lock !== index) {
                  setLock(index);
                  !!onChange && onChange?.(value);
                }
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SegmentSwitch;
