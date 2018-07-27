import RootState from "core/RootState";
import { BaseModuleActions, ModuleState, effect, exportModel, loading, reducer } from "react-coat-pkg";
import { SagaIterator } from "redux-saga";
import * as messageService from "./api/message";
import * as actionNames from "./exportActionNames";

// 定义本模块的State
interface State extends ModuleState {
  messageList: string[];
}
// 定义本模块State的初始值
const state: State = {
  messageList: [],
  loading: {
    global: "Stop",
  },
};
// 定义本模块的Action
class ModuleActions extends BaseModuleActions<State, RootState> {
  @reducer
  updateMessageList(messageList: string[]): State {
    return { ...this.state, messageList };
  }
  @loading()
  @effect
  *INIT(): SagaIterator {
    yield this.put(this.SET_INIT_DATA());
    const messageList: messageService.GetMessageListResponse = yield this.call(messageService.api.getMessageList);
    yield this.put(this.updateMessageList(messageList.list));
  }
}

const model = exportModel(actionNames.NAMESPACE, state, new ModuleActions());

export default model;

type Actions = typeof model.actions;

export { Actions, State };
