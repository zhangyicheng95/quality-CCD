import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Col, Input, InputNumber, Row, Slider } from 'antd';
import styles from './index.less'

interface Props {
  disabled?: Boolean,
  value?: string,
  className?: any,
  onChange?: any,
  step: any,
  max: any,
  min: any,
  precision: any,
};

const SliderGroup: React.FC<Props> = (props: any) => {
  const { onChange = null, value = '', disabled, className, step, max, min, precision } = props;
  const [selfValue, setSelfValue] = useState<any>(0);

  useEffect(() => {
    if (!!value) {
      setSelfValue(value)
    }
  }, [value]);

  return (
    <Row className={className}>
      <Col span={16}>
        <Slider
          disabled={disabled}
          step={step}
          max={max}
          min={min}
          value={selfValue}
          onChange={(e) => onChange && onChange(e)}
        />
      </Col>
      <Col offset={1} span={7}>
        <InputNumber
          disabled={disabled}
          step={step}
          max={max}
          min={min}
          precision={precision}
          value={selfValue}
          onChange={(e) => onChange && onChange(e)}
        />
      </Col>
    </Row>
  )
};

export default SliderGroup;