import { legacy_createStore as createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import allReducers from "./reducers";

export default createStore(allReducers, applyMiddleware(thunk));
