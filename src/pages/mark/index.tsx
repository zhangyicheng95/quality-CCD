import React from "react";
import { Route, Router, Switch, useHistory, } from "react-router";
import List from './components/List';
import Detail from './components/Details';

const Mark = (props: any) => {
  const history = useHistory();

  return (
    <Router history={history}>
      <Switch>
        <Route exact path='/mark' component={List} />
        <Route exact path='/mark/detail' component={Detail} />
      </Switch>
    </Router>
  );
};

export default Mark;
