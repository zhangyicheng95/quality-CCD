import React from "react";
import { Route, Router, Switch, useHistory } from "react-router";
import List from './components/List';
import Detail from './components/Details';

const FileText: React.FC<any> = (props: any) => {
  const history = useHistory();

  return (
    <Router history={history}>
      <Switch>
        <Route exact path='/file' component={List} />
        <Route exact path='/file/detail' component={Detail} />
      </Switch>
    </Router>
  );
};

export default FileText;
