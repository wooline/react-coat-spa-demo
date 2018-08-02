import Loading from "components/Loading";
import RootState from "core/RootState";
import * as React from "react";
import { connect } from "react-redux";

import "./Main.less";

interface Props {
  globalLoading: string;
  productList: string[];
}

const Component = (props: Props) => {
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

const mapStateToProps = (state: RootState) => {
  const data = state.project.product;
  return {
    globalLoading: data.loading.global,
    productList: data.productList,
  };
};

export default connect(mapStateToProps)(Component);
