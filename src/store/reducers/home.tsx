import { ACTION_TYPES } from "../actions/action-type";

const initStrate = {
  homeInfo: {
    tab: '1',
  },
};

export default function homeReducer(preState = initStrate, action: any) {
  const { type, payload } = action;

  switch (type) {
    case ACTION_TYPES.HOME_TAB:
      return Object.assign({}, preState, { homeInfo: Object.assign({}, preState.homeInfo, { tab: payload }) });
    default:
      return preState;
  }
}
