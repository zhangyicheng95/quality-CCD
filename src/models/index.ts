export default {
  namespace: 'themeStore',

  state: {
    theme: 'dark',
    projectStatus: [],
    projectList: [],
    legend: {},
  },

  effects: {
    *themeAction({ payload }: any, { put }: any) {
      yield put({
        type: 'set',
        payload: { theme: payload },
      });
    },
    *statusAction({ payload }: any, { put }: any) {
      yield put({
        type: 'set',
        payload: { projectStatus: payload },
      });
    },
    *projectListAction({ payload }: any, { put, select }: any) {
      const projectList: [] = yield select((state: any) => state.themeStore.projectList);
      yield put({
        type: 'set',
        payload: { projectList: projectList.concat(payload) },
      });
    },
    *shortTimeAction({ payload }: any, { put, select }: any) {
      const legend: boolean = yield select((state: any) => state.themeStore.legend);
      yield put({
        type: 'set',
        payload: { legend: Object.assign({}, legend, payload) },
      });
    },
  },

  reducers: {
    set(state: any, { payload }: any) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
