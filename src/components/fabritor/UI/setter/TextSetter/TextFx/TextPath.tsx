import { Slider, Form, Switch, Row, Col } from 'antd';
import { useEffect } from 'react';

const { Item: FormItem } = Form;

export default function TextPath(props: any) {
  const [form] = Form.useForm();
  const { value, onChange } = props;

  const handleChange = (v: any) => {
    onChange && onChange({
      ...value,
      ...v
    });
  }

  useEffect(() => {
    if (value) {
      form.setFieldsValue(value);
    }
  }, [value]);

  return (
    <Form form={form} onValuesChange={handleChange} colon={false}>
      <Row gutter={16}>
        <Col>
          <FormItem label={<span style={{ fontSize: 15, fontWeight: 'bold' }}>波浪形文字</span>} />
        </Col>
        <Col>
          <FormItem name="enable" valuePropName="checked">
            <Switch />
          </FormItem>
        </Col>
      </Row>
      <FormItem label={'偏移'} name="offset">
        <Slider
          min={-100}
          max={100}
        />
      </FormItem>
    </Form>
  )
}