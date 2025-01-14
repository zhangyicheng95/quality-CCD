import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import SettingDrawerWrapper from '@/components/SettingDrawerWrapper';
// import { SettingDrawer } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { Link } from 'umi';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import defaultSettings from '../config/defaultSettings';
import icon from '@/assets/sany-logo.svg';
import HomeLayout from '@/components/HomeLayout';
import ErrorBoundary from '@/components/ErrorBoundary';
import RightContent from './components/RightContent';
import { getParams } from './services/api';
import { message } from 'antd';
import * as _ from 'lodash';

const isDev = process.env.NODE_ENV === 'development';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  type?: any;
  settings?: Partial<LayoutSettings>;
  currentUser?: any;
  loading?: boolean;
  params?: any;
  title?: string;
  routes: any[];
  fetchUserInfo?: () => Promise<any>;
}> {
  const currentUser = {
    name: 'admin',
    avatar: '',
    userid: '',
    email: '',
    signature: '',
    title: '',
    group: '',
    tags: { key: '', label: '' },
    notifyCount: 1,
    unreadCount: 1,
    country: '',
    access: '',
    geographic: {
      province: { label: '', key: '' },
      city: { label: '', key: '' },
    },
    address: '',
    phone: '',
  };
  /***************************** iframe嵌套进去，获取所有参数值 ****************************************/
  function GetQueryObj(url: any) {
    let arr = url?.split('?') || [];
    let params = arr?.[1]?.split('&') || [];
    let obj = {};
    for (let i = 0; i < params.length; i++) {
      let param = params[i].split('=');
      obj[param[0]] = param[1];
    }
    return obj;
  }
  const query: any = GetQueryObj(window.location.hash);
  /***************************** ****************************************/
  let params: any = {};
  let title: any = '';
  const ipUrl = !!Object.keys(query).length ? query?.ipUrl || 'localhost:8866' : 'localhost:8866';
  const ipString = query?.inIframe
    ? query?.id
    : (localStorage.getItem('ipString') || query?.id) || '';
  const iframeTheme = query?.theme;
  if (!localStorage.getItem('ipString') && !!ipString) {
    localStorage.setItem('ipString', ipString);
  }
  if (!localStorage.getItem('ipUrlList')) {
    localStorage.setItem('ipUrlList', JSON.stringify([{ name: '本地服务', value: ipUrl }]));
  }
  if (!localStorage.getItem('ipUrl-history')) {
    localStorage.setItem('ipUrl-history', 'localhost:8867');
  }
  if (!localStorage.getItem('ipUrl-realtime') && !!ipUrl) {
    localStorage.setItem('ipUrl-realtime', ipUrl);
    window.location.reload();
  } else {
    if (ipString) {
      const res = await getParams(ipString || '');
      if (res && res.code === 'SUCCESS') {
        params = res?.data || {};
        title = res?.data?.quality_name || res?.data?.name;
        const { contentData = {} } = params;
        const { theme, ipList = [], showLogo, quality_icon } = contentData;
        params = ['contentData']['ipList'] = {
          ...params,
          contentData: {
            ...contentData,
            ipList: (ipList || [])?.map?.((item: any) => {
              if (item.key === res?.data?.id) {
                return {
                  ...item,
                  label: res?.data?.name,
                };
              }
              return item;
            }),
          },
        };
        if (!!showLogo && !localStorage.getItem('quality_icon') && !!quality_icon) {
          localStorage.setItem('quality_icon', quality_icon);
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
        defaultSettings.navTheme =
          (iframeTheme === 'dark' ? 'realDark' : iframeTheme) || theme || 'realDark';
      } else {
        console.log('appjs中方案信息报错: ', res);
        if (!!query?.id) {
          localStorage.removeItem('ipString');
        }
        message.error('获取方案信息接口报错，5秒钟后自动刷新');
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      }
    }
  }
  // 如果不是登录页面，执行
  // if (history.location.pathname !== loginPath) {
  //   const currentUser = await fetchUserInfo();
  //   return {
  //     fetchUserInfo,
  //     currentUser,
  //     settings: defaultSettings,
  //   };
  // }
  return {
    // @ts-ignore
    type: window.QUALITY_CCD_CONFIG.type,
    currentUser,
    routes: ['home', 'history', 'control', 'setting', 'log'],
    settings: defaultSettings,
    title,
    params,
  };
}

const BASE_IP = localStorage.getItem('ipUrl-realtime')
  ? `http://${localStorage.getItem('ipUrl-realtime')}/`
  : `http://localhost:8866/`;
const iconDom = (
  <img
    src={
      !!localStorage.getItem('quality_icon')
        ?
        // @ts-ignore
        localStorage.getItem('quality_icon')?.indexOf('http') > -1 ?
          localStorage.getItem('quality_icon')
          :
          `${BASE_IP}file_browser${localStorage.getItem('quality_icon')?.indexOf('\\') === 0 ? '' : '\\'
          }${localStorage.getItem('quality_icon')}`
        : icon
    }
    alt="logo"
  />
);

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = (props) => {
  const { initialState, setInitialState } = props;
  return Object.assign(
    initialState?.settings,
    {
      rightContentRender: () => <RightContent />,
      disableContentMargin: false,
      waterMarkProps: {
        content: initialState?.currentUser?.name,
      },
      footerRender: () => null,
      onPageChange: () => { },
      links: isDev
        ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs" key="docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
        : [],
      menuHeaderRender: undefined,
      // 自定义 403 页面
      // unAccessible: <div>unAccessible</div>,
      // 增加一个 loading 的状态
      childrenRender: (children: any, _props: any) => {
        // if (initialState?.loading) return <PageLoading />;
        return (
          // @ts-ignore
          <ErrorBoundary>
            {!_props.location?.pathname?.includes('/login') ? (
              <HomeLayout initialState={initialState} setInitialState={setInitialState}>
                {children}
              </HomeLayout>
            ) : (
              children
            )}
            {!_props.location?.pathname?.includes('/login') && (
              <SettingDrawerWrapper initialState={initialState} setInitialState={setInitialState} />
              // <SettingDrawer
              //   disableUrlParams
              //   enableDarkTheme
              //   settings={initialState?.settings}
              //   onSettingChange={(settings) => {
              //     setInitialState((preInitialState: any) => ({
              //       ...preInitialState,
              //       settings,
              //     }));
              //   }}
              // />
            )}
          </ErrorBoundary>
        );
      },
      logo: (
        _.isBoolean(initialState?.params?.contentData?.showLogo)
          ? initialState?.params?.contentData?.showLogo
          : true
      )
        ? iconDom
        : null,
      title: initialState?.title || 'UBVision',
    },
    location.hash?.indexOf('inIframe') > -1 ||
      (_.isBoolean(initialState?.params?.contentData?.showHeader) &&
        !initialState?.params?.contentData?.showHeader)
      ? {
        headerRender: () => null,
        headerHeight: 0,
      }
      : {},
  );
};
