import React, { useState } from 'react';
import styles from '../index.module.less';
import * as _ from 'lodash';
import { Button, Form, Input, message, Modal } from 'antd';
import { btnFetch } from '@/services/api';

interface Props {
    data: any,
    id: any,
    onClick?: any,
}

const ButtonPWCharts: React.FC<Props> = (props: any) => {
    const { data = {}, id, } = props;
    const { yName = '默认按钮', xName = '', fetchType, fetchParams, password, passwordHelp } = data;
    const [form] = Form.useForm();
    const { validateFields, } = form;
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordvalidate, setPasswordvalidate] = useState({});

    // 执行发送指令
    const onOk = () => {
        btnFetch(fetchType, xName, fetchParams);
        setPasswordVisible(false);
        setPasswordvalidate({});
        form.resetFields();
    };

    return (
        <div
            id={`echart-${id}`}
            className={`${styles.buttonCharts} flex-box`}
        >
            <Button type="primary" onClick={() => setPasswordVisible(true)}>{yName}</Button>

            {
                // 密码框
                !!passwordVisible ?
                    <Modal
                        title={`请输入密码`}
                        wrapClassName="button-password-modal"
                        centered
                        open={!!passwordVisible}
                        maskClosable={false}
                        destroyOnClose
                        onOk={() => {
                            validateFields().then(values => {
                                if (values?.password === password) {
                                    onOk();
                                } else {
                                    message.error('密码错误');
                                    setPasswordvalidate({
                                        validateStatus: "error",
                                        help: !!passwordHelp ? passwordHelp : "密码错误，请重试"
                                    });
                                }
                            });
                        }}
                        onCancel={() => setPasswordVisible(false)}
                    >
                        <Form form={form} scrollToFirstError >
                            <Form.Item
                                name="password"
                                label="密码"
                                rules={[{ required: true, message: '请输入密码' }]}
                                {...passwordvalidate}
                            >
                                <Input allowClear />
                            </Form.Item>
                        </Form>
                    </Modal>
                    : null
            }
        </div>
    );

};

export default ButtonPWCharts;