import React, { useEffect, useRef, useState } from 'react';
import styles from '../../index.module.less';
import * as _ from 'lodash';
import { Button, Col, Form, Input, InputNumber, message, Modal, Row, Table } from 'antd';
import CustomWindowBody from '@/components/CustomWindowBody';
import ChooseFileButton from '@/components/ChooseFileButton';
import { btnFetch } from '@/services/api';
import BasicTable from '@/components/BasicTable';
import { guid } from '@/utils/utils';

interface Props {
  data: any;
  id: any;
  onClick?: any;
}

const OrderInformationCharts: React.FC<Props> = (props: any) => {
  const { data = {}, id } = props;
  let { dataValue, titleFontSize = 24, fontSize = 24, fetchType, xName } = data;

  const [form] = Form.useForm();
  const [formData, setFormData] = useState({});
  const [visible, setVisible] = useState(false);
  const [tableDataSource, setTableDataSource] = useState([]);
  useEffect(() => {
    // if (process.env.NODE_ENV === 'development') {
    //   dataValue = {
    //     crystalRodNumber: 123123,
    //     cuttingNumber: 12312,
    //     theoreticalNumber: 2223,
    //   };
    // }
    const list = JSON.parse(localStorage.getItem(`${id}-orderInformationList`) || '[]');
    const nextInfo = list?.[0] || {};
    setFormData(dataValue || nextInfo);
  }, [dataValue]);
  const columns = [
    {
      title: '晶棒编号',
      dataIndex: 'crystalRodNumber',
      key: 'crystalRodNumber',
    },
    {
      title: '切割编号',
      dataIndex: 'cuttingNumber',
      key: 'cuttingNumber',
    },
    {
      title: '理论片数',
      dataIndex: 'theoreticalNumber',
      key: 'theoreticalNumber',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: '150px',
      render: (text: any, record: any, index: number) => {
        return (
          <Button
            type="link"
            onClick={() => {
              const centerList = JSON.parse(
                localStorage.getItem(`${id}-orderInformationList`) || '[]',
              );
              _.pullAt(centerList, index);
              localStorage.setItem(`${id}-orderInformationList`, JSON.stringify(centerList));
              setTableDataSource(centerList);
            }}
          >
            删除
          </Button>
        );
      },
    },
  ];
  const onCancel = () => {
    form.resetFields();
    setVisible(false);
  };
  const onChange = () => {
    const list = JSON.parse(localStorage.getItem(`${id}-orderInformationList`) || '[]');
    const nextInfo = list?.[0] || undefined;
    if (!!nextInfo) {
      btnFetch(fetchType, xName, { type: 'orderInfo', value: nextInfo }).then((res: any) => {
        if (!!res && res.code === 'SUCCESS') {
          _.pullAt(list, 0);
          setFormData(nextInfo);
          localStorage.setItem(`${id}-orderInformationList`, JSON.stringify(list));
        } else {
          message.error(res?.msg || res?.message || '接口异常');
        }
      });
    } else {
      message.error('无预设单号');
    }
  };

  return (
    <div
      id={`echart-${id}`}
      className={`${styles.orderInformationCharts}`}
      style={{ fontSize: titleFontSize }}
    >
      <CustomWindowBody
        title="单号信息"
        style={{ fontSize }}
        titleFontSize={titleFontSize}
        headerRight={
          <div className="flex-box">
            <Button
              type="link"
              onClick={() => {
                setVisible(true);
                const list = JSON.parse(localStorage.getItem(`${id}-orderInformationList`) || '[]');
                setTableDataSource(list);
              }}
            >
              预设单号
            </Button>
            <Button
              type="link"
              onClick={() => {
                onChange();
              }}
            >
              切换订单
            </Button>
          </div>
        }
      >
        <div className="param-control-item-box">
          {[
            { title: '晶棒编号', key: 'crystalRodNumber' },
            { title: '切割编号', key: 'cuttingNumber' },
            { title: '理论片数', key: 'theoreticalNumber' },
          ]?.map?.((item: any, index: number) => {
            const { title, key } = item;
            return (
              <div className="flex-box param-control-item" key={`param-control-item-${key}`}>
                <div className="param-control-item-title">{title} :</div>
                <div className="param-control-item-value">{formData?.[key] || 0}</div>
              </div>
            );
          })}
        </div>
      </CustomWindowBody>

      <Modal
        title={'单号预输入'}
        width="40vw"
        wrapClassName={'order-information-modal'}
        centered
        open={!!visible}
        footer={null}
        onCancel={() => onCancel()}
      >
        <div className="order-information-modal-body">
          <div className="flex-box-align-end order-information-modal-body-top">
            <div className="order-information-modal-body-top-form-box">
              <Form form={form}>
                <Form.Item
                  name={`crystalRodNumber`}
                  label={'晶棒编号'}
                  rules={[{ required: true, message: '晶棒编号' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={`cuttingNumber`}
                  label={'切割编号'}
                  rules={[{ required: true, message: '切割编号' }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name={`theoreticalNumber`}
                  label={'理论片数'}
                  initialValue={5000}
                  rules={[{ required: true, message: '理论片数' }]}
                >
                  <InputNumber min={0} />
                </Form.Item>
              </Form>
            </div>
            <div className="flex-box order-information-modal-body-top-btn-box">
              <Button
                type="primary"
                onClick={() => {
                  form
                    .validateFields()
                    .then((values: any) => {
                      const centerList = JSON.parse(
                        localStorage.getItem(`${id}-orderInformationList`) || '[]',
                      );
                      const result = centerList.concat(values);
                      localStorage.setItem(`${id}-orderInformationList`, JSON.stringify(result));
                      setTableDataSource(result);
                      form.resetFields();
                    })
                    .catch((err: any) => {
                      const { errorFields } = err;
                      errorFields?.length && message.error(`${errorFields[0]?.errors[0]} 是必填项`);
                    });
                }}
              >
                新增
              </Button>
              <Button
                type="default"
                danger
                onClick={() => {
                  form.resetFields();
                }}
              >
                删除
              </Button>
              <Button type="primary" danger onClick={() => onCancel()}>
                退出
              </Button>
            </div>
          </div>
          <div className="order-information-modal-body-bottom">
            <BasicTable
              columns={columns}
              dataSource={(tableDataSource || [])?.map?.((item: any) => ({ ...item, key: guid() }))}
              scroll={{
                y: 290,
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderInformationCharts;
