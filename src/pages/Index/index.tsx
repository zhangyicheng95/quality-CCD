/*
 * @name: answer
 * @author: answer
 * @Date: 2021-12-21 09:38:03
 * @description: answer
 */
import React, { useEffect, useState, useRef, useMemo } from "react";
import { Form, Input, message, Modal, notification, Spin } from "antd";
import * as _ from "lodash-es";
import styles from "./index.module.less";
import Header from "@/pages/Header";
import Slider from "@/pages/Slider";
import Footer from "@/pages/Footer";
import Content from "@/pages/Content";
import { useLocation } from "react-router-dom";

const RouterHome: React.FC<any> = (props) => {
  const [form] = Form.useForm();
  const { pathname } = useLocation();
  const { validateFields, } = form;
  const [settingVisible, setSettingVisible] = useState(false);

  const ifShowSlider = useMemo(() => {
    return ['/setting', '/history', '/control'].includes(pathname);
  }, [pathname])

  return (
    <div className={styles.reportWrap}>
      <Header onClick={() => setSettingVisible(true)} />
      <div className="box flex-box">
        {
          ifShowSlider ? null : <Slider />
        }
        <div className="content-box">
          <Content />
          {
            ifShowSlider ? null : <Footer />
          }
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
                const { ipUrl } = values;
                localStorage.setItem("ipUrl", ipUrl);
                window.location.reload();
              })
              .catch((err) => {
                const { errorFields } = err;
                _.isArray(errorFields) && message.error(`${errorFields[0]?.errors[0]} 是必填项`);
              });
          }}
          onCancel={() => {
            setSettingVisible(false);
          }}
          okText="确认"
          getContainer={false}
        >
          <div className="canvas-toolbar-setting-modal-body">
            <Form
              form={form}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 14 }}
              // layout={'vertical'}
              scrollToFirstError
            >
              <Form.Item
                name="ipUrl"
                label="服务端地址"
                initialValue={localStorage.getItem("ipUrl") || undefined}
                rules={[{ required: true, message: "服务端地址" }]}
              >
                <Input placeholder="localhost:8866" />
              </Form.Item>
            </Form>
          </div>
        </Modal>
      ) : null}
    </div>
  );
};

export default RouterHome;

// 告警提示框
const openNotificationWithIcon = (item: any) => {
  const { type = "", title = "", content = "" } = item;
  notification[type === "WARNING" ? "warning" : "error"]({
    message: title,
    description: content,
    // maxCount: 5, // 最大显示数, 超过限制时，最早的消息会被自动关闭
    duration: type === "CRITICAL" ? null : 5, // 自动关闭时间，null表示不关闭
  });
};
