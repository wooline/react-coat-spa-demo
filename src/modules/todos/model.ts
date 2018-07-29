import RootState from "core/RootState";
import { BaseModuleActions, effect, exportModel, LOCATION_CHANGE, ModuleState, reducer } from "react-coat-pkg";
import { SagaIterator } from "redux-saga";
import * as todoService from "./api/todos";
import * as actionNames from "./exportNames";
// 定义本模块的State
interface State extends ModuleState {
  todosList: string[];
}
// 定义本模块State的初始值
const state: State = {
  todosList: [],
  loading: {},
};
// 定义本模块的Action
class ModuleActions extends BaseModuleActions<State, RootState> {
  @reducer
  updateTodosList(payload: string[]): State {
    return { ...this.state, todosList: payload };
  }
  // 兼听路由变化的Action
  @effect
  protected *[LOCATION_CHANGE as string](payload: { location: { pathname: string } }): SagaIterator {
    if (payload.location.pathname === "/admin/todos") {
      const getTodosList = this.callPromise(todoService.api.getTodosList);
      yield getTodosList;
      const todos = getTodosList.getResponse();
      yield this.put(this.updateTodosList(todos.list));
    }
  }
}

const model = exportModel(actionNames.NAMESPACE, state, new ModuleActions());

export default model;

type Actions = typeof model.actions;

export { Actions, State };
