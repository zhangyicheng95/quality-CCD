import { Fragment, useContext, useEffect } from 'react';
import { fabric } from 'fabric';
import { Divider, Form, Input, InputNumber, Select } from 'antd';
import ColorSetter from '../ColorSetter/Solid';
import { GloablStateContext } from '@/context';

const { Item: FormItem } = Form;

export default function RoughSetter() {
  const [form] = Form.useForm();
  const { editor, object } = useContext<any>(GloablStateContext);

  const handleValuesChange = (values: any) => {
    if (values?.stroke || values?.fill) {
      Object.keys(values).forEach?.((key) => {
        if (object.type === 'path') {
          object.set('stroke', values[key]);
        } else {
          const _objects = (object as fabric.Group).getObjects();
          if (key === 'stroke') {
            _objects[1].set('stroke', values[key]);
          } else if (key === 'fill') {
            _objects[0].set('stroke', values[key]);
          }
        }
      });
      editor.canvas.requestRenderAll();
      editor.fireCustomModifiedEvent();
    } else if (!!object?.caliperRule) {
      // 代表是三基点
      const id = object?.sub_type?.split('-');
      const realCanvas = editor.canvas?.getObjects()?.filter((i: any) => i.sub_type?.indexOf(id[1]) > -1);
      (realCanvas || [])?.forEach?.((target: any) => {
        target.caliperRule = {
          ...target.caliperRule,
          ...values
        };
      });
    } else if (!!object?.measurementErrorRule) {
      // 代表是区域测量
      object.set('measurementErrorRule', {
        ...object?.measurementErrorRule,
        ...values
      });
    }
  }

  useEffect(() => {
    if (object?.sub_type) {
      if (object.type === 'path') {
        form.setFieldsValue({
          stroke: object.stroke
        });
      } else {
        const _objects = (object as fabric.Group).getObjects();
        form.setFieldsValue({
          stroke: _objects[1].stroke,
          fill: _objects[0].stroke,
          name: object?.sub_name,
        });
      }
    }
  }, [editor]);

  return (
    <Form
      colon={false}
      form={form}
      onValuesChange={handleValuesChange}
    >
      <FormItem
        name={'sub_name'}
        label={'名称'}
        initialValue={object?.sub_name || undefined}
      >
        <Input onChange={(e) => {
          const val = e?.target?.value || '';
          const realCanvas = editor.canvas?.getObjects()?.filter((i: any) => i.sub_type === object?.sub_type);
          (realCanvas || [])?.forEach?.((target: any) => {
            target.sub_name = val;
          });
        }} />
      </FormItem>
      {
        !!object?.measurementErrorRule && !!Object.keys?.(object?.measurementErrorRule)?.length ?
          <Fragment>
            <Form.Item
              name={'design_value'}
              label={'设计值'}
              initialValue={object?.measurementErrorRule?.design_value}
              rules={[{ required: false, message: '设计值' }]}
            >
              <InputNumber min={0} precision={2} />
            </Form.Item>
            <Form.Item
              name={'error_tolerance'}
              label={'报警线'}
              initialValue={object?.measurementErrorRule?.error_tolerance}
              rules={[{ required: false, message: '报警线' }]}
            >
              <InputNumber min={0} precision={2} />
            </Form.Item>
            <Form.Item
              name={'warning_tolerance'}
              label={'预警线'}
              initialValue={object?.measurementErrorRule?.warning_tolerance}
              rules={[{ required: false, message: '预警线' }]}
            >
              <InputNumber min={0} precision={2} />
            </Form.Item>
            <Form.Item
              name={'calculation_type'}
              label={'计算类型'}
              initialValue={object?.measurementErrorRule?.calculation_type}
              rules={[{ required: false, message: '计算类型' }]}
            >
              <Select options={[
                {
                  value: 'average',
                  label: '平均',
                },
                {
                  value: 'maximun',
                  label: '最大',
                },
                {
                  value: 'standard_deviation',
                  label: '标准偏差',
                },
              ]} />
            </Form.Item>
            <Form.Item
              name={'direction'}
              label={'方向'}
              initialValue={object?.measurementErrorRule?.direction}
              rules={[{ required: false, message: '方向' }]}
            >
              <Select options={[
                {
                  value: 'normal',
                  label: '正常',
                },
                {
                  value: 'x',
                  label: 'x方向',
                },
                {
                  value: 'y',
                  label: 'y方向',
                },
              ]} />
            </Form.Item>
            <Divider />
          </Fragment>
          : null
      }
      <FormItem
        label={'描边'}
        name="stroke"
      >
        <ColorSetter />
      </FormItem>
      {
        object?.type === 'group' ?
          <FormItem
            label={'填充'}
            name="fill"
          >
            <ColorSetter />
          </FormItem> : null
      }
    </Form>
  );
}