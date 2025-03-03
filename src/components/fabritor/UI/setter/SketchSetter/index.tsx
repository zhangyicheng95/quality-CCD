import { useContext, useEffect } from 'react';
import { fabric } from 'fabric';
import { Form } from 'antd';
import ColorSetter from '../ColorSetter';
import SizeSetter from '../SizeSetter';
import { GloablStateContext } from '@/context';
import { transformColors2Fill, transformFill2Colors } from '@/utils/fabrictorUtils';

const { Item: FormItem } = Form;

export default function SketchSetter() {
  const [form] = Form.useForm();
  const { editor } = useContext<any>(GloablStateContext);

  const handleFill = (_fill: any) => {
    const { sketch, canvas } = editor;
    let fill = transformColors2Fill(_fill);
    if (typeof fill !== 'string') {
      fill = new fabric.Gradient(fill);
    }
    sketch.set('fill', fill);
    canvas.requestRenderAll();
  }

  const handleValuesChange = (values: any) => {
    console.log(values);

    Object.keys(values).forEach?.((key) => {
      if (key === 'size') {
        editor.setSketchSize({ width: values[key][0], height: values[key][1] });
      } else if (key === 'fill') {
        handleFill(values[key]);
      }
    });
    editor.fireCustomModifiedEvent();
  }

  useEffect(() => {
    if (!editor) return;
    const { sketch } = editor;
    form.setFieldsValue({
      size: [sketch.width, sketch.height],
      fill: transformFill2Colors(sketch.fill)
    });
  }, [editor]);
  return null;
  return (
    <Form
      layout="vertical"
      colon={false}
      form={form}
      onValuesChange={handleValuesChange}
    >
      <FormItem label={'画布尺寸'} name="size">
        <SizeSetter />
      </FormItem>
      <FormItem label={'画布背景色'} name="fill">
        <ColorSetter type="sketch" />
      </FormItem>
    </Form>
  );
}