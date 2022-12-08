export default {
  state: { test: 0 },
  effects: {
    *ef1({ payload }, { put }) {
      console.log('ef1', payload);
      yield put({
        type: 'set',
        payload: { test: 1 },
      });
    },
  },
  reducers: {
    set(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
