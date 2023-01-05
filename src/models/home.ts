import socketLogListen from '@/services/socketLog';
import socketDataListen from '@/services/socketData';
import socketErrorListen from '@/services/socketError';
import socketStateListen from '@/services/socketState';
import { delay } from '@/utils/utils';
import moment from 'moment';
import _ from 'lodash';
import { notification } from 'antd';
import openNotificationWithIcon from '@/components/openNotificationWithIcon';
import { logColors } from '@/common/constants/globalConstants';

export default {
  namespace: 'home',

  state: {
    started: false, // 服务是否已启动
    taskDataConnect: false, // 服务已连接
    canvasLock: false,
    activeTab: '1',
    logStatus: 'failed',
    logData: [],
    dataStatus: 'failed',
    historyData: {},
    stateStatus: 'failed',
    footerData: [],
    errorStatus: [],
    errorData: [],
    snapshot: {
      logStr: '',
      gridContentList: {},
      historyData: [],
      footerData: [],
      errorData: [],
    },
  },

  effects: {
    *startLoop(action: any, { call, put, select }: any) {
      while (true) {
        yield call(delay, 300);
        yield put({ type: 'takeSnapshot' })
      }
    },

    *takeSnapshot(action: any, { put, select }: any) {
      const started: boolean = yield select((state: any) => state.home.started);
      if (started) {
        yield put({ type: 'snapshot' });
      }
    },

    *logConnect(action: any, { put }: any) {
      const { payload } = action;
      yield put({ type: 'set', payload });
    },

    *logMessage({ payload }: any, { put, select }: any) {
      const logData: any[] = yield select((state: any) => state.home.logData);
      const _logData: any[] = [...logData, payload];
      yield put({
        type: 'set',
        payload: {
          logData: _logData.slice(_logData.length - 50),
        },
      });
    },

    *dataConnect(action: any, { put }: any) {
      const { payload } = action;
      yield put({ type: 'set', payload });
    },

    *dataMessage({ payload }: any, { put, select }: any) {
      yield put({ type: 'setGridContentList', payload });
      const imgData = Object.entries(payload).filter((res: any) => {
        return _.isString(res[1]) ? res[1].indexOf('http') > -1 : false;
      });
      if (imgData[0] && imgData[0][1]) {
        yield put({ type: 'setGridContentList', payload: { uid: payload.uid, imgData } });
      }
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
    *errorMessage({ payload }: any, { put, select }: any) {
      const errorData: any[] = yield select((state: any) => state.home.errorData);
      errorData.length > 5 && notification.destroy();
      openNotificationWithIcon(payload);
      const _errorData = [
        ...errorData,
        {
          ...payload,
          time: moment(payload.time).format('YYYY-MM-DD HH:mm:ss'),
          color:
            payload.level === 'warning'
              ? logColors.warning
              : payload.level === 'error'
              ? logColors.error
              : logColors.critical,
        },
      ];
      yield put({
        type: 'set',
        payload: { errorData: _errorData.slice(_errorData.length - 50) },
      });
    },
  },

  reducers: {
    set: (state: any, { payload }: any) => ({ ...state, ...payload }),
    update: (state: any, { payload, key }: any) => ({ ...state, [key]: payload }),
    snapshot: (state: any) => {
      return {
        ...state,
        snapshot: {
          ...state.snapshot,
          logStr: state.logData.join('<br/>'),
          historyData: state.historyData,
          gridContentList: state.gridContentList,
          footerData: state.footerData,
          errorData: state.errorData,
        },
      }
    },
    setGridContentList: (state: any, { payload }: any) => {
      const prev = state.gridContentList;
      const gridContentList = Object.entries(prev).reduce((pre: any, cen: any) => {
        return Object.assign(
          {},
          pre,
          cen[0] === payload.uid
            ? {
              [cen[0]]: Object.assign({}, cen[1], payload),
            }
            : { [cen[0]]: cen[1] },
        );
      }, {});
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
      const { dispatch, history, } = props;
      history.listen((ev: any) => {
        const { pathname } = ev;
        if (pathname === '/home') {
          dispatch({ type: 'startLoop' })
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
