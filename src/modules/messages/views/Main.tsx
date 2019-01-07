import {toPath} from "common/routers";
import NotFound from "components/NotFound";
import {RootState} from "modules";
import {ModuleNames} from "modules/names";
import * as React from "react";
import {connect} from "react-redux";
import {Redirect, Route, Switch} from "react-router-dom";
import ListView from "./List";

interface Props {
  pathname: string;
}
class Component extends React.PureComponent<Props> {
  public render() {
    return (
      <Switch>
        <Redirect exact={true} path={toPath(ModuleNames.messages)} to={toPath(ModuleNames.messages, "List")} />
        <Route exact={false} path={toPath(ModuleNames.messages, "List")} component={ListView} />
        <Route component={NotFound} />
      </Switch>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    pathname: state.router.location.pathname,
  };
};

export default connect(mapStateToProps)(Component);
