import RootState from "core/RootState";
import { Actions, BaseModuleHandlers, BaseModuleState, LOCATION_CHANGE, SagaIterator, effect, exportModel, reducer } from "react-coat-pkg";
import * as todoService from "./api/todos";
import * as actionNames from "./exportNames";

// 定义本模块的State
export interface ModuleState extends BaseModuleState {
  todosList: string[];
}

// 定义本模块State的初始值
const initState: ModuleState = {
  todosList: [],
  loading: {},
};

// 导出本模块的Actions
export type ModuleActions = Actions<ModuleHandlers>;

// 定义本模块的Handlers
class ModuleHandlers extends BaseModuleHandlers<ModuleState, RootState, ModuleActions> {
  @reducer
  updateTodosList(todosList: string[]): ModuleState {
    return { ...this.state, todosList };
  }
  // 兼听路由变化的Action
  // 兼听外部模块的Action，不需要手动触发，所以请使用protected或private
  @effect
  protected *[LOCATION_CHANGE as string](payload: { location: { pathname: string } }): SagaIterator {
    if (payload.location.pathname === "/admin/todos") {
      const getTodosList = this.callPromise(todoService.api.getTodosList);
      yield getTodosList;
      const todos = getTodosList.getResponse();
      yield this.put(this.actions.updateTodosList(todos.list));
    }
  }
}

export default exportModel(actionNames.NAMESPACE, initState, new ModuleHandlers());
