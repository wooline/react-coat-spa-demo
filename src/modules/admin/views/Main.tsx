import RootState from "core/RootState";
import React from "react";
import { asyncComponent } from "react-coat-pkg";
import { connect } from "react-redux";
import { match, Route } from "react-router-dom";
import { Dispatch } from "redux";

import GlobalHeader from "./GlobalHeader";

const Product = asyncComponent(() => import(/* webpackChunkName: "product" */ "modules/product/views"));
const Todos = asyncComponent(() => import(/* webpackChunkName: "todos" */ "modules/todos/views"));

interface Props {
  match: match<any>;
  pathname: string;
}

interface OwnProps {}
interface State {}

class Component extends React.PureComponent<Props, State> {
  render() {
    // tslint:disable-next-line:no-shadowed-variable
    const { match } = this.props;
    return (
      <div>
        <GlobalHeader />
        <div>
          <Route exact={true} path={`${match.url}/todos`} component={Todos} />
          <Route exact={true} path={`${match.url}/product`} component={Product} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
  return { pathname: state.router.location.pathname };
};
const mapDispatchToProps = (dispatch: Dispatch, ownProps: OwnProps) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(Component);
