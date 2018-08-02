import Loading from "components/Loading";
import NotFound from "components/NotFound";
import VerifyRoute, { AuthState } from "components/ProtectedRoute";
import RootState from "core/RootState";
import React from "react";
import { async, LoadingState } from "react-coat-pkg";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";

import Login from "./Login";

const Admin = async(() => import(/* webpackChunkName: "admin" */ "modules/admin/views"));

type User = RootState["project"]["app"]["curUser"];

interface Props {
  projectConfigLoaded: boolean;
  curUserLoaded: boolean;
  curUser: User;
  globalLoading: LoadingState;
}

function hasAuth(path: string, curUser: User): AuthState {
  return curUser.hasLogin ? AuthState.Authorized : AuthState.Forbidden;
}

class Component extends React.PureComponent<Props> {
  public render() {
    const { projectConfigLoaded, curUserLoaded, curUser, globalLoading } = this.props;
    return (
      <div>
        <Switch>
          <Redirect exact={true} path="/" to="/admin/todos" />
          <Redirect exact={true} path="/admin" to="/admin/todos" />
          <VerifyRoute auth={projectConfigLoaded && curUserLoaded ? hasAuth("/admin", curUser) : AuthState.Pending} path="/admin" component={Admin} />
          <VerifyRoute exact={true} auth={projectConfigLoaded && curUserLoaded ? AuthState.Authorized : AuthState.Pending} path="/login" component={Login} />
          <Route component={NotFound} />
        </Switch>
        <Loading loading={globalLoading} />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  const app = state.project.app;
  return {
    projectConfigLoaded: app.projectConfig.title !== "",
    curUserLoaded: app.curUser.uid !== "",
    curUser: app.curUser,
    globalLoading: app.loading.global,
  };
};

export default connect(mapStateToProps)(Component);
