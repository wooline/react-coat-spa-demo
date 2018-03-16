import RootState from "core/RootState.d";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

interface Props {}
interface OwnProps {}
interface State {}
class Component extends React.PureComponent<Props, State> {
  public render() {
    return <div>not found!!!</div>;
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
  return {};
};
const mapDispatchToProps = (dispatch: Dispatch<string>, ownProps: OwnProps) => {
  return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(Component);
