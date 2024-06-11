import React, { useEffect, useRef, useState } from 'react';
import { Input, InputNumber, Switch } from 'antd';
import * as _ from 'lodash';
import styles from './index.less';
import SegmentSwitch from '../SegmentSwitch';

interface Props {
  disabled?: Boolean;
  value?: string;
  className?: any;
  onChange?: any;
  onPressEnter?: any;
  onOpenChange?: any;
  titleColor?: Boolean;
  precision?: number;
  step?: number;
  max?: number;
  min?: number;
  lineNum?: number;
  style?: any;
  type?: any;
  gap?: any;
}

const Measurement: React.FC<Props> = (props: any) => {
  const {
    onChange = null,
    onPressEnter = null,
    onOpenChange = null,
    value = '',
    disabled,
    className = '',
    titleColor,
    precision = 2,
    step = 0.01,
    max = 100000,
    min = -100000,
    lineNum = 4,
    style = null,
    type = 'float',
    gap = 0,
  } = props;
  const dom = useRef<any>();
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
    refnum_3: false,
  });

  useEffect(() => {
    if (!!value && !_.isEmpty(value)) {
      setSelfValue(
        _.isObject(Object.values(value)[0])
          ? value
          : Object.entries(value).reduce((pre: any, cen: any, index: number) => {
              return Object.assign({}, pre, {
                [cen[0]]: {
                  alias: cen[0],
                  value: cen[1],
                },
              });
            }, {}),
      );
      setFocus(() => {
        return Object.entries(value).reduce((pre: any, cen: any, index: number) => {
          return Object.assign({}, pre, {
            [`refnum_${index}`]:
              !!cen[1]?.value || _.isNumber(cen[1]?.value) || _.isBoolean(cen[1]?.value),
          });
        }, {});
      });
    }
  }, [value]);
  const handleNumberChange = (number: any, name: any, index: number) => {
    let Obj: any = selfValue;
    Obj[`${name}`] = {
      ...Obj[`${name}`],
      value:
        _.isNaN(number) || _.isNull(number) || _.isUndefined(number)
          ? type === 'string'
            ? ''
            : type === 'bool'
            ? false
            : 0
          : number,
    };
    setSelfValue(Obj);
    triggerChange(Obj);
  };
  const triggerChange = (changedValue: any) => {
    if (!!onOpenChange) {
      onOpenChange(changedValue);
    } else if (!!onChange) {
      onChange(changedValue);
    }
  };

  return (
    <div
      className={`flex-box ${styles['roi-mark']}`}
      ref={dom}
      style={Object.assign({}, style ? { ...style } : {}, !!gap ? { gap } : {})}
    >
      {Object.entries(selfValue)?.map?.((item: any, index: number) => {
        if (!item[1]) return null;
        const { alias, value } = item[1];
        return (
          <div
            key={index}
            className="flex-box-center item-input-box"
            style={{
              minWidth: `calc(${100 / lineNum}% - ${!!gap ? gap : 24}px)`,
              width: `calc(${100 / lineNum}% - ${!!gap ? gap : 24}px)`,
            }}
          >
            <div
              className={`input-name ${focus[`refnum_${index}`] ? 'focus' : ''} ${
                titleColor ? 'bgColor' : ''
              }`}
              onClick={() => refList[index]?.current?.focus()}
            >
              {alias || item[0]}
            </div>
            {type === 'string' ? (
              <Input
                disabled={disabled}
                className={`self_input ${className}`}
                ref={refList[index]}
                defaultValue={!!value ? value : ''}
                onFocus={() =>
                  setFocus((prev: any) => Object.assign({}, prev, { [`refnum_${index}`]: true }))
                }
                onBlur={(e) => {
                  if (!onOpenChange) {
                    const val = e?.target?.value;
                    setFocus((prev: any) =>
                      Object.assign({}, prev, {
                        [`refnum_${index}`]: !(_.isUndefined(val) || _.isNull(val)),
                      }),
                    );
                    handleNumberChange(val, item[0], index);
                  }
                }}
                onChange={(e) => {
                  if (!!onOpenChange) {
                    const val = e.target.value;
                    setFocus((prev: any) =>
                      Object.assign({}, prev, {
                        [`refnum_${index}`]: !!val,
                      }),
                    );
                    handleNumberChange(val, item[0], index);
                  }
                }}
                onPressEnter={(e: any) => {
                  if (!onOpenChange) {
                    const val = e?.target?.value;
                    setFocus((prev: any) =>
                      Object.assign({}, prev, {
                        [`refnum_${index}`]: !(_.isUndefined(val) || _.isNull(val)),
                      }),
                    );
                    handleNumberChange(val, item[0], index);
                  }
                }}
              />
            ) : type === 'bool' ? (
              <SegmentSwitch
                disabled={disabled}
                className={`self_input ${className}`}
                ref={refList[index]}
                defaultValue={!!value}
                buttonColor={value ? '' : 'grey'}
                fontInBody={[
                  { label: '', value: false },
                  { label: '', value: true },
                ]}
                style={{ fontSize: 16 }}
                onChange={(checked: any) => {
                  const val = !!checked;
                  setFocus((prev: any) =>
                    Object.assign({}, prev, {
                      [`refnum_${index}`]: !(_.isUndefined(val) || _.isNull(val)),
                    }),
                  );
                  handleNumberChange(val, item[0], index);
                }}
              />
            ) : (
              <InputNumber
                disabled={disabled}
                className={`self_input ${className}`}
                ref={refList[index]}
                defaultValue={value}
                stringMode //高精度
                // precision={type === 'float' ? precision : 0}
                step={step}
                max={max}
                min={min}
                // onChange={(e) => { handleNumberChange(e, `num_${index}`, index) }}
                // onKeyUp={(e) => turnIpPOS(e, index)}
                onFocus={() =>
                  setFocus((prev: any) => Object.assign({}, prev, { [`refnum_${index}`]: true }))
                }
                onBlur={(e: any) => {
                  const valu = Number(e?.target?.value);
                  if (!_.isNaN(valu)) {
                    if (!onOpenChange) {
                      const val =
                        type === 'float'
                          ? parseFloat(e?.target?.value)
                          : parseInt(e?.target?.value);
                      setFocus((prev: any) =>
                        Object.assign({}, prev, {
                          [`refnum_${index}`]: !(_.isUndefined(val) || _.isNull(val)),
                        }),
                      );
                      handleNumberChange(val, item[0], index);
                    }
                  } else {
                    handleNumberChange(0, item[0], index);
                  }
                }}
                onPressEnter={(e: any) => {
                  const valu = Number(e?.target?.value);
                  if (!_.isNaN(valu)) {
                    if (!onOpenChange) {
                      const val =
                        type === 'float'
                          ? parseFloat(e?.target?.value)
                          : parseInt(e?.target?.value);
                      setFocus((prev: any) =>
                        Object.assign({}, prev, {
                          [`refnum_${index}`]: !(_.isUndefined(val) || _.isNull(val)),
                        }),
                      );
                      handleNumberChange(val, item[0], index);
                    }
                  } else {
                    handleNumberChange(0, item[0], index);
                  }
                }}
                onChange={(e: any) => {
                  if (!!onOpenChange) {
                    const valu = Number(e);
                    if (!_.isNaN(valu)) {
                      const val = type === 'float' ? parseFloat(e) : parseInt(e);
                      setFocus((prev: any) =>
                        Object.assign({}, prev, {
                          [`refnum_${index}`]: !(_.isUndefined(val) || _.isNull(val)),
                        }),
                      );
                      handleNumberChange(val, item[0], index);
                    } else {
                      handleNumberChange(0, item[0], index);
                    }
                  }
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Measurement;
