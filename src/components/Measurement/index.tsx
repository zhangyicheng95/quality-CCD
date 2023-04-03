import React, { useEffect, useRef, useState } from 'react';
import { InputNumber } from 'antd';
import * as _ from 'lodash';
import styles from './index.less'

interface Props {
  disabled?: Boolean,
  value?: string,
  className?: any,
  onChange?: any,
  titleColor?: Boolean,
};

const Measurement: React.FC<Props> = (props: any) => {
  const {
    onChange = null, value = '', disabled, className = '', titleColor
  } = props;
  const refnum_0 = useRef();
  const refnum_1 = useRef();
  const refnum_2 = useRef();
  const refnum_3 = useRef();
  const refList: any = [refnum_0, refnum_1, refnum_2, refnum_3];
  const [selfValue, setSelfValue] = useState<any>({});
  const [focus, setFocus] = useState<any>({
    refnum_0: false,
    refnum_1: false,
    refnum_2: false,
    refnum_3: false
  });

  useEffect(() => {
    if (!!value && !_.isEmpty(value)) {
      setSelfValue(value);
      setFocus(() => {
        return Object.entries(value).reduce((pre: any, cen: any, index: number) => {
          return Object.assign({}, pre, {
            [`refnum_${index}`]: !!cen[1]?.value || cen[1]?.value == 0,
          });
        }, {});
      })
    }
  }, [value]);
  const handleNumberChange = (number: any, type: any, index: number) => {
    let Obj: any = selfValue;
    Obj[`${type}`] = {
      ...Obj[`${type}`],
      value: (_.isNaN(number) || _.isNull(number) || _.isEmpty(number)) ? undefined : Number(number)
    };
    setSelfValue(Obj);
    triggerChange(Obj);
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
    if (e.keyCode === 39 || e.keyCode === 13 || e.keyCode === 32) {
      if (type === 3) {
        return;
      } else {
        refList[type + 1]?.current?.focus();
      }
    }
  }

  return (
    <div className={`flex-box ${styles['roi-mark']}`} >
      {
        Object.entries(selfValue).map((item: any, index: number) => {
          const { alias, value, } = item[1];
          return <div key={index} className="flex-box-center item-input-box">
            <div
              className={`input-name ${focus[`refnum_${index}`] ? 'focus' : ''} ${titleColor ? 'bgColor' : ''}`}
              onClick={() => refList[index]?.current?.focus()}
            >{alias}</div>
            <InputNumber
              disabled={disabled}
              className={`self_input ${className}`}
              ref={refList[index]}
              value={value}
              // onChange={(e) => { handleNumberChange(e, `num_${index}`, index) }}
              onKeyUp={(e) => turnIpPOS(e, index)}
              onFocus={() => setFocus((prev: any) => Object.assign({}, prev, { [`refnum_${index}`]: true }))}
              onBlur={(e) => {
                const val = e?.target?.value;
                setFocus((prev: any) => Object.assign({}, prev, { [`refnum_${index}`]: !!val || (val == "0") }));
                handleNumberChange(val, item[0], index)
              }}
            />
          </div>
        })
      }
    </div>
  )
};

export default Measurement;