import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { SettingDrawer } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { Link } from 'umi';
import RightContent from '@/components/RightContent';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import defaultSettings from '../config/defaultSettings';
import icon from '@/assets/icon.svg';
import HomeLayout from '@/components/HomeLayout';
import ErrorBoundary from '@/components/ErrorBoundary';

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
  currentUser?: API.CurrentUser;
  loading?: boolean;
  routes: Array<string>;
  fetchUserInfo?: () => Promise<any>;
}> {
  const fetchUserInfo = async () => {
    return new Promise((resolve, reject) => {
      resolve({
        name: '',
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
      })
      // try {
      //   const msg = await queryCurrentUser();
      //   return msg.data;
      // } catch (error) {

      //   history.push(loginPath);
      // }
    })
  };
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
    fetchUserInfo,
    routes: ['home', 'history', 'control', 'setting'],
    settings: defaultSettings,
  };
};

const BASE_IP = localStorage.getItem("ipUrl-history") ?
  `http://${localStorage.getItem("ipUrl-history")}/` : `http://localhost:8888/`;
const iconDom = <img src={!!localStorage.getItem('quality_icon') ?
  `${BASE_IP}file_browser${localStorage.getItem('quality_icon')?.indexOf('\\') === 0 ? '' : '\\'}${localStorage.getItem('quality_icon')}` : icon
} alt="logo" />

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    // headerRender: () => null,
    headerHeight: 80,
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => null,
    onPageChange: () => {
      // const { location } = history;
      // 如果没有登录，重定向到 login
      // if (!initialState?.currentUser && location.pathname !== loginPath) {
      //   history.push(loginPath);
      // }
    },
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
    childrenRender: (children: any, props: any) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        // @ts-ignore
        <ErrorBoundary>
          <HomeLayout>{children}</HomeLayout>
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState: any) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </ErrorBoundary>
      );
    },
    ...initialState?.settings,
    logo: iconDom,
    title: localStorage.getItem("quality_name") || 'UBVision',
  };
};
