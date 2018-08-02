import RootState from "core/RootState";
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

type User = RootState["project"]["app"]["curUser"];

interface Props {
  curUser: User;
  messageList: string[];
}

class Component extends PureComponent<Props> {
  render() {
    const { curUser, messageList } = this.props;
    return (
      <div>
        <ul>
          <li>
            欢迎您：{curUser.username}，您有<strong>{messageList.length}</strong> 条消息：{messageList.join("，")}
          </li>
          <li>
            <Link to="/admin/todos">todos</Link>
          </li>
          <li>
            <Link to="/admin/product">product</Link>
          </li>
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    curUser: state.project.app.curUser,
    messageList: state.project.admin.messageList,
  };
};

export default connect(mapStateToProps)(Component);
