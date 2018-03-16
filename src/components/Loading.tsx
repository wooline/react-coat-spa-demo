import RootState from "core/RootState.d";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

require("./Loading.less");

interface Props {
  dispatch: Dispatch<any>;
  loading: string;
}
interface OwnProps {}
interface State {}

class Component extends React.PureComponent<Props, State> {
  public render() {
    const { loading } = this.props;
    return loading === "Start" || loading === "Depth" ? (
      <div className={"g-loading " + loading}>
        <div className="loading-icon">
          <div>Loading...</div>
        </div>
      </div>
    ) : null;
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
  return {};
};
const mapDispatchToProps = (dispatch: Dispatch<any>, ownProps: OwnProps) => {
  return {
    dispatch
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Component);
