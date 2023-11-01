import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import { Alert, message, Tabs } from 'antd';
import React, { useState } from 'react';
import { ProFormCaptcha, ProFormCheckbox, ProFormText, LoginForm } from '@ant-design/pro-form';
import { useIntl, history, FormattedMessage, SelectLang, useModel } from 'umi';
import Footer from '@/components/Footer';
import { login } from '@/services/api';
import { getFakeCaptcha } from '@/services/ant-design-pro/login';

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
  const { initialState, setInitialState } = useModel('@@initialState');
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s: any) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      // 登录
      const { password, ...rest } = values;
      const res: any = await login({
        password: cryptoEncryption(password),
        ...rest,
      });
      if (res?.code === 'SUCCESS') {
        message.success('登录成功！');
        localStorage.setItem('userInfo', JSON.stringify(Object.assign({},
          res?.data,
          { loginTime: new Date().getTime() },
          // res?.data?.auth === 'superAdmin' ? {
          //   authList: Object.keys(authorToChinese)
          // } : {}
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
        // history.push(redirect || '/home');s
        location.href = location.href?.split('#/')?.[0] + '#/home';
        window.location.reload();
        return;
        // }
        // console.log(msg);
        // 如果失败去设置用户错误信息
        // setUserLoginState(msg);
      } else {
        message.error(res?.message || '接口异常');
      }
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      message.error(defaultLoginFailureMessage);
    }
  };
  const { status, type: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      <div className={"lang"} data-lang>
        {SelectLang && <SelectLang
          postLocalesData={(list: any) => {
            return list.filter((i: any) => ["en-US", "zh-CN", "zh-TW"].includes(i.lang)) || [];
          }}
        />}
      </div>
      <div className={"content"}>
        <LoginForm
          logo={<img alt="logo" src="/favicon.ico" />}
          title="通用型视觉大屏"
          subTitle={" "}
          initialValues={{
            autoLogin: false,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          {status === 'error' && loginType === 'account' && (
            <LoginMessage
              content={'账户或密码错误(admin/1234)'}
            />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                name="userName"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={"prefixIcon"} />,
                }}
                placeholder={'用户名: admin'}
                rules={[
                  {
                    required: true,
                    message: "请输入用户名!",
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={"prefixIcon"} />,
                }}
                placeholder={'密码: 1234'}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
            </>
          )}

          {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误" />}
          {type === 'mobile' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined className={"prefixIcon"} />,
                }}
                name="mobile"
                placeholder={'手机号'}
                rules={[
                  {
                    required: true,
                    message: "请输入手机号！",
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: "手机号格式错误！",
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={"prefixIcon"} />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder={'请输入验证码'}
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return `${count} 获取验证码`;
                  }
                  return '获取验证码';
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: "请输入验证码！",
                  },
                ]}
                onGetCaptcha={async (phone) => {
                  const result = await getFakeCaptcha({
                    phone,
                  });
                  if (result === false) {
                    return;
                  }
                  message.success('获取验证码成功！验证码为：1234');
                }}
              />
            </>
          )}
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
