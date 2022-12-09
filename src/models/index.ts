export default {
  namespace: 'themeStore',
  state: { theme: 'dark' },
  effects: {
    *themeAction({ payload }: any, { put }: any) {
      yield put({
        type: 'set',
        payload: { theme: payload },
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
