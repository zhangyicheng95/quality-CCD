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

const ROIMark: React.FC<Props> = (props: any) => {
  const { onChange = null, value = '', disabled, className = '', titleColor } = props;
  const refnum_0 = useRef();
  const refnum_1 = useRef();
  const refnum_2 = useRef();
  const refnum_3 = useRef();
  const refList: any = [refnum_0, refnum_1, refnum_2, refnum_3];
  const [selfValue, setSelfValue] = useState<any>({
    num_0: undefined,
    num_1: undefined,
    num_2: undefined,
    num_3: undefined,
  });
  const [focus, setFocus] = useState<any>({
    refnum_0: false,
    refnum_1: false,
    refnum_2: false,
    refnum_3: false
  });

  useEffect(() => {
    if (!!value) {
      setSelfValue(value);
      setFocus({
        refnum_0: !!value.num_0,
        refnum_1: !!value.num_1,
        refnum_2: !!value.num_2,
        refnum_3: !!value.num_3
      })
    }
  }, [value.num_0, value.num_1, value.num_2, value.num_3]);
  const handleNumberChange = (number: any, type: any, index: number) => {
    let Obj: any = selfValue;
    Obj[`${type}`] = (_.isNaN(number) || _.isNull(number)) ? undefined : number;
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
        ['标准值', '正公差', '负公差', '补偿值'].map((item: any, index: number) => {
          return <div key={index} className="flex-box-center item-input-box">
            <div
              className={`input-name ${focus[`refnum_${index}`] ? 'focus' : ''} ${titleColor ? 'bgColor' : ''}`}
              onClick={() => refList[index]?.current?.focus()}
            >{item}</div>
            <InputNumber
              disabled={disabled}
              className={`self_input ${className}`}
              ref={refList[index]}
              value={selfValue[`num_${index}`]}
              onChange={(e) => { handleNumberChange(e, `num_${index}`, index) }}
              onKeyUp={(e) => turnIpPOS(e, index)}
              onFocus={() => setFocus((prev: any) => Object.assign({}, prev, { [`refnum_${index}`]: true }))}
              onBlur={() => setFocus((prev: any) => Object.assign({}, prev, { [`refnum_${index}`]: !!selfValue[`num_${index}`] }))}
            />
          </div>
        })
      }
    </div>
  )
};

export default ROIMark;