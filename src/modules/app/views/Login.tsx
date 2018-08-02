import RootState from "core/RootState";
import thisModule from "modules/app";
import * as React from "react";
import { connect, DispatchProp } from "react-redux";
import { Redirect } from "react-router-dom";

import "./Login.less";

interface Props extends DispatchProp {
  hasLogined: boolean;
  logining: boolean;
  location: { state };
}
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
      dispatch(thisModule.actions.login({ username: "", password: "" }) as any);
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

const mapStateToProps = (state: RootState) => {
  const curUser = state.project.app.curUser;
  const loginLoading = state.project.app.loading.login;
  return {
    hasLogined: curUser.uid && curUser.uid !== "0",
    logining: Boolean(loginLoading && loginLoading !== "Stop"),
  };
};

export default connect(mapStateToProps)(Component);
