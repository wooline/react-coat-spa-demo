import RootState from "core/RootState.d";
import React, { ComponentType } from "react";
import { connect } from "react-redux";
import { Redirect, Route, RouteComponentProps, RouteProps } from "react-router-dom";
import { Dispatch } from "redux";
import Startup from "./Startup";

export enum AuthState {
  Pending,
  Authorized,
  Forbidden
}

interface Props extends RouteProps {
  auth: AuthState;
  component: ComponentType<any>;
}
interface OwnProps {}
interface State {}

function render(auth: AuthState, props: RouteComponentProps<any>, Component: ComponentType<any>) {
  return auth === AuthState.Pending ? <Startup /> : auth === AuthState.Authorized ? <Component {...props} /> : <Redirect to={{ pathname: "/login", state: { from: props.location } }} />;
}

class Component extends React.PureComponent<Props, State> {
  public render() {
    const { auth, component, ...rest } = this.props;
    return <Route {...rest} render={props => render(auth, props, component)} />;
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
  return {};
};
const mapDispatchToProps = (dispatch: Dispatch<string>, ownProps: OwnProps) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(Component);
