import Loading from "components/Loading";
import RootState from "core/RootState";
import * as React from "react";
import { connect } from "react-redux";

import "./Main.less";

interface Props {
  globalLoading: string;
  todosList: string[];
}

const Component = (props: Props) => {
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

const mapStateToProps = (state: RootState) => {
  const data = state.project.todos;
  return {
    globalLoading: data.loading.global,
    todosList: data.todosList,
  };
};

export default connect(mapStateToProps)(Component);
