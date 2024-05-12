import _ from 'lodash';
import imgIcon from '@/assets/dashboard-imgs/img.png';
import alertImgIcon from '@/assets/dashboard-imgs/alert-img.png';
import imgsIcon from '@/assets/dashboard-imgs/imgs.png';
import imgContrastIcon from '@/assets/dashboard-imgs/img-contrast.png';
import lineIcon from '@/assets/dashboard-imgs/line.png';
import pointIcon from '@/assets/dashboard-imgs/point.png';
import barIcon from '@/assets/dashboard-imgs/bar.png';
import pieIcon from '@/assets/dashboard-imgs/pie.png';
import pie3DIcon from '@/assets/dashboard-imgs/pie3D.png';
import nightingalePieIcon from '@/assets/dashboard-imgs/nightingale.png';
import heatMapIcon from '@/assets/dashboard-imgs/heat-map.png';
import tableIcon from '@/assets/dashboard-imgs/table.png';
import table2Icon from '@/assets/dashboard-imgs/table2.png';
import table3Icon from '@/assets/dashboard-imgs/table3.png';
import table4Icon from '@/assets/dashboard-imgs/table4.png';
import table5Icon from '@/assets/dashboard-imgs/table4.png';
import rangeDomainIcon from '@/assets/dashboard-imgs/range-domain.png';
import treeIcon from '@/assets/dashboard-imgs/tree.png';
import threeIcon from '@/assets/dashboard-imgs/three.png';
import alertIcon from '@/assets/dashboard-imgs/alert.png';
import timeSelectIcon from '@/assets/dashboard-imgs/time-select.png';
import buttonIcon from '@/assets/dashboard-imgs/button.png';
import buttonIpIcon from '@/assets/dashboard-imgs/button2.png';
import processIcon from '@/assets/dashboard-imgs/process.png';
import descriptionIcon from '@/assets/dashboard-imgs/description.png';
import operationIcon from '@/assets/dashboard-imgs/operation.png';
import operation2Icon from '@/assets/dashboard-imgs/operation2.png';
import statisticIcon from '@/assets/dashboard-imgs/statistic.png';
import rankIcon from '@/assets/dashboard-imgs/rank.png';
import slider1Icon from '@/assets/dashboard-imgs/slider1.png';
import slider4Icon from '@/assets/dashboard-imgs/slider4.png';
import footer1Icon from '@/assets/dashboard-imgs/slider1.png';
import footer2Icon from '@/assets/dashboard-imgs/slider1.png';
import platFormIcon from '@/assets/dashboard-imgs/platForm.png';
import modalIcon from '@/assets/dashboard-imgs/modal.png';
import imgButtonIcon from '@/assets/dashboard-imgs/img_button.png';
import buttonImagesIcon from '@/assets/dashboard-imgs/buttonImages.png';
import iframeIcon from '@/assets/dashboard-imgs/iframe.png';
import dataHeaderImage from '@/assets/images/header-bg.png';
import dataHomeImage from '@/assets/images/home-bg.png';

export const layoutTransform = {
  0: { i: '0', x: 0, y: 0, w: 5, h: 20, minW: 2, maxW: 10, minH: 4, maxH: 32 },
  1: { i: '1', x: 5, y: 0, w: 2, h: 10, minW: 2, maxW: 10, minH: 4, maxH: 32 },
  2: { i: '2', x: 7, y: 0, w: 2, h: 10, minW: 2, maxW: 10, minH: 4, maxH: 32 },
  3: { i: '3', x: 9, y: 0, w: 2, h: 10, minW: 2, maxW: 10, minH: 4, maxH: 32 },
  4: { i: '4', x: 5, y: 10, w: 2, h: 10, minW: 2, maxW: 10, minH: 4, maxH: 32 },
  5: { i: '5', x: 7, y: 10, w: 2, h: 10, minW: 2, maxW: 10, minH: 4, maxH: 32 },
  6: { i: '6', x: 9, y: 10, w: 2, h: 10, minW: 2, maxW: 10, minH: 4, maxH: 32 },
};

