// https://umijs.org/config/
import { defineConfig } from 'umi';
import { join } from 'path';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const { REACT_APP_ENV } = process.env;
const { version } = require('../package.json');

function OutputPathName(env: string) {
  if (env) {
    return `quality-${env}`;
  }
  return 'quality';
}
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');
const APP_DIR = path.resolve(__dirname, '../src');
const MONACO_DIR = path.resolve(__dirname, '../node_modules/monaco-editor');

export default defineConfig({
  hash: true,
  history: { type: 'hash' },
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: routes,
  access: {},
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // 如果不想要 configProvide 动态设置主题需要把这个设置为 default
    // 只有设置为 variable， 才能使用 configProvide 动态设置主色调
    // https://ant.design/docs/react/customize-theme-variable-cn
    'root-entry-name': 'variable',
    'background-color-base': 'var(--multi-player-background-color)',
    'body-background': 'var(--multi-player-children-background-color)',
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  headScripts: [{ src: './env-config.js' }],
  // Fast Refresh 热更新
  fastRefresh: {},
  openAPI: [
    {
      requestLibPath: "import { request } from 'umi'",
      // 或者使用在线的版本
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
    {
      requestLibPath: "import { request } from 'umi'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'swagger',
    },
  ],
  //API 修改 webpack 配置
  chainWebpack: function (config, { webpack }) {
    config.merge({
      plugins: [
        new MonacoWebpackPlugin([
          'apex',
          'azcli',
          'bat',
          'clojure',
          'coffee',
          'cpp',
          'csharp',
          'csp',
          'css',
          'dockerfile',
          'fsharp',
          'go',
          'handlebars',
          'html',
          'ini',
          'java',
          'javascript',
          'json',
          'less',
          'lua',
          'markdown',
          'msdax',
          'mysql',
          'objective',
          'perl',
          'pgsql',
          'php',
          'postiats',
          'powerquery',
          'powershell',
          'pug',
          'python',
          'r',
          'razor',
          'redis',
          'redshift',
          'ruby',
          'rust',
          'sb',
          'scheme',
          'scss',
          'shell',
          'solidity',
          'sql',
          'st',
          'swift',
          'typescript',
          'vb',
          'xml',
          'yaml',
        ]),
      ],
      module: {
        rules: [
          {
            test: /\.css$/,
            include: APP_DIR,
            use: [
              {
                loader: 'style-loader',
              },
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  namedExport: true,
                },
              },
            ],
          },
          {
            test: /\.css$/,
            include: MONACO_DIR,
            use: ['style-loader', 'css-loader'],
          },
        ],
      },
    });
  },
  nodeModulesTransform: {
    type: 'none',
  },
  metas: [
    {
      httpEquiv: 'Cache-Control',
      content: 'no-cache',
    },
    {
      httpEquiv: 'Pragma',
      content: 'no-cache',
    },
    {
      httpEquiv: 'Expires',
      content: '0',
    },
  ],
  mfsu: {},
  webpack5: {},
  exportStatic: {},
  plugins: [],
  outputPath: 'quality',
});
