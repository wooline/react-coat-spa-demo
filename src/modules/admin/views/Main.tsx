import React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { asyncComponent } from "react-coat";
import { Route, match } from "react-coat/router-dom";
import GlobalHeader from "./GlobalHeader";
import RootState from "core/RootState";

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
    const { match } = this.props;
    console.log(match, this.props);
    return (
      <div>
        <GlobalHeader />
        <div>
          <Route exact path={`${match.url}/todos`} component={Todos} />
          <Route exact path={`${match.url}/product`} component={Product} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
  return { pathname: state.router.location.pathname };
};
const mapDispatchToProps = (dispatch: Dispatch<string>, ownProps: OwnProps) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(Component);
