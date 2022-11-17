
import _ from 'lodash';

export const layoutTransform = {
  0: { i: '0', x: 0, y: 0, w: 5, h: 20, minW: 2, maxW: 10, minH: 4, maxH: 32 },
  1: { i: '1', x: 5, y: 0, w: 2, h: 10, minW: 2, maxW: 10, minH: 4, maxH: 32 },
  2: { i: '2', x: 7, y: 0, w: 2, h: 10, minW: 2, maxW: 10, minH: 4, maxH: 32 },
  3: { i: '3', x: 9, y: 0, w: 2, h: 10, minW: 2, maxW: 10, minH: 4, maxH: 32 },
  4: { i: '4', x: 5, y: 10, w: 2, h: 10, minW: 2, maxW: 10, minH: 4, maxH: 32 },
  5: { i: '5', x: 7, y: 10, w: 2, h: 10, minW: 2, maxW: 10, minH: 4, maxH: 32 },
  6: { i: '6', x: 9, y: 10, w: 2, h: 10, minW: 2, maxW: 10, minH: 4, maxH: 32 }
};
// @ts-ignore
export const isWeiChai = window.QUALITY_CCD_CONFIG.type === 'wc';

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
  default: '#4b5054'
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
      widget: 'platForm',
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
