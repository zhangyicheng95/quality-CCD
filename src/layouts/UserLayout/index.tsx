/**
 *  用户登录模块
 */
import React, {useEffect, useState, useRef} from 'react';
import {withRouter, RouteComponentProps} from 'react-router-dom';
import useOEM from "@/hooks/useOEM";
import {message} from "antd";
import {useSetRecoilState} from "recoil";
import CurrentUser from "@/store/CurrentUser";
import {get, post} from "@gaopeng123/fetch";
import JSEncrypt from 'jsencrypt';
import '@gaopeng123/login-module';
import {LoginModuleProps} from '@gaopeng123/login-module';
import './styles.less';

const publicKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANL378k3RiZHWx5AfJqdH9xRNBmD9wGD2iRe41HdTNF8RUhNnHit5NpMNtGL0NPTSSpPjjI1kJfVorRvaQerUgkCAwEAAQ==';

// @ts-ignore
const encryptor = new JSEncrypt();// 设置公钥
encryptor.setPublicKey(publicKey); // 设置公钥

const headers = {
    clientId: 'sx-vision',
    secret: 'c6b6ee7eb5173a0cbd17cf6b2a5d72f4',
    'Content-Type': 'application/json',
};

const UserLayout: React.FC<LoginModuleProps & RouteComponentProps> = (props: any) => {
    /**
     * oem数据消费
     */
    const loginName = useOEM('loginName');
    /**
     * form表单
     */
    const form = useRef<HTMLFormElement>();
    /**
     * 验证码信息
     */
    const [captcha, setCaptcha] = useState<any>(null);
    /**
     * 参数信息
     */
    const [params, setParams] = useState<any>(null);


    // 登录后将用户信息缓存到全局变量里面
    // 登录 菜单管理模块 处理第一次跳转的重定向问题
    const login = () => {
        setTimeout(() => {
            props.history.push({
                pathname: `/`,
            });
        }, 10);
    };

    /**
     * 保存用户登录信息
     */
    const setCurrentUser = useSetRecoilState(CurrentUser);

    /**
     * 菜单的第一项 默认为初始页面
     */
    useEffect(() => {
        params && captcha && post('/api/nebula/auth/token/v1/shrLogin', {
            headers: headers,
            body: Object.assign({imageId: captcha?.imageId}, params, {password: encryptor.encrypt(params.password)})
        }).then((res) => {
            if (res.code === 200) {
                setCurrentUser(Object.assign({name: res.data?.name, token: res?.data['access_token']}, res.data));
                login();
            } else {
                message.warn(res.msg);
            }
        })
    }, [params, captcha]);

    useEffect(() => {
        const getCaptcha = () => {
            get('/api/nebula/auth/token/v1/captcha', {
                params: {
                    width: 80,
                    height: 30
                },
                headers: headers
            }).then((res: any) => {
                setCaptcha(res);
            })
        };

        getCaptcha();

        const onFinish = (data: any) => {
            setParams(Object.assign(params || {}, data?.detail?.data));
        };

        form?.current?.addEventListener('captchaClick', getCaptcha);

        form?.current?.addEventListener('submit', onFinish);

        return () => {
            form?.current?.removeEventListener('captchaClick', getCaptcha);
            form?.current?.removeEventListener('captchaClick', onFinish);
        }
    }, []);


    return (
        <login-module
            // @ts-ignore
            ref={form}
            title={loginName}
            user="username"
            password="password"
            captcha="inputCode"
            captchasrc={captcha?.image}
            id="form"
            main-style={`background-image: url(/img/bg.jpg);`}
            body-style="right: 200px;"
        >
        </login-module>
    );
};

export default withRouter(UserLayout);
