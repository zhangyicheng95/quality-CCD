import { Fragment, useContext, useEffect } from 'react';
import { Divider, Form, Input, InputNumber, Radio, Switch } from 'antd';
import { GloablStateContext } from '@/context';
import ColorSetter from '../ColorSetter/Solid';
import SliderInputNumber from '@/components/fabritor/components/SliderInputNumber';
import { BORDER_TYPES, getObjectBorderType, getStrokeDashArray } from '../BorderSetter';
import { CALIPER_RULE_FORMAT } from '@/common/constants/globalConstants';

const { Item: FormItem } = Form;

const LINE_BORDER_TYPES = BORDER_TYPES.slice(1);

export default function LineSetter() {
  const { object, editor } = useContext<any>(GloablStateContext);
  const [form] = Form.useForm();

  const handleValuesChange = (values: any) => {
    const keys = Object.keys(values);
    if (!keys?.length) return;
    for (let key of keys) {
      switch (key) {
        case 'stroke':
          object.set('stroke', values[key]);
          editor.fireCustomModifiedEvent();
          break;
        case 'strokeWidth':
          object.setStrokeWidth(values[key]);
          break;
        case 'round':
          object.set('strokeLineCap', values[key] ? 'round' : 'butt');
          editor.fireCustomModifiedEvent();
          break;
        case 'type':
          object.set('strokeDashArray', getStrokeDashArray({ type: values[key], strokeWidth: object.strokeWidth }));
          editor.fireCustomModifiedEvent();
          break;
        default:
          break;
      }
    };
    object.setCoords();
    editor.canvas.requestRenderAll();
  }

  useEffect(() => {
    form.setFieldsValue({
      stroke: object.stroke || '#000000',
      type: getObjectBorderType(object),
      strokeWidth: object.strokeWidth,
      round: object.strokeLineCap === 'round',
      ...object.caliperRule
    });
  }, [object]);

  return (
    <Form
      form={form}
      onValuesChange={handleValuesChange}
      colon={false}
    >
      {
        !!object?.caliperRule && !!Object.keys?.(object?.caliperRule)?.length ?
          <Fragment>
            <FormItem
              name={'name'}
              label={'卡尺名称'}
              initialValue={object?.caliperRule || undefined}
            >
              <Input onChange={(e) => {
                const val = e?.target?.value || '';
                const realCanvas = editor.canvas?.getObjects()?.filter((i: any) => i.sub_type === object?.sub_type);
                (realCanvas || [])?.forEach?.((target: any) => {
                  target.caliperRule = {
                    ...target.caliperRule,
                    name: val
                  };
                });
              }} />
            </FormItem>
            {
              Object.entries(object?.caliperRule)?.map((item: any) => {
                return !!CALIPER_RULE_FORMAT[item[0]] ?
                  <FormItem
                    name={item[0]}
                    label={CALIPER_RULE_FORMAT[item[0]]}
                    initialValue={item[1]}
                  >
                    <InputNumber onChange={(val) => {
                      const realCanvas = editor.canvas?.getObjects()?.filter((i: any) => i.sub_type === object?.sub_type);
                      (realCanvas || [])?.forEach?.((target: any) => {
                        target.caliperRule = {
                          ...target.caliperRule,
                          [item[0]]: val
                        };
                      });
                    }} />
                  </FormItem>
                  : null
              })
            }
            <Divider />
          </Fragment>
          : null
      }
      <FormItem
        name="stroke"
        label={'颜色'}
      >
        <ColorSetter />
      </FormItem>
      <FormItem name="type" label={'样式'} labelCol={{ span: 24 }}>
        <Radio.Group>
          {
            LINE_BORDER_TYPES.map(item => (
              <Radio.Button key={item.key} value={item.key}>
                <span
                  dangerouslySetInnerHTML={{ __html: item.svg }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    marginTop: 6
                  }}
                />
              </Radio.Button>
            ))
          }
        </Radio.Group>
      </FormItem>
      <FormItem
        name="strokeWidth"
        label={'粗细'}
      >
        <SliderInputNumber
          min={1}
          max={50}
          onChangeComplete={() => { editor.fireCustomModifiedEvent(); }}
        />
      </FormItem>
      <FormItem
        name="round"
        label={'圆角'}
        valuePropName="checked"
      >
        <Switch />
      </FormItem>
    </Form>
  )
}