// @ts-ignore
export const systemType = window?.QUALITY_CCD_CONFIG?.type;
// 自定义组件
export const windowTypeList: any = [
  // {
  //   value: 'header',
  //   label: '标头窗口',
  //   icon: headerIcon,
  // },
  {
    value: 'img',
    label: '图片窗口',
    icon: imgIcon,
  },
  {
    value: 'alertImg',
    label: '图片监视器窗口',
    icon: alertImgIcon,
  },
  {
    value: 'imgs',
    label: '图片列表窗口',
    icon: imgsIcon,
  },
  {
    value: 'imgContrast',
    label: '图片对比切换窗口',
    icon: imgContrastIcon,
  },
  {
    value: 'line',
    label: '折线趋势图窗口',
    icon: lineIcon,
  },
  {
    value: 'point',
    label: '散点图窗口',
    icon: pointIcon,
  },
  {
    value: 'bar',
    label: '柱状图窗口',
    icon: barIcon,
  },
  {
    value: 'pie',
    label: '饼状图窗口',
    icon: pieIcon,
  },
  {
    value: 'pie3D',
    label: '3D饼状图窗口',
    icon: pie3DIcon,
  },
  {
    value: 'nightingalePie',
    label: '南丁格尔图窗口',
    icon: nightingalePieIcon,
  },
  {
    value: 'table',
    label: '双列表格窗口',
    icon: tableIcon,
  },
  {
    value: 'table2',
    label: '通用表格窗口',
    icon: table2Icon,
  },
  {
    value: 'table3',
    label: '多分组表格窗口',
    icon: table3Icon,
  },
  {
    value: 'table4',
    label: '树形表格窗口',
    icon: table4Icon,
  },
  {
    value: 'table5',
    label: '可编辑表格窗口',
    icon: table5Icon,
  },
  {
    value: 'rangeDomain',
    label: '区域功能窗口',
    icon: rangeDomainIcon,
  },
  {
    value: 'tree',
    label: '树形窗口',
    icon: treeIcon,
  },
  {
    value: 'three',
    label: '3D窗口',
    icon: threeIcon,
  },
  {
    value: 'alert',
    label: '状态窗口',
    icon: alertIcon,
  },
  {
    value: 'timeSelect',
    label: '时间选择组件',
    icon: timeSelectIcon,
  },
  {
    value: 'button',
    label: '按钮组件',
    icon: buttonIcon,
  },
  {
    value: 'buttonInp',
    label: '参数按钮组件',
    icon: buttonIpIcon,
  },
  {
    value: 'buttonPassword',
    label: '密码按钮组件',
    icon: buttonIcon,
  },
  {
    value: 'buttonUpload',
    label: '文件路径选择组件',
    icon: buttonIcon,
  },
  {
    value: 'segmentSwitch',
    label: '开关组件',
    icon: buttonIcon,
  },
  {
    value: 'progress',
    label: '进度条组件',
    icon: processIcon,
  },
  {
    value: 'description',
    label: '描述窗口',
    icon: descriptionIcon,
  },
  {
    value: 'operation',
    label: '功能操作窗口',
    icon: operationIcon,
  },
  {
    value: 'operation2',
    label: '动态操作窗口',
    icon: operation2Icon,
  },
  {
    value: 'statistic',
    label: '文本展示窗口',
    icon: statisticIcon,
  },
  {
    value: 'platForm',
    label: '图片标注窗口',
    icon: platFormIcon,
  },
  {
    value: 'modal',
    label: '弹窗组件窗口',
    icon: modalIcon,
  },
  {
    value: 'iframe',
    label: 'iframe嵌套组件',
    icon: iframeIcon,
  },
  {
    value: 'rank',
    label: '排行榜窗口',
    icon: rankIcon,
  },
  {
    value: 'bodyBox',
    label: '盒子窗口',
  },
];
// 默认基础组件
export const basicWindowList: any = [
  {
    value: 'header',
    label: '数据头部',
    icon: dataHeaderImage,
  },
  {
    value: 'slider-1',
    label: '功能按钮',
    icon: slider1Icon,
  },
  {
    value: 'slider-4',
    label: '方案列表',
    icon: slider4Icon,
  },
  {
    value: 'footer-1',
    label: '日志信息',
    icon: footer1Icon,
  },
  {
    value: 'footer-2',
    label: '错误信息',
    icon: footer2Icon,
  },
];
// 定制组件
export const customWindowList: any = [
  {
    value: 'formula',
    label: '配方',
  },
  {
    value: 'orderInformation',
    label: '单号信息',
  },
  {
    value: 'equipment',
    label: '设备控制',
  },
  {
    value: 'paramControl',
    label: '生产统计',
  },
  {
    value: 'connectStatus',
    label: '模块状态',
  },
  {
    value: 'fastFunction',
    label: '便捷功能',
  },
  {
    value: 'outputArea',
    label: '出料区',
  },
  {
    value: 'equipmentInfo',
    label: '设备信息',
  },
  {
    value: 'imgButton',
    label: '图片按钮组件',
    icon: imgButtonIcon,
  },
  {
    value: 'buttonImages',
    label: '缺陷按钮组件',
    icon: buttonImagesIcon,
  },
  {
    value: 'heatMap',
    label: '热力图窗口',
    icon: heatMapIcon,
  },
  {
    value: 'rectRange',
    label: '区域分块窗口',
  },
  {
    value: 'modelSwitch',
    label: '型号切换窗口',
  },
];
// 仿真涂层-背景图
export const simulatedCoatingList: any = [
  {
    value: 'bg1',
    label: '大屏背景图',
    icon: dataHomeImage,
  },
];
export const logColors = {
  warning: 'rgba(245,160,49,1)',
  WARNING: 'rgba(245,160,49,1)',
  error: 'rgba(255,107,104,1)',
  ERROR: 'rgba(255,107,104,1)',
  critical: 'rgba(255,107,104,1)',
  CRITICAL: 'rgba(255,107,104,1)',
};
export const portTypeObj: any = {
  string: {
    color: '#165b5c',
    title: 'string数据',
    type: 'string',
  },
  int: {
    color: '#7a3f59',
    title: 'int数据',
    type: 'int',
  },
  float: {
    color: '#553a46',
    title: 'float数据',
    type: 'float',
  },
  bool: {
    color: '#7d573a',
    title: 'bool数据',
    type: 'bool',
  },
  list: {
    color: '#694256',
    title: 'list数据',
    type: 'list',
  },
  dict: {
    color: '#425e7e',
    title: '文件夹',
    type: 'dict',
  },
  'numpy.ndarray': {
    color: '#1acccf',
    title: 'num list数据',
    type: 'dict',
  },
  any: {
    color: '#a1b2c3',
    title: '任意类型',
    type: 'dict',
  },
  default: '#4b5054',
};
export const portTypeList = ['file', 'int', 'float', 'bool', 'dir'];
export const outputTypeObj: any = {
  string: [
    {
      widget: 'Input',
      title: 'Input 普通输入框',
    },
    {
      widget: 'IpInput',
      title: 'IpInput 输入框',
    },
    {
      widget: 'codeEditor',
      title: 'Code 代码编辑器',
    },
  ],
  int: [
    {
      widget: 'InputNumber',
      title: 'InputNumber 数值输入框',
    },
    {
      widget: 'Slider',
      title: 'Slider 滑块输入框',
    },
    // {
    //   widget: 'Radio',
    //   title: 'Radio 单项选择框',
    // },
  ],
  float: [
    {
      widget: 'InputNumber',
      title: 'InputNumber 数值输入框',
    },
    {
      widget: 'Slider',
      title: 'Slider 滑块输入框',
    },
  ],
  bool: [
    {
      widget: 'Switch',
      title: 'Switch 开关选择器',
    },
  ],
  'List[string]': [
    {
      widget: 'Radio',
      title: 'Radio 单项选择框',
    },
    {
      widget: 'Select',
      title: 'Select 单项选择框',
    },
    {
      widget: 'TagRadio',
      title: 'TagRadio 组合单项选择框',
    },
    {
      widget: 'MultiSelect',
      title: 'MultiSelect 多项选择框',
    },
    {
      widget: 'Checkbox',
      title: 'Checkbox 多项选择框',
    },
  ],
  // 'List[int]': [
  //   {
  //     widget: 'InputNumber',
  //     title: 'InputNumber 数值输入框',
  //   },
  //   {
  //     widget: 'Slider',
  //     title: 'Slider 滑块输入框',
  //   },
  //   {
  //     widget: 'Radio',
  //     title: 'Radio 单项选择框',
  //   },
  // ],
  File: [
    {
      widget: 'File',
      title: 'File 文件选择器',
    },
    {
      widget: 'ImageLabelField',
      title: '图片标注',
    },
    // {
    //   widget: 'Input',
    //   title: 'Input 普通输入框',
    // },
  ],
  Dir: [
    {
      widget: 'Dir',
      title: 'Dir 文件夹选择器',
    },
    // {
    //   widget: 'Input',
    //   title: 'Input 普通输入框',
    // },
  ],
};
export const typeList = [
  'Input 普通输入框',
  'IpInput 输入框',
  'InputNumber 数值输入框',
  'Slider 滑块输入框',
  'Radio 单项选择框',
  'Select 单项选择框',
  'MultiSelect 多项选择框',
  'Checkbox 多项选择框',
  'Switch 开关选择器',
  'File 文件选择器',
  'Dir 文件夹选择器',
];
export const archSize = {
  width: 140,
  height: 35,
  nodeWidth: 300,
  nodeHeight: 130,
};
/**
 # STARTING：节点正在启动中
 # FATAL：进程无法成功启动
 # RUNNING：节点正常运行中
 # ERROR: 节点运行出现异常
 # STOPPING：进程正在处理用户的停止请求
 # STOPPED：节点已经被用户主动停止，或从未启动过
 # UNKNOWN：未知状态
 * */
export const nodeStatusColor: any = {
  STARTING: '#52c41a',
  RUNNING: '#52c41a', // 'rgba(24, 144, 255, 1)',
  CREATED: '#ff4d4f',
  STOPPING: '#52c41a',
  STOPPED: '#30a2a3',
  UNKNOWN: '#ffba00',
  EXITED: '#ff4d4f',
  FATAL: '#ff4d4f',
  ERROR: '#ff4d4f',
  default: '',
};
