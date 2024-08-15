import { Fragment, useContext, useEffect } from 'react';
import { fabric } from 'fabric';
import { Divider, Form, Select } from 'antd';
import { GloablStateContext } from '@/context';
import ColorSetter from '../ColorSetter';
import BorderSetter, { getObjectBorderType, getStrokeDashArray } from '../BorderSetter';
import { transformColors2Fill, transformFill2Colors } from '@/utils/fabrictorUtils';
import { BASIC_POINT_RULE_FORMAT } from '@/common/constants/globalConstants';

const { Item: FormItem } = Form;

export default function ShapeSetter() {
  const { object, editor } = useContext<any>(GloablStateContext);
  const [form] = Form.useForm();

  const handleBorder = (border: any) => {
    const { type, stroke = '#000', strokeWidth, borderRadius } = border || {};
    if (type === 'none') {
      object.set({ stroke: null, strokeWidth: 1 });
    } else {
      object.set({
        stroke,
        strokeWidth,
        strokeDashArray: getStrokeDashArray({ type, strokeWidth })
      });
    }

    if (object.type === 'rect') {
      object.set({
        rx: borderRadius,
        ry: borderRadius
      });
    } else {
      object.set('strokeLineJoin', borderRadius > 0 ? 'round' : 'miter');
    }

    object.setCoords();
    editor.canvas.requestRenderAll();
  }

  const handleValuesChange = (values: any) => {
    if (values.fill) {
      let fill = transformColors2Fill(values.fill);
      if (typeof fill !== 'string') {
        fill = new fabric.Gradient(fill);
      }
      object.set('fill', fill);
      editor.canvas.requestRenderAll();
    }
    if (values.border) {
      handleBorder(values.border);
    }
  }


  useEffect(() => {
    if (object) {
      form.setFieldsValue({
        border: {
          type: getObjectBorderType(object),
          stroke: object.stroke || '#000000',
          strokeWidth: object.strokeWidth || 1,
          borderRadius: object.rx || object.ry || (object.strokeLineJoin === 'round' ? 100 : 0)
        },
        fill: transformFill2Colors(object.fill)
      });
    }
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
            {
              Object.entries(object?.caliperRule)?.map((item: any) => {
                return !!BASIC_POINT_RULE_FORMAT[item[0]] ?
                  <FormItem
                    name={item[0]}
                    label={BASIC_POINT_RULE_FORMAT[item[0]]}
                    initialValue={item[1]}
                  >
                    <Select
                      options={[
                        {
                          value: 'average',
                          label: '平均卡尺',
                        },
                        {
                          value: 'concave-convex',
                          label: '凹凸卡尺',
                        },
                      ]}
                      onChange={(val) => {
                        const id = object?.sub_type?.split('-');
                        const realCanvas = editor.canvas?.getObjects()?.filter((i: any) => i.sub_type?.indexOf(id[1]) > -1);
                        (realCanvas || [])?.forEach((target: any) => {
                          target.caliperRule = {
                            ...target.caliperRule,
                            [item[0]]: val
                          };
                        });
                      }}
                    />
                  </FormItem>
                  : null
              })
            }
            <Divider />
          </Fragment>
          : null
      }
      <FormItem name="fill" label={'颜色'}>
        <ColorSetter defaultColor="#000000" />
      </FormItem>
      <FormItem
        name="border"
        label={<span style={{ fontWeight: 'bold', fontSize: 15 }}>边框</span>}
        labelCol={{ span: 24 }}
      >
        <BorderSetter />
      </FormItem>
    </Form>
  )
}