import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Input, InputNumber } from 'antd';
import styles from './index.less';

interface Props {
  disabled?: Boolean;
  value?: string;
  className?: any;
  onChange?: any;
}

const IpInput: React.FC<Props> = (props: any) => {
  const { onChange = null, value = '', disabled, className } = props;
  const refip_0 = useRef();
  const refip_1 = useRef();
  const refip_2 = useRef();
  const refip_3 = useRef();
  const refList: any = [refip_0, refip_1, refip_2, refip_3];
  const [selfValue, setSelfValue] = useState<any>({
    ip_0: undefined,
    ip_1: undefined,
    ip_2: undefined,
    ip_3: undefined,
  });

  useEffect(() => {
    if (!!value) {
      const res = value?.split('.') || [];
      setSelfValue({
        ip_0: res[0],
        ip_1: res[1],
        ip_2: res[2],
        ip_3: res[3],
      });
    }
  }, [value]);
  const handleNumberChange = (e: any, type: any) => {
    //确保最小值为0；
    const number = parseInt(e.target.value || 0, 10);
    if (isNaN(number)) {
      return;
    }
    setSelfValue((prev: any) => {
      return Object.assign({}, prev, {
        [type]: number,
      });
    });
    let Obj: any = selfValue;
    Obj[`${type}`] = number;
    triggerChange(Object.values(Obj).join('.'));
  };

  const triggerChange = (changedValue: any) => {
    if (onChange) {
      onChange(changedValue);
    }
  };
  const turnIpPOS = (e: any, type: number) => {
    //左箭头向左跳转，左一不做任何措施
    if (e.keyCode === 37) {
      if (type === 0) {
        return;
      } else {
        refList[type - 1]?.current?.focus();
      }
    }
    //右箭头、回车键、空格键、冒号均向右跳转，右一不做任何措施
    if (e.keyCode === 39 || e.keyCode === 13 || e.keyCode === 32 || e.keyCode === 190) {
      if (type === 3) {
        return;
      } else {
        refList[type + 1]?.current?.focus();
      }
    }
  };

  return (
    <div
      className={`flex-box-center ${styles.inputGroup}`}
      style={Object.assign(
        {},
        { height: '100%' },
        disabled ? { backgroundColor: 'rgba(255, 255, 255, 0.08)' } : {},
      )}
    >
      {Object.entries(selfValue)?.map?.((item: any, index: number) => {
        return (
          <Fragment key={index}>
            <InputNumber
              disabled={disabled}
              className={`self_input ${className}`}
              ref={refList[index]}
              value={item[1]}
              maxLength={3}
              onBlur={(e) => {
                handleNumberChange(e, item[0]);
              }}
              // onKeyUp={(e) => turnIpPOS(e, index)}
            />
            {index !== 3 ? <div className={'dot'} /> : null}
          </Fragment>
        );
      })}
    </div>
  );
};

export default IpInput;
