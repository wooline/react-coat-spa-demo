import RootState from "core/RootState";
import { BaseModuleActions, BaseModuleHandlers, BaseModuleState, buildModel, effect } from "react-coat-pkg";
import * as messageService from "./api/message";
import * as actionNames from "./exportActionNames";
import thisModule from "./index";

// 定义本模块的State
interface State extends BaseModuleState {
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
class ModuleActions extends BaseModuleActions {
  updateMessageList(messageList: string[], moduleState: State, rootState: RootState): State {
    return { ...moduleState, messageList };
  }
}
// 定义本模块的监听
class ModuleHandlers extends BaseModuleHandlers {
  @effect()
  *[actionNames.INIT]() {
    const messageList: messageService.GetMessageListResponse = yield this.call(messageService.api.getMessageList);
    yield this.put(thisModule.actions.updateMessageList(messageList.list));
  }
}

const model = buildModel(state, ModuleActions, ModuleHandlers);

export default model;

type Actions = typeof model.actions;

export { Actions, State };
