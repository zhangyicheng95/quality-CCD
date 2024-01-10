import React, { useEffect, useMemo, useRef } from 'react';
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
    let { dataValue = {}, fetchType, xName, ifFetch, ifFetchParams, } = data;
    if (process.env.NODE_ENV === 'development') {
        // dataValue = { type: 'success', title: '我是标题', content: '内容啊啊啊啊啊啊' }
    };
    const { type = '', title = '', content = '' } = dataValue;
    const modalListRef = useRef<any>({
        success: null,
        warning: null,
        error: null,
        info: null,
    });
    const [form] = useForm();
    const ifCanEdit = useMemo(() => {
        return location.hash.indexOf('edit') > -1;
    }, [location.hash]);

    useEffect(() => {
        if (Object?.keys(dataValue)?.length && !ifCanEdit) {
            if (modalListRef.current[title]) {
                modalListRef.current[title].update({
                    ...dataValue,
                    content: <div>
                        {content}
                        {
                            ifFetchParams ?
                                <div style={{ width: "60%", marginTop: 24 }}>
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
                    </div>
                });
            } else {
                modalListRef.current = {
                    ...modalListRef.current,
                    [title]: confirm()
                };
            }
        }
    }, [dataValue]);

    const confirm = () => {
        return Modal.confirm({
            className: "modal-charts-confirm1",
            title: title,
            width: "30vw",
            icon: _.toLower(type) === 'success' ? <CheckCircleOutlined className='modal-charts-confirm-title-icon success-font' /> :
                _.toLower(type) === 'warning' ? <ExclamationCircleOutlined className='modal-charts-confirm-title-icon warning-font' /> :
                    _.toLower(type) === 'error' ? <CloseCircleOutlined className='modal-charts-confirm-title-icon error-font' /> :
                        <InfoCircleOutlined className='modal-charts-confirm-title-icon info-font' />,
            content: <div>
                {content}
                {
                    ifFetchParams ?
                        <div style={{ width: "60%", marginTop: 24 }}>
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
            </div>,
            okText: '确认',
            cancelText: '取消',
            onOk: (close) => {
                modalListRef.current = _.omit(modalListRef.current, title);
                if (ifFetch) {
                    form.validateFields()
                        .then((values) => {
                            const { fetchParams } = values;
                            if (!!fetchParams) {
                                let params = '';
                                try {
                                    params = JSON.parse({ ...fetchParams, title });
                                    if (!!fetchType && !!xName) {
                                        btnFetch(fetchType, xName, params || { title }).then((res: any) => {
                                            if (res && res.code === 'SUCCESS') {
                                                message.success('上传成功');
                                            } else {
                                                message.error(res?.msg || res?.message || "接口异常");
                                            };
                                            form.resetFields();
                                            close();
                                        });
                                    }
                                } catch (e) {
                                    console.log('参数按钮传递参数格式不对:', e);
                                    message.error('传递参数 格式不正确');
                                };
                            } else {
                                if (!!fetchType && !!xName) {
                                    btnFetch(fetchType, xName, { title }).then((res: any) => {
                                        if (res && res.code === 'SUCCESS') {
                                            message.success('上传成功');
                                        } else {
                                            message.error(res?.msg || res?.message || "接口异常");
                                        };
                                        close();
                                    });
                                }
                            };
                        }).catch((err) => {
                            console.log(err);
                        });
                } else {
                    close();
                }
            }
        });
    };

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
        </div>
    );

};

export default ModalCharts;