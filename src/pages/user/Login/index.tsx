import {
  DesktopOutlined,
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Alert, Button, Form, Input, message } from 'antd';
import React, { useState } from 'react';
import { ProFormText, LoginForm } from '@ant-design/pro-form';
import { history, FormattedMessage, SelectLang, useModel } from 'umi';
import Footer from '@/components/Footer';
import { login } from '@/services/api';

import styles from './index.less';
import { cryptoEncryption } from '@/utils/utils';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  // const { initialState, setInitialState } = useModel('@@initialState');
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values: any) => {
    try {
      setLoading(true);
      // 登录
      const { password, ...rest } = values;
      login({
        password: cryptoEncryption(password),
        ...rest,
      }).then((res: any) => {
        if (res?.code === 'SUCCESS') {
          message.success('登录成功！');
          localStorage.setItem('userInfo', JSON.stringify(Object.assign({},
            res?.data,
            { loginTime: new Date().getTime() },
          )));
          /** 此方法会跳转到 redirect 参数所在的位置 */
          if (!history) return;
          // await setInitialState((s: any) => ({
          //   ...s,
          //   currentUser: {
          //     name: 'admin',
          //     avatar: '',
          //     userid: '',
          //     email: '',
          //     signature: '',
          //     title: '',
          //     group: '',
          //     tags: { key: '', label: '' },
          //     notifyCount: 1,
          //     unreadCount: 1,
          //     country: '',
          //     access: '',
          //     geographic: {
          //       province: { label: '', key: '' },
          //       city: { label: '', key: '' },
          //     },
          //     address: '',
          //     phone: '',
          //     ...res?.data
          //   },
          // }));
          const { query } = history.location;
          const { redirect } = query as { redirect: string };
          // history.push(redirect || '/home');
          let hash = '';
          if (location.href?.indexOf('?') > -1) {
            hash = location.href.split('?')[1];
          }
          location.href = location.href?.split('#/')?.[0] + '#/home' + '?' + hash;
          window.location.reload();
          return;
          // }
          // console.log(msg);
          // 如果失败去设置用户错误信息
          // setUserLoginState(msg);
        } else {
          message.error(res?.message || '接口异常');
        };
        setLoading(false);
      });
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      message.error(defaultLoginFailureMessage);
    }
  };

  return (
    <div className={styles.container}>
      <div className={"lang"} data-lang>
        {SelectLang && <SelectLang
          postLocalesData={(list: any) => {
            return list.filter((i: any) => ["en-US", "zh-CN", "zh-TW"].includes(i.lang)) || [];
          }}
        />}
      </div>
      <div className="flex-box-center content">
        <div className="flex-box-center login-title">
          <img alt="logo" src="/favicon.ico" />
          <h1>通用型视觉大屏</h1>
        </div>
        <Form
          name="basic"
          form={form}
          // labelCol={{ span: 6 }}
          // wrapperCol={{ span: 16 }}
          onFinish={handleSubmit}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            label=""
            name="userName"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input prefix={<UserOutlined />} size="large" />
          </Form.Item>

          <Form.Item
            label=""
            name="password"
            rules={[{ required: true, message: '请输入正确的密码!' }]}
          >
            <Input.Password prefix={<LockOutlined />} size="large" />
          </Form.Item>
          <div className="flex-box login-footer">
            <Form.Item style={{ flex: 1 }}>
              <Button type="primary" htmlType="submit" loading={loading} size="large">
                登录
              </Button>
            </Form.Item>
            <Form.Item style={{ flex: 1 }}>
              <Button loading={loading} size="large" onClick={() => {
                location.href = location.href?.split('#/')?.[0] + '#/home';
                window.location.reload();
              }} >访客</Button>
            </Form.Item>
          </div>
        </Form>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
