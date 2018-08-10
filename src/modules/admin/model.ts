import RootState from "core/RootState";
import { Actions, BaseModuleHandlers, BaseModuleState, effect, exportModel, globalLoading, SagaIterator } from "react-coat-pkg";
import * as messageService from "./api/message";
import { NAMESPACE } from "./exportNames";

// 定义本模块的State
export interface ModuleState extends BaseModuleState {
  messageList: string[];
}

// 定义本模块State的初始值
const initState: ModuleState = {
  messageList: [],
  loading: {},
};

// 定义本模块的Handlers
class ModuleHandlers extends BaseModuleHandlers<ModuleState, RootState> {
  // 自定义启动项，覆盖基类默认的START方法
  @globalLoading // 使用全局loading状态
  @effect
  protected *START(): SagaIterator {
    // 为了自动获得类型，分三步：
    const getMessageList = this.callPromise(messageService.api.getMessageList); // ajax获取MessageList
    yield getMessageList; // 执行获取
    const messageList = getMessageList.getResponse().list; // 取得结果
    // 最后记得必须手动触发调用STARTED
    yield this.put(this.callThisAction(this.STARTED, { ...this.state, messageList }));
  }
}

// 导出本模块的Actions
export type ModuleActions = Actions<ModuleHandlers>;

export default exportModel(NAMESPACE, initState, new ModuleHandlers());
