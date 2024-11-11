import { InputNumber } from 'antd';
import { useEffect, useState } from 'react';

const SizeInput = (props: any) => {
  const { prefixText, ...rest } = props;

  return (
    <InputNumber
      prefix={
        <span
          style={{ color: 'rgba(0, 0, 0, 0.5)', marginRight: 4 }}
        >
          {prefixText || '宽'}
        </span>
      }
      controls={false}
      changeOnBlur
      min={50}
      max={8000}
      style={{ flex: 1 }}
      {...rest}
    />
  )
}

// @TODO preset size
export default function SizeSetter(props: any) {
  const { value, onChange } = props;
  const [innerValue, setInnerValue] = useState<number[]>([]);

  const handleChange = (v: any, index: any) => {
    const _innerValue = [...innerValue];
    _innerValue[index] = v;
    onChange?.(_innerValue);
  }

  useEffect(() => {
    setInnerValue(value);
  }, [value]);

  return (
    <div className='flex-box' style={{ gap: 8 }}>
      <SizeInput value={innerValue?.[0]} onChange={(v: any) => { handleChange(v, 0) }} />
      <SizeInput prefixText={'高'} value={innerValue?.[1]} onChange={(v: any) => { handleChange(v, 1) }} />
    </div>
  )
}