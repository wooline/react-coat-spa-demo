import {toPath} from "common/routers";
import NotFound from "components/NotFound";
import {RootState} from "modules";
import {ModuleNames} from "modules/names";
import * as React from "react";
import {connect} from "react-redux";
import {Redirect, Route, Switch} from "react-router-dom";
import DetailsView from "./Details";
import ListView from "./List";

interface Props {
  pathname: string;
}
class Component extends React.PureComponent<Props> {
  public render() {
    return (
      <Switch>
        <Redirect exact={true} path={toPath(ModuleNames.videos)} to={toPath(ModuleNames.videos, "List")} />
        <Route exact={false} path={toPath(ModuleNames.videos, "List")} component={ListView} />
        <Route exact={false} path={toPath(ModuleNames.videos, "Details")} component={DetailsView} />
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
