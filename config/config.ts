// https://umijs.org/config/
import { defineConfig } from 'umi';
import proxy from './proxy';
import routes from './routes';

const { REACT_APP_ENV, MOCK } = process.env;

export default defineConfig({
    hash: true,
    history: { type: 'hash' },
    antd: {},
    targets: {
        ie: 11,
    },
    routes,
    locale: {
        default: 'zh-CN',
        antd: true,
        baseNavigator: false,
    },
    theme: {
        'primary-color': '#16e',
        'link-color': '#16e',
        'error-color': '#e50012',
        'success-color': '#6dd400'
    },
    esbuild: {},
    title: false,
    ignoreMomentLocale: true,
    nodeModulesTransform: { type: 'none', exclude: [] },
    proxy: proxy[REACT_APP_ENV || 'dev'],
    manifest: {
        basePath: '/',
    },
    base: './',  // 打包路径
    publicPath: './',  // 资源访问路径
    headScripts: [{ src: './env-config.js' }],
    // Fast Refresh 热更新
    fastRefresh: {},
    mock: !!MOCK ? {} : false,
    define: {
        'process.env.mock': !!MOCK,
        'process.env.dev': REACT_APP_ENV === 'dev',
    }
});
