import './index.less'
import React, { useState, useMemo } from 'react';
import { Modal, message, Form, Input } from 'antd';
import usePolling from '@/hooks/usePolling'
import moment from 'moment'
import { useLocation, history } from 'umi';
import classNames from 'classnames';

const Header: React.FC = () => {
    const [dateTimeStr, setDateTimeStr] = useState<string>('')
    const { pathname } = useLocation();
    const [form] = Form.useForm();
    const { validateFields, } = form;
    const [settingVisible, setSettingVisible] = useState(false);

    usePolling(() => {
        const now = moment()
        setDateTimeStr(now.format('yyyy年MMMDo dddd HH:mm:ss'))
    }, 500)

    const isIframe = useMemo(() => {
        return window.location.hash.indexOf('iframe') > -1;
    }, [window.location.hash]);

    if (isIframe) {
        return <div className="page-home-header-iframe">
            <span
                style={{ transform: 'scale(0.6)' }}
                onClick={() => {
                    const href = window.location.href.split('?')[0];
                    window.open(href, '_blank');
                }}
            >
                { //@ts-ignore
                    window?.QUALITY_CONFIG?.title || '视觉质检'
                }
            </span>
        </div>
    }
    return (
        <div className="page-home-header">
            <div className="left">
                <div className="date-time">{dateTimeStr}</div>
            </div>
            <div className="middle" onClick={() => setSettingVisible(true)}>
                <span>{
                    //@ts-ignore
                    window?.QUALITY_CONFIG?.title || '视觉质检'
                }</span>
            </div>
            <div className="right">
                <div
                    className={classNames("btn btn-data", { active: pathname === '/dataStatistics' })}
                    onClick={() => history.push('/dataStatistics')}
                >
                    数据统计
                </div>
                <div
                    className={classNames("btn btn1", { active: pathname === '/realtime' })}
                    onClick={() => history.push('/realtime')}
                >
                    <div className="bg1" />
                    <div className="bg2" />
                    实时结果
                </div>
                <div
                    className={classNames("btn btn2", { active: pathname === '/history' })}
                    onClick={() => history.push('/history')}
                >
                    <div className="bg1" />
                    <div className="bg2" />
                    历史查询
                </div>
            </div>
            {settingVisible ? (
                <Modal
                    className="canvas-toolbar-setting-modal"
                    visible={settingVisible}
                    title="修改服务端端口地址"
                    onOk={() => {
                        validateFields()
                            .then((values) => {
                                // localStorage.setItem("serverTitle", values['serverTitle']);
                                if (pathname === '/realtime') {
                                    localStorage.setItem("ipUrl-real", values['ipUrl-real']);
                                } else {
                                    localStorage.setItem("ipUrl-history", values['ipUrl-history']);
                                }
                                window.location.reload();
                            })
                            .catch((err) => {
                                const { errorFields } = err;
                                message.error(`${errorFields[0].errors[0]} 是必填项`);
                            });
                    }}
                    onCancel={() => {
                        setSettingVisible(false);
                    }}
                    okText="确认"
                >
                    <div className="canvas-toolbar-setting-modal-body">
                        <Form
                            form={form}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 14 }}
                            // layout={'vertical'}
                            scrollToFirstError
                        >
                            {/* <Form.Item
                                name="serverTitle"
                                label="项目名称"
                                initialValue={localStorage.getItem("serverTitle") || undefined}
                                rules={[{ required: true, message: "项目名称" }]}
                            >
                                <Input placeholder="专汽车架纵梁压铆成型检测" />
                            </Form.Item> */}
                            {
                                pathname === '/realtime' ?
                                    <Form.Item
                                        name="ipUrl-real"
                                        label="实时服务端地址"
                                        initialValue={localStorage.getItem("ipUrl-real") || undefined}
                                        rules={[{ required: true, message: "服务端地址" }]}
                                    >
                                        <Input placeholder="localhost:8888" />
                                    </Form.Item>
                                    :
                                    <Form.Item
                                        name="ipUrl-history"
                                        label="服务端地址"
                                        initialValue={localStorage.getItem("ipUrl-history") || undefined}
                                        rules={[{ required: true, message: "服务端地址" }]}
                                    >
                                        <Input placeholder="localhost:8888" />
                                    </Form.Item>
                            }
                        </Form>
                    </div>
                </Modal>
            ) : null}
        </div>
    )
}

export default Header
