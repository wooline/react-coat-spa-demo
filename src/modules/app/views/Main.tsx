import Loading from "components/Loading";
import NotFound from "components/NotFound";
import VerifyRoute, { AuthState } from "components/ProtectedRoute";
import RootState from "core/RootState";
import { hasLogin } from "helper/user";
import React from "react";
import { asyncComponent } from "react-coat";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { Dispatch } from "redux";
import Login from "./Login";

const Admin = asyncComponent(() => import("modules/admin/components"));

type User = RootState["project"]["app"]["curUser"];

interface Props {
  projectConfigLoaded: boolean;
  curUserLoaded: boolean;
  curUser: User;
  globalLoading: string;
}

interface OwnProps {}
interface State {}

function hasAuth(path: string, curUser: User): AuthState {
  return hasLogin(curUser) ? AuthState.Authorized : AuthState.Forbidden;
}

class Component extends React.PureComponent<Props, State> {
  public render() {
    const { projectConfigLoaded, curUserLoaded, curUser, globalLoading } = this.props;
    return (
      <div>
        <Switch>
          <Redirect exact path="/" to="/admin" />
          <VerifyRoute auth={projectConfigLoaded && curUserLoaded ? hasAuth("/admin", curUser) : AuthState.Pending} path="/admin" component={Admin} />
          <VerifyRoute auth={projectConfigLoaded && curUserLoaded ? AuthState.Authorized : AuthState.Pending} path="/login" exact component={Login} />
          <Route component={NotFound} />
        </Switch>
        <Loading loading={globalLoading} />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
  const app = state.project.app;
  return {
    projectConfigLoaded: app.projectConfig.title !== "",
    curUserLoaded: app.curUser.uid !== "",
    curUser: app.curUser,
    globalLoading: app.loading.global
  };
};
const mapDispatchToProps = (dispatch: Dispatch<string>, ownProps: OwnProps) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(Component);
