/**
 * store类型系统定义
 */
 export enum StoreEnum {
	resetData = 'resetData', //  重置数据
	dataList = 'dataList',
	flowSiderData = 'flowSiderData', //  左侧算子栏
	flowEditorData = 'flowEditorData', //  flow数据
	flowLocalDataToCompare = 'flowLocalDataToCompare', //  初始数据，用于返回保存时的对比
	flowLocalData = 'flowLocalData', //  画布节点本地数据
	terminalVisible = 'terminalVisible', //  terminal窗口
	logContent = 'logContent', //  运行日志内容
	clearLogContent = 'clearLogContent', //  清空运行日志内容
	problemContent = 'problemContent', // problem
	clearProblemContent = 'clearProblemContent', // clear problem
	operationLog = 'operationLog', //  操作日志内容
	clearOperationLog = 'clearOperationLog', //  清空操作日志内容
	flowStarted = 'flowStarted', //  启动业务
	flowRunningData = 'flowRunningData', //  画布启动信息
	clearFlowRunningData = 'clearFlowRunningData', // 清空画布启动信息
  }
  
  export type Action = {
	type: StoreEnum;
	value?: any;
  };
  
  /**
   * StoreProps参数
   */
  export type Fn = (...args: any) => any;
  export type Props = {
	state: any;
	dispatch: Fn;
	[propName: string]: any;
  };
  