import React, { useEffect, useMemo, useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { Form, Input, message, Modal } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { btnFetch } from '@/services/api';
import { useForm } from 'antd/es/form/Form';

interface Props {
    data: any,
    id: any,
    setMyChartVisible?: any,
    onClick?: any,
}

const ModalCharts: React.FC<Props> = (props: any) => {
    const { data = {}, id, } = props;
    let { dataValue = {}, fontSize, fetchType, xName, ifFetch, ifFetchParams, } = data;
    if (process.env.NODE_ENV === 'development') {
        // dataValue = { type: 'success', title: '我是标题', content: '内容啊啊啊啊啊啊' }
    };
    const { type = '', title = '', content = '' } = dataValue;
    const [form] = useForm();
    const [open, setOpen] = useState(false);
    const ifCanEdit = useMemo(() => {
        return location.hash.indexOf('edit') > -1;
    }, [location.hash]);

    useEffect(() => {
        console.log(dataValue)
        if (Object?.keys(dataValue)?.length && !ifCanEdit) {
            setOpen(true);
        }
    }, [dataValue]);

    return (
        <div
            id={`echart-${id}`}
            className={`${styles.modalCharts} flex-box-center`}
        >
            {
                ifCanEdit ?
                    <div className='flex-box-center modal-charts-title'>
                        弹框组件
                        <div style={{ fontSize: 14, opacity: .5 }}>此框会隐藏</div>
                    </div>
                    : null
            }

            {
                !!open ?
                    <Modal
                        title={<div className='flex-box modal-charts-confirm-title-box'>
                            {
                                _.toLower(type) === 'success' ? <CheckCircleOutlined className='modal-charts-confirm-title-icon success-font' /> :
                                    _.toLower(type) === 'warning' ? <ExclamationCircleOutlined className='modal-charts-confirm-title-icon warning-font' /> :
                                        _.toLower(type) === 'error' ? <CloseCircleOutlined className='modal-charts-confirm-title-icon error-font' /> :
                                            <InfoCircleOutlined className='modal-charts-confirm-title-icon info-font' />
                            }
                            <div className="modal-charts-confirm-title">{title}</div>
                        </div>}
                        wrapClassName="modal-charts-confirm"
                        centered
                        maskClosable={false}
                        width="30vw"
                        open={open}
                        okText="确认"
                        cancelText="取消"
                        onOk={() => {
                            if (ifFetch) {
                                form.validateFields()
                                    .then((values) => {
                                        const { fetchParams } = values;
                                        if (!!fetchParams) {
                                            let params = '';
                                            try {
                                                params = JSON.parse(fetchParams);
                                                if (!!fetchType && !!xName) {
                                                    btnFetch(fetchType, xName, params || {}).then((res: any) => {
                                                        if (res && res.code === 'SUCCESS') {
                                                            message.success('上传成功');
                                                        } else {
                                                            message.error(res?.msg || res?.message || "接口异常");
                                                        };
                                                        setOpen(false)
                                                    });
                                                }
                                            } catch (e) {
                                                console.log('参数按钮传递参数格式不对:', e);
                                                message.error('传递参数 格式不正确');
                                            };
                                        } else {
                                            if (!!fetchType && !!xName) {
                                                btnFetch(fetchType, xName, '').then((res: any) => {
                                                    if (res && res.code === 'SUCCESS') {
                                                        message.success('上传成功');
                                                    } else {
                                                        message.error(res?.msg || res?.message || "接口异常");
                                                    };
                                                    setOpen(false)
                                                });
                                            }
                                        }
                                    }).catch((err) => {
                                        console.log(err);
                                    });
                            } else {
                                setOpen(false);
                            }
                        }}
                        onCancel={() => setOpen(false)}
                        destroyOnClose={true}
                    >
                        <div style={{ marginBottom: 24 }}>
                            {content}
                        </div>
                        {
                            ifFetchParams ?
                                <div style={{ width: "60%" }}>
                                    <Form form={form} scrollToFirstError>
                                        <Form.Item
                                            name={`fetchParams`}
                                            label={"传递参数"}
                                            rules={[{ required: false, message: '传递参数' }]}
                                        >
                                            <Input.TextArea
                                                size='large'
                                                autoSize={{ minRows: 6, maxRows: 10 }}
                                            />
                                        </Form.Item>
                                    </Form>
                                </div>
                                : null
                        }
                    </Modal>
                    : null
            }
        </div>
    );

};

export default ModalCharts;