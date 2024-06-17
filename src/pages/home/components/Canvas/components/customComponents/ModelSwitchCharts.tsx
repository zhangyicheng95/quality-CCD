import React, { useEffect, useState } from 'react';
import styles from '../../index.module.less';
import * as _ from 'lodash';
import { Button, Form, Input, InputNumber, message, Modal, Popconfirm, Select } from 'antd';
import { btnFetch } from '@/services/api';
import { formatJson, guid } from '@/utils/utils';
import MonacoEditor from '@/components/MonacoEditor';
import { connect } from 'umi';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const ModelSwitchCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id, started } = props;
  let {
    dataValue,
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
  const [editorVisible, setEditorVisible] = useState(false);
  const [editorValue, setEditorValue] = useState<any>({});

  useEffect(() => {
    if (!_.isUndefined(dataValue?._str) && !_.isNull(dataValue?._str)) {
      triggerUpdate();
    } else {
      initList();
    }
  }, [dataValue?._str, started]);
  const initList = () => {
    if (!!xName && started) {
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
            [`${parentBodyBoxTab}$$roi_pts`]: _.isObject(res.data['roi_pts'])
              ? formatJson(res.data['roi_pts'])
              : res.data['roi_pts'],
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
        updateTabs: ids?.concat(guid()),
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
                style={{ width: '50%' }}
                rules={[{ required: false, message: '产品长度' }]}
              >
                <InputNumber style={{ width: '100%' }} disabled addonAfter="mm" />
              </Form.Item>
              <Form.Item
                name={`${parentBodyBoxTab}$$width`}
                label={'产品宽度'}
                style={{ width: '50%' }}
                rules={[{ required: false, message: '产品宽度' }]}
              >
                <InputNumber style={{ width: '100%' }} disabled addonAfter="mm" />
              </Form.Item>
            </div>
            <div className="model-switch-left-body-item flex-box">
              <Form.Item
                name={`${parentBodyBoxTab}$$cam_num`}
                label={'相机个数'}
                style={{ width: '50%' }}
                rules={[{ required: false, message: '相机数' }]}
              >
                <InputNumber style={{ width: '100%' }} disabled addonAfter="个" />
              </Form.Item>
              <Form.Item
                name={`${parentBodyBoxTab}$$frame_num`}
                label={'相机帧数'}
                style={{ width: '50%' }}
                rules={[{ required: false, message: '相机帧数' }]}
              >
                <InputNumber style={{ width: '100%' }} disabled addonAfter="帧" />
              </Form.Item>
            </div>
            <div className="model-switch-left-body-item flex-box" style={{ marginBottom: '-24px' }}>
              <Form.Item
                name={`${parentBodyBoxTab}$$roi_pts`}
                label={'roi信息'}
                className="codeEditor"
              >
                <Input.TextArea
                  autoSize={{ maxRows: 5 }}
                  style={{ marginBottom: 8 }}
                  disabled
                  value={
                    _.isObject(form.getFieldValue(`${parentBodyBoxTab}$$roi_pts`))
                      ? formatJson(form.getFieldValue(`${parentBodyBoxTab}$$roi_pts`))
                      : form.getFieldValue(`${parentBodyBoxTab}$$roi_pts`)
                  }
                />
              </Form.Item>
            </div>
          </div>
          <div className="model-switch-left-control"></div>
        </div>
        <div className="model-switch-right">
          <Button
            className="model-switch-right-btn"
            size="middle"
            type="primary"
            onClick={() => {
              const values = Object.entries(formCustom.getFieldsValue() || {})?.reduce(
                (pre: any, cen: any) => {
                  return {
                    ...pre,
                    [cen[0].split('$$')?.[1]]: cen[1],
                  };
                },
                {},
              );
              form.setFieldsValue(values);
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
            <Form.Item
              name={'cam_num'}
              label={'相机个数'}
              rules={[{ required: false, message: '相机数' }]}
            >
              <InputNumber style={{ width: '100%' }} addonAfter="个" />
            </Form.Item>
            <Form.Item
              name={'frame_num'}
              label={'相机帧数'}
              rules={[{ required: false, message: '相机帧数' }]}
            >
              <InputNumber style={{ width: '100%' }} addonAfter="帧" />
            </Form.Item>
            <Form.Item name={'roi_pts'} label={'roi信息'} className="codeEditor">
              <Input.TextArea
                autoSize={{ maxRows: 5 }}
                style={{ marginBottom: 8 }}
                disabled
                value={
                  _.isObject(form.getFieldValue('roi_pts'))
                    ? formatJson(form.getFieldValue('roi_pts'))
                    : form.getFieldValue('roi_pts')
                }
              />
              <Button
                style={{ fontSize: 'inherit' }}
                onClick={() => {
                  const value = form.getFieldValue('roi_pts');
                  setEditorValue({
                    value: !!value
                      ? _.isObject(value)
                        ? formatJson(value)
                        : value
                      : formatJson([
                          {
                            x1_min: 1500,
                            y1_min: 1,
                            x1_max: 2500,
                            y1_max: 999,
                            x2_min: 6500,
                            y2_min: 1,
                            x2_max: 7500,
                            y2_max: 999,
                          },
                          {
                            x1_min: 1500,
                            y1_min: 1,
                            x1_max: 2500,
                            y1_max: 999,
                            x2_min: 6500,
                            y2_min: 1,
                            x2_max: 7500,
                            y2_max: 999,
                          },
                          {
                            x1_min: 6000,
                            y1_min: 1,
                            x1_max: 7000,
                            y1_max: 999,
                            x2_min: 300,
                            y2_min: 1,
                            x2_max: 1500,
                            y2_max: 999,
                          },
                          {
                            x1_min: 6000,
                            y1_min: 1,
                            x1_max: 7000,
                            y1_max: 999,
                            x2_min: 300,
                            y2_min: 1,
                            x2_max: 1500,
                            y2_max: 999,
                          },
                        ]),
                    language: 'json',
                  });
                  setEditorVisible(true);
                }}
              >
                打开编辑器
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      ) : null}

      {editorVisible ? (
        <MonacoEditor
          id={editorValue.id}
          defaultValue={editorValue.value}
          visible={editorVisible}
          onOk={(val: any) => {
            const { id, value, language } = val;
            form.setFieldsValue({ roi_pts: value });
            setEditorValue?.({});
            setEditorVisible?.(false);
          }}
          onCancel={() => {
            setEditorVisible?.(false);
          }}
        />
      ) : null}
    </div>
  );
};

export default connect(({ home, themeStore }) => ({
  started: home.started || false,
}))(ModelSwitchCharts);
