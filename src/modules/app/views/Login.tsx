import RootState from "core/RootState";
import thisModule from "modules/app";
import * as React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Dispatch } from "redux";

require("./Login.less");

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
      dispatch(thisModule.actions._login({ username: "", password: "" }) as any);
    }
    return hasLogined ? (
      <Redirect to={from} />
    ) : (
      <form className="app-login" onSubmit={e => login(this)}>
        <input name="username" placeholder="Username" />
        <input name="password" type="password" placeholder="Password" />
        <input type="submit" value="Login" disabled={logining} />
      </form>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
  const curUser = state.project.app.curUser;
  const loginLoading = state.project.app.loading.login;
  return {
    hasLogined: curUser.uid && curUser.uid !== "0",
    logining: Boolean(loginLoading && loginLoading !== "Stop")
  };
};
const mapDispatchToProps = (dispatch: Dispatch<string>, ownProps: OwnProps) => {
  return {
    dispatch
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Component);
