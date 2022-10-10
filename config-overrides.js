/*
 * @name: answer
 * @author: answer
 * @Date: 2021-12-21 09:38:02
 * @description: answer
 */
const {
  override,
  fixBabelImports,
  addLessLoader,
  addWebpackModuleRule,
  addWebpackAlias,
  addBabelPlugins,
} = require("customize-cra");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
const { getThemeVariables } = require("antd/dist/theme");
const path = require("path");
// const AntdScssThemePlugin = require("antd-scss-theme-plugin");
// 后去去掉map文件
// process.env.GENERATE_SOURCEMAP = false

module.exports = override(
  // 默认路径设置
  addWebpackAlias({
    "@": path.resolve(__dirname, "./src"),
    "@img": path.resolve(__dirname, "./public/*"),
    "@assets": path.resolve(__dirname, "./src/assets/*"),
    "@components": path.resolve(__dirname, "./src/components"),
    "@hoc": path.resolve(__dirname, "./src/hoc"),
    "@hooks": path.resolve(__dirname, "./src/hooks"),
    "@httpClient": path.resolve(__dirname, "./src/httpClient"),
    "@pages": path.resolve(__dirname, "./src/pages"),
    "@share": path.resolve(__dirname, "./src/share"),
    "@store": path.resolve(__dirname, "./src/store"),
    "@mocks": path.resolve(__dirname, "../mocks"),
  }),
  // 处理antd样式问题
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    // style: true // //或者css, true代表运用less
  }),
  //不做打包处理配置，如直接以cdn引入的
  // addWebpackExternals({
  //     echarts: "window.echarts",
  //     // highcharts:"window.highcharts"
  // }),
  // new AntdScssThemePlugin("./src/styles/theme.scss")
  addLessLoader({
    lessOptions: {
      module: true,
      javascriptEnabled: true,
      localIdentName: "[local]--[hash:base64:5]",
      modifyVars: {
        ...getThemeVariables({
          dark: false, // 开启暗黑模式
          compact: false, // 开启紧凑模式
        }),
        // 此处定义主题，也可直接在ant.less中定义
      },
    },
  }),
  // 处理scss和less互相使用
  // This rule will only be used for converting our sass-variables to less-variables
  addWebpackModuleRule({
    test: /\.scss$/,
    issuer: /\.less$/,
    use: {
      loader: "./sassVarsToLess.js", // Change path if necessary
    },
  }),
  (config) => {
    //暴露webpack的配置
    // 去掉打包生产map 文件
    // config.devtool = config.mode === 'development' ? 'cheap-module-source-map' : false;
    if (process.env.NODE_ENV === "production") {
      config.devtool = false;
      // config.module.rules[2].oneOf.push({
      // 	test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
      // 	loader: 'file-loader'
      // });
    } else {
      // 允许访问外部的值 主要就是访问mock服务
      config.resolve.plugins = config.resolve.plugins.filter(
        (plugin) => !(plugin instanceof ModuleScopePlugin)
      );
    }
    config.output.publicPath = process.env.REACT_APP_PUBLICPATH; // `在这里插入代码片`
    return config;
  }
);
