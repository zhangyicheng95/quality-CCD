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
import batchStartButtonIcon from '@/assets/dashboard-imgs/batch-start-end.png';
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
    type: 'module',
  },
  {
    value: 'alertImg',
    label: '图片监视器窗口',
    icon: alertImgIcon,
    type: 'module',
  },
  {
    value: 'imgs',
    label: '图片列表窗口',
    icon: imgsIcon,
    type: 'module',
  },
  {
    value: 'imgContrast',
    label: '图片对比切换窗口',
    icon: imgContrastIcon,
    type: 'module',
  },
  {
    value: 'line',
    label: '折线趋势图窗口',
    icon: lineIcon,
    type: 'charts',
  },
  {
    value: 'point',
    label: '散点图窗口',
    icon: pointIcon,
    type: 'charts',
  },
  {
    value: 'bar',
    label: '柱状图窗口',
    icon: barIcon,
    type: 'charts',
  },
  {
    value: 'pie',
    label: '饼状图窗口',
    icon: pieIcon,
    type: 'charts',
  },
  {
    value: 'pie3D',
    label: '3D饼状图窗口',
    icon: pie3DIcon,
    type: 'charts',
  },
  {
    value: 'nightingalePie',
    label: '南丁格尔图窗口',
    icon: nightingalePieIcon,
    type: 'charts',
  },
  {
    value: 'table',
    label: '双列表格窗口',
    icon: tableIcon,
    type: 'table',
  },
  {
    value: 'table2',
    label: '通用表格窗口',
    icon: table2Icon,
    type: 'table',
  },
  {
    value: 'table3',
    label: '多分组表格窗口',
    icon: table3Icon,
    type: 'table',
  },
  {
    value: 'table4',
    label: '树形表格窗口',
    icon: table4Icon,
    type: 'table',
  },
  {
    value: 'table5',
    label: '可编辑表格窗口',
    icon: table5Icon,
    type: 'table',
  },
  {
    value: 'tableAntd',
    label: 'antd表格',
    icon: table5Icon,
    type: 'table',
  },
  {
    value: 'rangeDomain',
    label: '区域功能窗口',
    icon: rangeDomainIcon,
    type: 'module',
  },
  {
    value: 'tree',
    label: '树形窗口',
    icon: treeIcon,
    type: 'module',
  },
  {
    value: 'three',
    label: '3D窗口',
    icon: threeIcon,
    type: 'module',
  },
  {
    value: 'alert',
    label: '状态窗口',
    icon: alertIcon,
    type: 'module',
  },
  {
    value: 'timeSelect',
    label: '时间选择组件',
    icon: timeSelectIcon,
    type: 'module',
  },
  {
    value: 'button',
    label: '按钮组件',
    icon: buttonIcon,
    type: 'module',
  },
  {
    value: 'buttonInp',
    label: '参数按钮组件',
    icon: buttonIpIcon,
    type: 'module',
  },
  {
    value: 'buttonPassword',
    label: '密码按钮组件',
    icon: buttonIcon,
    type: 'module',
  },
  {
    value: 'buttonUpload',
    label: '文件路径选择组件',
    icon: buttonIcon,
    type: 'form',
  },
  {
    value: 'switchBox',
    label: '批量启停窗口',
    icon: batchStartButtonIcon,
    type: 'module',
  },
  {
    value: 'segmentSwitch',
    label: '开关组件',
    icon: buttonIcon,
    type: 'module',
  },
  {
    value: 'progress',
    label: '进度条组件',
    icon: processIcon,
    type: 'module',
  },
  {
    value: 'description',
    label: '描述窗口',
    icon: descriptionIcon,
    type: 'module',
  },
  {
    value: 'operation',
    label: '功能操作窗口',
    icon: operationIcon,
    type: 'form',
  },
  {
    value: 'operation2',
    label: '动态操作窗口',
    icon: operation2Icon,
    type: 'form',
  },
  {
    value: 'statistic',
    label: '文本展示窗口',
    icon: statisticIcon,
    type: 'module',
  },
  {
    value: 'platForm',
    label: '图片标注窗口',
    icon: platFormIcon,
    type: 'module',
  },
  {
    value: 'modal',
    label: '弹窗组件窗口',
    icon: modalIcon,
    type: 'module',
  },
  {
    value: 'iframe',
    label: 'iframe嵌套组件',
    icon: iframeIcon,
    type: 'module',
  },
  {
    value: 'rank',
    label: '排行榜窗口',
    icon: rankIcon,
    type: 'module',
  },
  {
    value: 'bodyBox',
    label: '盒子窗口',
    type: 'module',
  },
  {
    value: 'form',
    label: '自定义表单',
    type: 'form',
  },
  {
    value: 'nestForm',
    label: '嵌套表单',
    type: 'form',
  },
  {
    value: 'laminationImage',
    label: '分层图片窗口',
  },
  {
    value: 'reJudgment',
    label: '人工复判窗口',
  },
  {
    value: 'httpTable',
    label: 'http数据表格窗口',
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
  {
    value: 'fabric',
    label: '尺寸测量标注窗口',
  },
];
// 仿真涂层-背景图
export const simulatedCoatingList: any = [
  {
    value: 'bg1',
    label: '大屏背景图',
    icon: dataHomeImage,
  },
  {
    value: 'blackBg',
    label: '纯黑背景图',
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

export const APP_NAME = 'fabritor';
export const APP_VERSION = '3.0.0';
export const SCHEMA_VERSION = 3;
export const SCHEMA_VERSION_KEY = 'fabritor_schema_version';
export const LOG_PREFIX = `${APP_NAME}_log：`;

export const OBJECT_DEFAULT_CONFIG = {
  // controls
  borderColor: '#FF2222',
  borderScaleFactor: 2,
  cornerStrokeColor: '#2222',
  cornerColor: '#FF2222',
  cornerSize: 12,
  cornerStyle: 'circle',
  transparentCorners: false,
  padding: 0,
  centeredScaling: false,
  strokeUniform: true,
  paintFirst: 'stroke'
}

export const TEXTBOX_DEFAULT_CONFIG = {
  // styles
  fill: '#000000',
  fontWeight: 'normal',
  fontSize: 50,
  lineHeight: 1.30,
  textAlign: 'center',
  fontFamily: 'AlibabaPuHuiTi',
  // size
  width: 500,
  // 中文处理
  splitByGrapheme: true
}

export const FONT_PRESET_FAMILY_LIST = [
  {
    label: <span style={{ fontFamily: 'SmileySans', fontSize: 16 }}>得意黑</span>,
    value: 'SmileySans'
  },
  {
    label: <span style={{ fontFamily: '霞鹜新晰黑', fontSize: 16 }}>霞鹜新晰黑</span>,
    value: '霞鹜新晰黑'
  },
  {
    label: <span style={{ fontFamily: '霞鹜文楷', fontSize: 16 }}>霞鹜文楷</span>,
    value: '霞鹜文楷'
  },
  {
    label: <span style={{ fontFamily: '小赖字体', fontSize: 16 }}>小赖字体</span>,
    value: '小赖字体'
  },
  {
    label: <span style={{ fontFamily: '悠哉字体', fontSize: 16 }}>悠哉字体</span>,
    value: '悠哉字体'
  },
  {
    label: <span style={{ fontFamily: 'AlibabaPuHuiTi', fontSize: 16 }}>阿里巴巴普惠体</span>,
    value: 'AlibabaPuHuiTi'
  },
  {
    label: <span style={{ fontFamily: '霞鹜尚智黑', fontSize: 16 }}>霞鹜尚智黑</span>,
    value: '霞鹜尚智黑'
  },
  {
    label: <span style={{ fontFamily: 'SourceHanSans', fontSize: 16 }}>思源黑体</span>,
    value: 'SourceHanSans'
  },
  {
    label: <span style={{ fontFamily: 'SourceHanSerif', fontSize: 16 }}>思源宋体</span>,
    value: 'SourceHanSerif'
  },
  {
    label: <span style={{ fontFamily: '方正楷体', fontSize: 16 }}>方正楷体</span>,
    value: '方正楷体'
  },
  {
    label: <span style={{ fontFamily: '包图小白体', fontSize: 16 }}>包图小白体</span>,
    value: '包图小白体'
  },
  {
    label: <span style={{ fontFamily: '手写杂字体', fontSize: 16 }}>手写杂字体</span>,
    value: '手写杂字体'
  },
  {
    label: <span style={{ fontFamily: '胡晓波男神体', fontSize: 16 }}>胡晓波男神体</span>,
    value: '胡晓波男神体'
  },
  {
    label: <span style={{ fontFamily: '胡晓波骚包体', fontSize: 16 }}>胡晓波骚包体</span>,
    value: '胡晓波骚包体'
  },
  {
    label: <span style={{ fontFamily: '站酷快乐体', fontSize: 16 }}>站酷快乐体</span>,
    value: '站酷快乐体'
  },
  {
    label: <span style={{ fontFamily: '站酷文艺体', fontSize: 16 }}>站酷文艺体</span>,
    value: '站酷文艺体'
  },
  {
    label: <span style={{ fontFamily: '站酷小薇LOGO体', fontSize: 16 }}>站酷小薇LOGO体</span>,
    value: '站酷小薇LOGO体'
  }
]

export const SKETCH_ID = 'fabritor-sketch';

export const FABRITOR_CUSTOM_PROPS = [
  'id',
  'fabritor_desc',
  'selectable',
  'hasControls',
  'sub_type',
  'imageSource',
  'imageBorder',
  'oldArrowInfo'
];
// LOCAL
export const LOAD_FROM_LOCAL_WHEN_INIT = true;
export const AUTO_SAVE_WHEN_CHANGE = true;

// UI enhance
export const HOVER_OBJECT_CORNER = true;
export const HOVER_OBJECT_CONTROL = true;

// Image ClipPath bug?
// https://github.com/fabricjs/fabric.js/issues/5639
// but will cause low performance
export const IMAGE_CLIPPATH_QUALITY = true;

export const MAX_HISTORY_LENGTH = 100;

export const PANEL_WIDTH = 360;
export const SETTER_WIDTH = 280;

export const CAPTURE_SUBTARGET_WHEN_DBLCLICK = false;

export const LOAD_JSON_IGNORE_LOAD_FONT = false;
export const ROTATE_SVG = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg t="1699434105329" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6530" width="32" height="32" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M508.018 995.557c-269.887 0-488.675-218.785-488.675-488.675S238.13 18.206 508.018 18.206s488.676 218.787 488.676 488.676c0 269.89-218.788 488.675-488.676 488.675z m0-885.723c-219.283 0-397.048 177.763-397.048 397.048 0 219.284 177.765 397.05 397.048 397.05 219.285 0 397.049-177.766 397.049-397.05 0-219.285-177.764-397.048-397.049-397.048z m206.72 336.247h-87.822c-11.193 0-20.267-9.074-20.267-20.267s9.074-20.267 20.267-20.267h34.905c-31.736-44.89-83.812-74.31-142.994-74.31-97.007 0-175.645 78.638-175.645 175.643 0 11.194-9.074 20.267-20.267 20.267-11.192 0-20.266-9.073-20.266-20.267 0-119.391 96.786-216.177 216.178-216.177 72.505 0 136.49 35.795 175.644 90.603v-36.56c0-11.192 9.073-20.265 20.267-20.265s20.266 9.073 20.266 20.266v81.066c0 11.194-9.073 20.268-20.266 20.268z m-391.822 121.6h87.822c11.193 0 20.266 9.073 20.266 20.266 0 11.193-9.073 20.267-20.266 20.267h-35.18c31.76 44.942 84.035 74.31 143.269 74.31 97.005 0 175.644-78.638 175.644-175.644 0-11.193 9.073-20.266 20.267-20.266s20.266 9.073 20.266 20.266c0 119.392-96.786 216.179-216.177 216.179-72.597 0-136.54-35.95-175.645-90.892v36.847c0 11.193-9.074 20.267-20.267 20.267-11.192 0-20.267-9.074-20.267-20.267v-81.067c0-11.193 9.075-20.266 20.268-20.266z" fill="#515151" p-id="6531"></path></svg>')}`;

export const ROTATE_SVG_ACTIVE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg t="1699434105329" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6530" width="32" height="32" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M508.018 995.557c-269.887 0-488.675-218.785-488.675-488.675S238.13 18.206 508.018 18.206s488.676 218.787 488.676 488.676c0 269.89-218.788 488.675-488.676 488.675z m0-885.723c-219.283 0-397.048 177.763-397.048 397.048 0 219.284 177.765 397.05 397.048 397.05 219.285 0 397.049-177.766 397.049-397.05 0-219.285-177.764-397.048-397.049-397.048z m206.72 336.247h-87.822c-11.193 0-20.267-9.074-20.267-20.267s9.074-20.267 20.267-20.267h34.905c-31.736-44.89-83.812-74.31-142.994-74.31-97.007 0-175.645 78.638-175.645 175.643 0 11.194-9.074 20.267-20.267 20.267-11.192 0-20.266-9.073-20.266-20.267 0-119.391 96.786-216.177 216.178-216.177 72.505 0 136.49 35.795 175.644 90.603v-36.56c0-11.192 9.073-20.265 20.267-20.265s20.266 9.073 20.266 20.266v81.066c0 11.194-9.073 20.268-20.266 20.268z m-391.822 121.6h87.822c11.193 0 20.266 9.073 20.266 20.266 0 11.193-9.073 20.267-20.266 20.267h-35.18c31.76 44.942 84.035 74.31 143.269 74.31 97.005 0 175.644-78.638 175.644-175.644 0-11.193 9.073-20.266 20.267-20.266s20.266 9.073 20.266 20.266c0 119.392-96.786 216.179-216.177 216.179-72.597 0-136.54-35.95-175.645-90.892v36.847c0 11.193-9.074 20.267-20.267 20.267-11.192 0-20.267-9.074-20.267-20.267v-81.067c0-11.193 9.075-20.266 20.268-20.266z" fill="#F50909" p-id="6531"></path></svg>')}`;

export const ROTATE_CURSOR = encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='24' height='24'>
  <defs>
    <filter id='a' width='266.7%' height='156.2%' x='-75%' y='-21.9%' filterUnits='objectBoundingBox'>
      <feOffset dy='1' in='SourceAlpha' result='shadowOffsetOuter1'/>
      <feGaussianBlur in='shadowOffsetOuter1' result='shadowBlurOuter1' stdDeviation='1'/>
      <feColorMatrix in='shadowBlurOuter1' result='shadowMatrixOuter1' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0'/>
      <feMerge>
        <feMergeNode in='shadowMatrixOuter1'/>
        <feMergeNode in='SourceGraphic'/>
      </feMerge>
    </filter>
    <path id='b' d='M1.67 12.67a7.7 7.7 0 0 0 0-9.34L0 5V0h5L3.24 1.76a9.9 9.9 0 0 1 0 12.48L5 16H0v-5l1.67 1.67z'/>
  </defs>
  <g fill='none' fill-rule='evenodd'><path d='M0 24V0h24v24z'/>
    <g fill-rule='nonzero' filter='url(#a)' transform='rotate(90 5.25 14.75)'>
      <use fill='#000' fill-rule='evenodd' xlink:href='#b'/>
      <path stroke='#FFF' d='M1.6 11.9a7.21 7.21 0 0 0 0-7.8L-.5 6.2V-.5h6.7L3.9 1.8a10.4 10.4 0 0 1 0 12.4l2.3 2.3H-.5V9.8l2.1 2.1z'/>
    </g>
  </g>
</svg>`);

export const COPY_SVG = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg t="1702138272519" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16833" width="32" height="32"><path d="M810.666667 85.333333a85.333333 85.333333 0 0 1 85.333333 85.333334v512a85.333333 85.333333 0 0 1-85.333333 85.333333h-85.333334v85.333333a85.333333 85.333333 0 0 1-85.333333 85.333334H213.333333a85.333333 85.333333 0 0 1-85.333333-85.333334V341.333333a85.333333 85.333333 0 0 1 85.333333-85.333333h85.333334V170.666667a85.333333 85.333333 0 0 1 85.333333-85.333334h426.666667z m-384 554.666667H341.333333a42.666667 42.666667 0 0 0-4.992 85.034667L341.333333 725.333333h85.333334a42.666667 42.666667 0 0 0 4.992-85.034666L426.666667 640z m384-469.333333H384v85.333333h256a85.333333 85.333333 0 0 1 85.333333 85.333333v341.333334h85.333334V170.666667z m-298.666667 298.666666H341.333333a42.666667 42.666667 0 1 0 0 85.333334h170.666667a42.666667 42.666667 0 1 0 0-85.333334z" p-id="16834" fill="#515151"></path></svg>')}`;

export const COPY_SVG_ACTIVE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg t="1702138272519" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="16833" width="32" height="32"><path d="M810.666667 85.333333a85.333333 85.333333 0 0 1 85.333333 85.333334v512a85.333333 85.333333 0 0 1-85.333333 85.333333h-85.333334v85.333333a85.333333 85.333333 0 0 1-85.333333 85.333334H213.333333a85.333333 85.333333 0 0 1-85.333333-85.333334V341.333333a85.333333 85.333333 0 0 1 85.333333-85.333333h85.333334V170.666667a85.333333 85.333333 0 0 1 85.333333-85.333334h426.666667z m-384 554.666667H341.333333a42.666667 42.666667 0 0 0-4.992 85.034667L341.333333 725.333333h85.333334a42.666667 42.666667 0 0 0 4.992-85.034666L426.666667 640z m384-469.333333H384v85.333333h256a85.333333 85.333333 0 0 1 85.333333 85.333333v341.333334h85.333334V170.666667z m-298.666667 298.666666H341.333333a42.666667 42.666667 0 1 0 0 85.333334h170.666667a42.666667 42.666667 0 1 0 0-85.333334z" p-id="16834" fill="#d81e06"></path></svg>')}`;

export const DEL_SVG = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg t="1702138440243" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19137" width="32" height="32"><path d="M853.333333 192v42.666667a21.333333 21.333333 0 0 1-21.333333 21.333333h-640a21.333333 21.333333 0 0 1-21.333333-21.333333v-42.666667a21.333333 21.333333 0 0 1 21.333333-21.333333H384V128a42.666667 42.666667 0 0 1 42.666667-42.666667h170.666666a42.666667 42.666667 0 0 1 42.666667 42.666667v42.666667h192a21.333333 21.333333 0 0 1 21.333333 21.333333zM250.453333 859.306667a85.333333 85.333333 0 0 0 85.333334 79.36h353.28a85.333333 85.333333 0 0 0 85.333333-79.36L810.666667 341.333333H213.333333z" p-id="19138" fill="#515151"></path></svg>')}`;

export const DEL_SVG_ACTIVE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg t="1702138440243" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="19137" width="32" height="32"><path d="M853.333333 192v42.666667a21.333333 21.333333 0 0 1-21.333333 21.333333h-640a21.333333 21.333333 0 0 1-21.333333-21.333333v-42.666667a21.333333 21.333333 0 0 1 21.333333-21.333333H384V128a42.666667 42.666667 0 0 1 42.666667-42.666667h170.666666a42.666667 42.666667 0 0 1 42.666667 42.666667v42.666667h192a21.333333 21.333333 0 0 1 21.333333 21.333333zM250.453333 859.306667a85.333333 85.333333 0 0 0 85.333334 79.36h353.28a85.333333 85.333333 0 0 0 85.333333-79.36L810.666667 341.333333H213.333333z" p-id="19138" fill="#d81e06"></path></svg>')}`;

export const DRAW_MODE_CURSOR = '<svg t="1701336130548" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="46063" width="16" height="16"><path d="M666.112 549.568l116.032-116.8-241.856-244.16-115.2 116.928-104.64 105.152-94.912 94.784A5667.84 5667.84 0 0 0 154.88 577.536c-19.456 19.456-30.784 31.744-36.48 36.992-10.304 10.048-19.584 21.12-27.52 32.96a198.272 198.272 0 0 0-17.088 33.088 208.64 208.64 0 0 0-17.088 42.88c-7.296 20.8-13.824 43.52-21.12 68.16-7.296 24.704-14.592 48.64-21.12 71.424a411.968 411.968 0 0 0-12.16 52.48 61.184 61.184 0 0 0 6.528 48.064 50.56 50.56 0 0 0 46.272 10.368c11.264-1.792 28.352-5.696 51.136-11.648a1664.32 1664.32 0 0 0 145.28-46.784c18.112-6.272 35.584-13.632 52.8-22.016 12.544-5.248 24.32-12.288 34.944-20.8 11.328-8.704 21.12-16.896 30.08-24.32a520.96 520.96 0 0 0 32.384-31.168l68.16-69.44c27.52-28.16 58.432-59.136 93.248-92.8l103.04-105.408z m232.064-232.384c5.632-6.08 12.928-12.992 21.12-20.8 8.128-7.808 17.856-16.896 27.52-27.328 8.96-9.472 16-20.48 21.12-32.448 4.16-10.752 6.336-22.208 6.528-33.728a202.24 202.24 0 0 0-3.2-32.448 119.872 119.872 0 0 0-8.96-27.328 272.512 272.512 0 0 0-50.304-74.56 255.04 255.04 0 0 0-60.096-49.92 205.952 205.952 0 0 0-30.784-11.648 141.568 141.568 0 0 0-35.712-5.888 112.768 112.768 0 0 0-38.08 5.248 115.52 115.52 0 0 0-38.08 20.096c-8.96 8.192-21.12 18.432-34.944 31.808-13.824 13.376-26.816 24.832-37.376 34.304l241.92 242.816c5.632-5.12 12.032-11.2 19.328-18.176z" fill="#2c2c2c" p-id="46064"></path></svg>';

export const DRAG_ICON = '<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4941" width="22" height="22"><path d="M630.57970569 637.6867208l110.35938764 236.66748681c6.20083831 13.29490805 0.44014302 29.08827497-12.84181964 35.28911328l-96.26186588 44.88164187c-13.29490805 6.20083831-29.08827497 0.45308839-35.28911329-12.84181965l-112.87079191-242.05276602-138.77450271 138.77450272c-10.36925155 10.36925155-27.17235831 10.36925155-37.54160987 0.01294537a26.56392533 26.56392533 0 0 1-7.78017501-18.78375032V147.18616969c0-14.66711861 11.88386133-26.55097995 26.55097995-26.55097996 6.60214518 0 12.97127348 2.45962272 17.86462814 6.89988899l494.18998519 449.26950715c10.84823072 9.86438163 11.65084445 26.65454302 1.78646281 37.50277374a26.56004172 26.56004172 0 0 1-17.6057205 8.6086795L630.57970569 637.6867208z" p-id="4942" fill="#2c2c2c"></path></svg>';

export const CLEAR_ICON = '<svg viewBox="64 64 896 896" focusable="false" data-icon="clear" width="1em" height="1em" fill="currentColor" aria-hidden="true"><defs><style></style></defs><path d="M899.1 869.6l-53-305.6H864c14.4 0 26-11.6 26-26V346c0-14.4-11.6-26-26-26H618V138c0-14.4-11.6-26-26-26H432c-14.4 0-26 11.6-26 26v182H160c-14.4 0-26 11.6-26 26v192c0 14.4 11.6 26 26 26h17.9l-53 305.6a25.95 25.95 0 0025.6 30.4h723c1.5 0 3-.1 4.4-.4a25.88 25.88 0 0021.2-30zM204 390h272V182h72v208h272v104H204V390zm468 440V674c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v156H416V674c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v156H202.8l45.1-260H776l45.1 260H672z"></path></svg>';

export const LOGO_ICON = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<?xml version="1.0" encoding="UTF-8"?><svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 44L12 40L16 44L20 38L24 44L28 38L32 44L36 40L40 44V20C40 11.1634 32.8366 4 24 4C15.1634 4 8 11.1634 8 20V44Z" fill="none" stroke="#000000" stroke-width="4" stroke-linejoin="round"/><path d="M19 20H21" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M31 20H33" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>')}`;