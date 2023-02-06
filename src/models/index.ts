export default {
  namespace: 'themeStore',

  state: {
    theme: 'dark',
    paramsData: {},
    projectStatus: [],
  },

  effects: {
    *themeAction({ payload }: any, { put }: any) {
      yield put({
        type: 'set',
        payload: { theme: payload },
      });
    },
    *paramsAction({ payload }: any, { put }: any) {
      yield put({
        type: 'set',
        payload: { paramsData: payload },
      });
    },
    *statusAction({ payload }: any, { put }: any) {
      yield put({
        type: 'set',
        payload: { projectStatus: payload },
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
