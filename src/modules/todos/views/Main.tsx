import Loading from "components/Loading";
import RootState from "core/RootState";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import "./Main.less";

interface Props {
  globalLoading: string;
  todosList: string[];
}

interface OwnProps {}
interface State {}

const Component = (props: Props, state: State) => {
  return (
    <div className="todos">
      <table>
        <tbody>
          {props.todosList.map(item => (
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
  const data = state.project.todos;
  return {
    globalLoading: data.loading.global,
    todosList: data.todosList,
  };
};
const mapDispatchToProps = (dispatch: Dispatch<string>, ownProps: OwnProps) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Component);
