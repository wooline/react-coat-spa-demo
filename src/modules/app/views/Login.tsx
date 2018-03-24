import RootState from "core/RootState";
import thisModule from "modules/app";
import * as React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Dispatch } from "redux";

import "./Login.less";

interface Props {
  dispatch: Dispatch<any>;
  hasLogined: boolean;
  logining: boolean;
  location: { state };
}
interface OwnProps {}
interface State {
  redirectToReferrer: boolean;
}

class Component extends React.PureComponent<Props, State> {
  public render() {
    const { dispatch, hasLogined, logining, location } = this.props;
    const { from } = location.state || { from: { pathname: "/" } };
    function login(evt) {
      evt.stopPropagation();
      evt.preventDefault();
      dispatch(thisModule.actions.app_login({ username: "", password: "" }) as any);
    }
    return hasLogined ? (
      <Redirect to={from} />
    ) : (
      <form className="app-login" onSubmit={login}>
        <h3>请登录</h3>
        <ul>
          <li>
            <input name="username" placeholder="Username" />
          </li>
          <li>
            <input name="password" type="password" placeholder="Password" />
          </li>
          <li>
            <input type="submit" value="Login" disabled={logining} />
          </li>
        </ul>
      </form>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
  const curUser = state.project.app.curUser;
  const loginLoading = state.project.app.loading.login;
  return {
    hasLogined: curUser.uid && curUser.uid !== "0",
    logining: Boolean(loginLoading && loginLoading !== "Stop"),
  };
};
const mapDispatchToProps = (dispatch: Dispatch<string>, ownProps: OwnProps) => {
  return {
    dispatch,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Component);
