import RootState from "core/RootState";
import { BaseModuleActions, effect, exportModel, globalLoading, ModuleState } from "react-coat-pkg";
import { SagaIterator } from "redux-saga";
import * as messageService from "./api/message";
import * as actionNames from "./exportNames";

// 定义本模块的State
interface State extends ModuleState {
  messageList: string[];
}
// 定义本模块State的初始值
const initState: State = {
  messageList: [],
  loading: {},
};
// 定义本模块的Action
class ModuleActions extends BaseModuleActions<State, RootState> {
  // 自定义启动项，覆盖基类默认的START方法
  @globalLoading // 使用全局loading状态
  @effect
  *START(): SagaIterator {
    const getMessageList = this.callPromise(messageService.api.getMessageList); // ajax获取MessageList
    yield getMessageList; // 执行获取
    const messageList = getMessageList.getResponse().list; // 取得结果
    // 设置启动State
    yield this.put(this.STARTED({ ...this.state, messageList }));
  }
}

const model = exportModel(actionNames.NAMESPACE, initState, new ModuleActions());

export default model;

type Actions = typeof model.actions;

export { Actions, State };
