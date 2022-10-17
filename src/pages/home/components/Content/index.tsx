import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.less";
import { Col, Form, Row, Table } from "antd";
import { HashRouter, Redirect, Route, Router, Switch, useLocation } from 'react-router-dom';
import Home from "./components/Home";
import History from "./components/History";
import Control from "./components/Control";
import Setting from "../Setting";


const Content: React.FC<any> = (props: any) => {
  const { errorData, leftInfo, data = {} } = props;

  return (
    <div className={styles.content}>
      <Switch>
        <Route path={'/home'} render={(routeProps) => <Home {...routeProps} />} />
        <Route path={'/history'} render={(routeProps) => <History {...routeProps} />} />
        <Route path={'/control'} render={(routeProps) => <Control {...routeProps} />} />
        <Route path={'/setting'} render={(routeProps) => <Setting {...routeProps} />} />
        <Redirect
          to={'home'}
        />
      </Switch>
    </div>
  );
};

export default Content;
