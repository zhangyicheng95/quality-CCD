import { Action, StoreEnum } from './typing';

export const State = {
  dataList: [], // 首页项目列表
  flowSiderData: [], // 左侧算子栏
  flowEditorData: {}, // 获取画布数据
  flowLocalDataToCompare: {
    name: '默认项目',
    description: undefined,
    environmenuRun: undefined,
    flowData: {
      groups: [],
      nodes: [],
      edges: [],
    },
    environment: {
      serviceIp: 'localhost',
      servicePort: '18080',
    },
    zoom: 1,
  }, // 初始数据，用于返回保存时的对比
  flowLocalData: {
    groups: {},
    nodes: {},
    edges: {},
    config: {
      serviceIp: 'localhost',
      servicePort: '18080',
    },
    zoom: 1,
  }, // 本地画布数据
  terminalVisible: false, // terminal窗口
  logContent: [], // 运行日志内容
  problemContent: [], // problem
  operationLog: [], // 操作日志内容
  flowStarted: {
    normal: false,
    debugger: false,
    loading: false,
  }, // 启动业务
  flowRunningData: {}, // 画布启动信息
};

export const init = (state: any) => {
  return state;
};

export const reducer = (state: any, action: Action) => {
  switch (action.type) {
    case StoreEnum.dataList:
      return { ...state, [StoreEnum.dataList]: action.value };
    case StoreEnum.flowSiderData:
      return { ...state, [StoreEnum.flowSiderData]: action.value };
    case StoreEnum.flowEditorData:
      return { ...state, [StoreEnum.flowEditorData]: action.value };
    case StoreEnum.flowLocalDataToCompare:
      return { ...state, [StoreEnum.flowLocalDataToCompare]: action.value };
    case StoreEnum.flowLocalData:
      return {
        ...state,
        [StoreEnum.flowLocalData]: {
          ...state.flowLocalData,
          ...action.value,
        },
      };
    case StoreEnum.terminalVisible:
      return { ...state, [StoreEnum.terminalVisible]: action.value };
    case StoreEnum.logContent:
      return {
        ...state,
        [StoreEnum.logContent]: state.logContent.concat(action.value),
      };
    case StoreEnum.clearLogContent:
      return { ...state, [StoreEnum.logContent]: [] };
    case StoreEnum.problemContent:
      return {
        ...state,
        [StoreEnum.problemContent]: state.problemContent.concat(action.value),
      };
    case StoreEnum.clearProblemContent:
      return { ...state, [StoreEnum.problemContent]: [] };
    case StoreEnum.operationLog:
      return {
        ...state,
        [StoreEnum.operationLog]: state.operationLog.concat(action.value),
      };
    case StoreEnum.clearOperationLog:
      return { ...state, [StoreEnum.operationLog]: [] };
    case StoreEnum.flowStarted:
      return {
        ...state,
        [StoreEnum.flowStarted]: {
          ...state.flowStarted,
          ...action.value,
        },
      };
    case StoreEnum.flowRunningData:
      return {
        ...state,
        [StoreEnum.flowRunningData]: {
          ...state.flowRunningData,
          ...action.value,
        },
      };
    case StoreEnum.clearFlowRunningData:
      return { ...state, [StoreEnum.flowRunningData]: {} };
    case StoreEnum.resetData:
      return { ...State };
  }
};
