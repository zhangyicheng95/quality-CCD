import { Button, Divider, Form, Input, InputNumber } from 'antd';
import { Fragment, useContext, useEffect } from 'react';
import { GloablStateContext } from '@/context';
import { groupSelection, ungroup } from '@/utils/helper';
import { CALIPER_RULE_FORMAT } from '@/common/constants/globalConstants';

const { Item: FormItem } = Form;

export default function GroupSetter() {
  const { object, editor } = useContext<any>(GloablStateContext);
  const [form] = Form.useForm();

  if (!object || (object.type !== 'group' && object.type !== 'activeSelection')) return null;

  const handleValuesChange = (values: any) => {
    const subs = object?.sub_type?.split('_');
    const id = subs[subs?.length - 1];
    const realCanvas = editor.canvas?.getObjects()
      ?.filter((i: any) => i?.sub_type?.indexOf(id) > -1);
    console.log(realCanvas);

    (realCanvas || [])?.forEach((target: any) => {
      target.caliperRule = {
        ...target.caliperRule,
        ...values
      };
    });
  };

  return (
    <div>
      {
        object.sub_type?.indexOf('line_result') > -1 ?
          <Fragment>
            <Form
              form={form}
              onValuesChange={handleValuesChange}
              colon={false}
            >
              <FormItem
                name={'name'}
                label={'卡尺名称'}
                initialValue={object?.caliperRule?.name || undefined}
              >
                <Input onChange={(e) => {
                  const val = e?.target?.value || '';
                  const realCanvas = editor.canvas?.getObjects()?.filter((i: any) => i.sub_type === object?.sub_type);
                  (realCanvas || [])?.forEach((target: any) => {
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
                      <InputNumber />
                    </FormItem>
                    : null
                })
              }
            </Form>
            <Divider />
          </Fragment>
          : null
      }
      {
        object.type === 'group' ?
          <Button type="primary" block onClick={() => { ungroup(editor.canvas, object); }}>取消建组</Button> :
          <Button type="primary" block onClick={() => { groupSelection(editor.canvas, object); }}>建组</Button>
      }
    </div>
  )
}