import * as React from "react";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import RootState from "core/RootState";
import Loading from "components/Loading";

import "./Main.less";

interface Props {
  globalLoading: string;
  productList: string[];
}

interface OwnProps {}
interface State {}

const Component = (props: Props, state: State) => {
  return (
    <div className="product">
      <table>
        <tbody>
          {props.productList.map(item => (
            <tr key={item}>
              <td>{item}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Loading loading={props.globalLoading} />
    </div>
  );
};

const mapStateToProps = (state: RootState, ownProps: OwnProps) => {
  const data = state.project.product;
  return {
    globalLoading: data.loading.global,
    productList: data.productList
  };
};
const mapDispatchToProps = (dispatch: Dispatch<string>, ownProps: OwnProps) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
