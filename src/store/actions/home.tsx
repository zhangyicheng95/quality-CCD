import { ACTION_TYPES } from "./action-type";

const setTab = (action: any) => {
    return {
        type: ACTION_TYPES.HOME_TAB,
        payload: { action },
    }
};

export { setTab };