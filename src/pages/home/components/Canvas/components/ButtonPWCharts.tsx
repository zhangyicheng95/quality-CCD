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
    const { yName = '按钮', xName = '', fetchType, fetchParams = undefined, password, passwordHelp } = data;
    const [form] = Form.useForm();
    const { validateFields, } = form;
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordvalidate, setPasswordvalidate] = useState({});

    // 执行发送指令
    const onOk = () => {
        let params = '';
        if (!_.isUndefined(fetchParams) && !_.isNull(fetchParams) && (_.isString(fetchParams) && !!fetchParams)) {
            try {
                params = JSON.parse(fetchParams)
            } catch (e) {
                console.log('密码按钮传递参数格式不对:', e);
                message.error('传递参数 格式不正确');
                params = '';
            }
        }
        btnFetch(fetchType, xName, params).then((res: any) => {
            if (!!res && res.code === 'SUCCESS') {
                message.success('success');
                setPasswordVisible(false);
                setPasswordvalidate({});
                form.resetFields();
            } else {
                message.error(res?.message || '接口异常');
            }
        });
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
                                <Input.Password visibilityToggle={false} allowClear />
                            </Form.Item>
                        </Form>
                    </Modal>
                    : null
            }
        </div>
    );

};

export default ButtonPWCharts;