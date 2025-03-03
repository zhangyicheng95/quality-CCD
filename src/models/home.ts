import { delay } from '@/utils/utils';
import moment from 'moment';
import _ from 'lodash';
import { notification } from 'antd';
import openNotificationWithIcon from '@/components/openNotificationWithIcon';
import { logColors } from '@/common/constants/globalConstants';

export default {
  namespace: 'home',

  state: {
    params: {},
    started: false, // 服务是否已启动
    taskDataConnect: false, // 服务已连接
    canvasLock: false,
    bodyBoxTab: '',
    editCardID: '',
    updateTabs: [],
    logStatus: 'failed',
    logData: [],
    dataStatus: 'failed',
    historyData: {},
    stateStatus: 'failed',
    footerData: {},
    errorStatus: [],
    errorData: [],
    snapshot: {
      logStr: '',
      gridContentList: [],
      historyData: [],
      footerData: {},
      errorData: [],
    },
  },

  effects: {
    *startLoop(action: any, { call, put, select }: any) {
      while (true) {
        yield call(delay, 300);
        yield put({ type: 'takeSnapshot' });
      }
    },

    *takeSnapshot(action: any, { put, select }: any) {
      const started: boolean = yield select((state: any) => state.home.started);
      // @ts-ignore
      if (started || window.QUALITY_CCD_CONFIG.type === 'vision') {
        yield put({ type: 'snapshot' });
      }
    },

    *logConnect(action: any, { put }: any) {
      const { payload } = action;
      yield put({ type: 'set', payload });
    },

    *logMessage({ payload }: any, { put, select }: any) {
      let logData: any[] = yield select((state: any) => state.home.logData);
      logData = Array.from(new Set(logData));
      const _logData: any[] = logData.concat(payload);
      yield put({
        type: 'set',
        payload: {
          logData: _logData.slice(_logData.length - 200),
        },
      });
    },

    *dataConnect(action: any, { put }: any) {
      const { payload } = action;
      yield put({ type: 'set', payload });
    },

    *dataMessage({ payload }: any, { put, select }: any) {
      yield put({ type: 'setGridContentList', payload });
      // const imgData = Object.entries(payload).filter((res: any) => {
      //   return _.isString(res[1]) ? res[1]?.indexOf('http') > -1 : false;
      // });
      // if (imgData[0] && imgData[0][1]) {
      //   yield put({ type: 'setGridContentList', payload: { uid: payload.uid, imgData } });
      // }
    },

    *stateConnect(action: any, { put }: any) {
      const { payload } = action;
      yield put({ type: 'set', payload });
    },

    *stateMessage({ payload }: any, { put, select }: any) {
      yield put({
        type: 'set',
        payload: {
          footerData: payload,
        },
      });
    },

    *errorConnect(action: any, { put }: any) {
      const { payload } = action;
      yield put({ type: 'set', payload });
    },
    *errorMessage({ state, payload }: any, { put, select }: any) {
      const params: any[] = yield select((state: any) => state.home.params);
      const errorData: any[] = yield select((state: any) => state.home.errorData);
      errorData.length > 5 && notification.destroy();

      openNotificationWithIcon({ ...payload, params });
      const _errorData = [
        ...errorData,
        {
          ...payload,
          time: moment(payload.time).format('YYYY-MM-DD HH:mm:ss'),
          color:
            payload.level === 'error'
              ? logColors.error
              : payload.level === 'critical'
                ? logColors.critical
                : logColors.warning,
        },
      ];
      yield put({
        type: 'set',
        payload: { errorData: _errorData.slice(_errorData.length - 200) },
      });
    },
  },

  reducers: {
    set: (state: any, { payload }: any) => ({ ...state, ...payload }),
    update: (state: any, { payload, key }: any) => ({ ...state, [key]: payload }),
    snapshot: (state: any) => {
      // 此处最下diff
      const snapshot = state.snapshot;
      const diffObj = (a: any, b: any) => {
        return JSON.stringify(a) !== JSON.stringify(b);
      };
      const diff = () => {
        if (_.cloneDeep(state.logData).join('<br/>') !== snapshot.logStr) {
          return true;
        }
        if (!_.isEqual(state.gridContentList, snapshot.gridContentList)) {
          return true;
        }
        // if (diffObj(state.historyData, snapshot.historyData)) {
        //   return true;
        // }
        if (diffObj(state.footerData, snapshot.footerData)) {
          return true;
        }
        if (diffObj(state.errorData, snapshot.errorData)) {
          return true;
        }
        return false;
      };
      // 如果数据没有变更 则不在进行数据copy 防止重复渲染
      if (diff()) {
        return {
          ...state,
          snapshot: {
            ...state.snapshot,
            logStr: state.logData,
            historyData: state.historyData,
            gridContentList: state.gridContentList,
            footerData: state.footerData,
            errorData: state.errorData,
          },
        };
      }
      return state;
    },
    setGridContentList: (state: any, { payload }: any) => {
      const prev = state.gridContentList;
      const gridContentList = prev?.map?.((item: any) => {
        if (item.key === payload.uid && !_.isUndefined(payload?.[item?.value?.[1]])) {
          return {
            ...item,
            ...payload,
          };
        }
        return item;
      });
      return { ...state, gridContentList };
    },
    setHistoryData: (state: any, { payload }: any) => {
      const prev = state.historyData;
      const { uid, imgData } = payload;
      const historyData = Object.assign({}, prev, {
        [`${moment().format('YYYY-MM-DD HH:mm:ss')} ${uid}`]: imgData[0][1],
      });
      return { ...state, historyData };
    },
  },

  subscriptions: {
    socket(props: any) {
      const { dispatch, history } = props;
      history.listen((ev: any) => {
        const { pathname } = ev;
        if (pathname === '/home') {
          dispatch({ type: 'startLoop' });
          // dispatch({ type: 'startLoop', payload: true });
          // socketErrorListen.listen(dispatch);
          // socketLogListen.listen(dispatch);
          // socketDataListen.listen(dispatch);
          // socketStateListen.listen(dispatch);
        } else {
          // dispatch({ type: 'startLoop', payload: false });
        }
      });
    },
  },
};
