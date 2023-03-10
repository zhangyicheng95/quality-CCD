import { Route, Router, Switch, useHistory, } from "react-router";
import Canvas from './components/Canvas';
import { useReloadAfterStationary } from "@/utils/useReloadAfterStationary";

const Mark = (props: any) => {
  const history = useHistory();
  useReloadAfterStationary();
  return (
    <Router history={history}>
      <Switch>
        <Route exact path='/home' component={Canvas} />
        <Route exact path='/home/edit' component={Canvas} />
      </Switch>
    </Router>
  );
};

export default Mark;
