export default {
  namespace: 'themeStore',

  state: {
    theme: 'dark',
    projectStatus: [],
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
