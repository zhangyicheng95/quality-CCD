import React, { useEffect, useLayoutEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  // BrowserRouter as Router, // 不再使用BrowserRouter  因为要在外部进行路由跳转 此处直接使用Router
  Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import ScreenLayout from "@/layouts/ScreenLayout";
import UserLayout from "./layouts/UserLayout";
import OEM, { oemData } from "@store/OEM";
import { BrowserHistory } from "@httpClient/toLogin";
import { unregisterFetch } from "@/httpClient";
import CurrentUser from "@store/CurrentUser";
import { isEmptyObject } from "@gaopeng123/utils";
import "./styles/ant.less";
import './global.less';
import RouterHome from "./pages/Home";
import History from "./pages/Home/components/Content/components/History";
import Control from "./pages/Home/components/Content/components/Control";

const App: React.FC<any> = (props) => {
  const setOem = useSetRecoilState(OEM);
  const currentUser = useRecoilValue(CurrentUser);
  /**
   * 检查是否登录过
   */
  const notLogged = isEmptyObject(currentUser);

  useLayoutEffect(() => {
    //在页面加载之前，配置服务端地址
    !localStorage.getItem("ipUrl") &&
      localStorage.setItem("ipUrl", "localhost:8866");
  }, []);
  useEffect(() => {
    oemData.then((res: any) => {
      setOem(res[0]?.data);
    });

    // 页面 24小时刷新一次
    setTimeout(() => {
      window.location.reload();
    }, 24 * 60 * 60 * 1000);
    // 卸载拦截器
    return unregisterFetch;
  }, []);
  // 从上到下匹配
  return (
    <Router history={BrowserHistory}>
      <Switch>
        <Route path="/" render={(routeProps) => <RouterHome {...routeProps} />} />
      </Switch>
    </Router>
  );
};

export default App;
