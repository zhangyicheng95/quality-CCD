import React, { useEffect, useState } from 'react';
import styles from '../../index.module.less';
import * as _ from 'lodash';
import { Button, Form, Input, InputNumber, message, Modal, Popconfirm, Select } from 'antd';
import { btnFetch } from '@/services/api';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const ModelSwitchCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let {
    dispatch,
    fontSize = 14,
    fetchType,
    xName,
    parentBodyBoxTab,
    formCustom,
    addContentList,
  } = data;
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    initList();
  }, []);
  const initList = () => {
    if (!!xName) {
      btnFetch('get', xName).then((res: any) => {
        if (!!res && res.code === 'SUCCESS') {
          const valData = Object.entries(res.data)?.reduce((pre: any, cen: any) => {
            return {
              ...pre,
              [`${parentBodyBoxTab}$$${cen[0]}`]: cen[1],
            };
          }, {});
          formCustom.setFieldsValue({
            ...valData,
          });
          setOptions(
            res.data?.list?.map((item: any) => ({
              label: item.model,
              value: item.model,
              option: item,
            })) || [],
          );
        } else {
          message.error(res?.message || '后台服务异常，请重启服务');
        }
      });
    }
  };
  const triggerUpdate = () => {
    initList();
    let ids: any = [];
    addContentList.forEach((i: any) => {
      if (i.type === 'rangeDomain') {
        ids.push(i.id);
      }
    });
    dispatch({
      type: 'home/set',
      payload: {
        updateTabs: ids,
      },
    });
  };
  // 切换
  const onChange = (model: string) => {
    if (!fetchType || !xName) return;
    btnFetch(fetchType, xName, { model }).then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        message.success('success');
        triggerUpdate();
      } else {
        message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
      }
    });
  };
  // 另存为
  const onSaveAs = () => {
    form.validateFields().then((params: any) => {
      if (!fetchType || !xName) return;
      btnFetch(fetchType, `${xName}SaveAs`, params).then((res: any) => {
        if (res && res.code === 'SUCCESS') {
          message.success('success');
          initList();
          onCancel();
        } else {
          message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
        }
      });
    });
  };
  // 保存
  const onSave = () => {
    if (!fetchType || !xName) return;
    btnFetch(fetchType, `${xName}Save`).then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        message.success('success');
        if (!_.isArray(res.data)) return;
        const valData = (res.data || [])?.reduce((pre: any, cen: any) => {
          const { name, data } = cen;
          let list = {};
          data.forEach((item: any) => {
            const { key, value } = item;
            const listName =
              key == name ? `${parentBodyBoxTab}$$${key}` : `${parentBodyBoxTab}$$${key}$$${name}`;
            list[listName] = value;
          });
          return {
            ...pre,
            ...list,
          };
        }, {});
        formCustom.setFieldsValue({
          ...valData,
        });
      } else {
        message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
      }
    });
  };
  // 删除
  const onDelete = () => {
    if (!fetchType || !xName) return;
    btnFetch(fetchType, `${xName}Delete`, {
      model: formCustom.getFieldValue(`${parentBodyBoxTab}$$model`),
    }).then((res: any) => {
      if (res && res.code === 'SUCCESS') {
        message.success('success');
        triggerUpdate();
      } else {
        message.error(res?.msg || res?.message || '后台服务异常，请重启服务');
      }
    });
  };
  const onCancel = () => {
    form.resetFields();
    setVisible(false);
  };

  return (
    <div id={`echart-${id}`} className={`${styles.modelSwitchCharts}`} style={{ fontSize }}>
      <Form form={formCustom} scrollToFirstError className="flex-box-start">
        <div className="model-switch-left">
          <div className="model-switch-left-title">
            <Form.Item
              name={`${parentBodyBoxTab}$$model`}
              label={'玻璃型号'}
              rules={[{ required: false, message: '玻璃型号' }]}
            >
              <Select
                style={{ width: '100%' }}
                options={options}
                onChange={(val, option: any) => {
                  onChange(val);
                }}
              />
            </Form.Item>
          </div>
          <div className="model-switch-left-body">
            <div className="model-switch-left-body-item flex-box">
              <Form.Item
                name={`${parentBodyBoxTab}$$length`}
                label={'产品长度'}
                style={{ width: '50%', marginBottom: 0 }}
                rules={[{ required: false, message: '产品长度' }]}
              >
                <InputNumber style={{ width: '100%' }} disabled addonAfter="mm" />
              </Form.Item>
              <Form.Item
                name={`${parentBodyBoxTab}$$width`}
                label={'产品宽度'}
                style={{ width: '50%', marginBottom: 0 }}
                rules={[{ required: false, message: '产品宽度' }]}
              >
                <InputNumber style={{ width: '100%' }} disabled addonAfter="mm" />
              </Form.Item>
            </div>
            {/* <div className="model-switch-left-body-item flex-box">
              <Form.Item
                name={`${parentBodyBoxTab}$$speed`}
                label={'流水线速度'}
                style={{ width: '50%', marginBottom: 0 }}
                rules={[{ required: false, message: '流水线速度' }]}
              >
                <InputNumber style={{ width: '100%' }} disabled addonAfter="mm" />
              </Form.Item>
            </div> */}
          </div>
          <div className="model-switch-left-control"></div>
        </div>
        <div className="model-switch-right">
          <Button
            className="model-switch-right-btn"
            size="middle"
            type="primary"
            onClick={() => {
              form.setFieldsValue({
                model: formCustom.getFieldValue(`${parentBodyBoxTab}$$model`),
                length: formCustom.getFieldValue(`${parentBodyBoxTab}$$length`),
                width: formCustom.getFieldValue(`${parentBodyBoxTab}$$width`),
              });
              setVisible(true);
            }}
          >
            另存为
          </Button>
          <Button
            className="model-switch-right-btn"
            size="middle"
            type="primary"
            onClick={() => onSave()}
          >
            保存
          </Button>
          <Popconfirm
            title="确认删除?"
            className="model-switch-right-btn"
            onConfirm={() => onDelete()}
            okText="确认"
            cancelText="取消"
          >
            <Button size="middle">删除</Button>
          </Popconfirm>
        </div>
      </Form>

      {visible ? (
        <Modal
          title={'配置另存为'}
          wrapClassName={'file-manager-modal'}
          centered
          width={500}
          open={true}
          onOk={() => {
            onSaveAs();
          }}
          onCancel={() => {
            onCancel();
          }}
        >
          <Form form={form} scrollToFirstError style={{ padding: 24 }}>
            <Form.Item
              name={'model'}
              label={'玻璃型号'}
              rules={[{ required: false, message: '玻璃型号' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name={'length'}
              label={'产品长度'}
              rules={[{ required: false, message: '产品长度' }]}
            >
              <InputNumber style={{ width: '100%' }} addonAfter="mm" />
            </Form.Item>
            <Form.Item
              name={'width'}
              label={'产品宽度'}
              rules={[{ required: false, message: '产品宽度' }]}
            >
              <InputNumber style={{ width: '100%' }} addonAfter="mm" />
            </Form.Item>
            {/* <Form.Item
              name={'speed'}
              label={'流水线速度'}
              style={{ width: '50%', marginBottom: 0 }}
              rules={[{ required: false, message: '流水线速度' }]}
            >
              <InputNumber style={{ width: '100%' }} addonAfter="mm" />
            </Form.Item> */}
          </Form>
        </Modal>
      ) : null}
    </div>
  );
};

export default ModelSwitchCharts;
