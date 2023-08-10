import React from "react";
import { Route, Router, Switch, useHistory } from "react-router";
import List from './components/List';
import Detail from './components/Details';

const HistoryDemo: React.FC<any> = (props: any) => {
  const history = useHistory();

  return (
    <Router history={history}>
      <Switch>
        <Route exact path='/history' component={List} />
        <Route exact path='/history/detail' component={Detail} />
      </Switch>
    </Router>
  );
};

export default HistoryDemo;
