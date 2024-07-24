import { Slider, InputNumber } from 'antd';
import styles from './index.less';

export default function SliderInputNumber(props: any) {
  const { min = 1, max = 100, step = 1, style, sliderProps, inputProps, onChange, onChangeComplete, value } = props;
  return (
    <div className={`flex-box ${styles.sliderInput}`} style={{ gap: 6, ...style }}>
      <Slider
        style={{ flex: 1 }}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        onAfterChange={onChangeComplete}
        value={value}
        {...sliderProps}
      />
      <InputNumber
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        value={value}
        controls={false}
        {...inputProps}
      />
    </div>
  )
}