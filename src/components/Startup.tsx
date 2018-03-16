import RootState from "core/RootState.d";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

interface Props {
  dispatch: Dispatch<any>;
}
interface OwnProps {}
interface State {}

class Component extends React.PureComponent<Props, State> {
  public componentDidMount() {
    this.props.dispatch({ type: "app/_startup" });
  }
  public render() {
    const style: any = {
      fontSize: "20px",
      textAlign: "center",
      position: "fixed",
      width: "100%",
      height: "100%"
    };
    return <div style={style}>Welcome...</div>;
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
  return {};
};
const mapDispatchToProps = (dispatch: Dispatch<string>, ownProps: OwnProps) => {
  return {
    dispatch
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Component);
