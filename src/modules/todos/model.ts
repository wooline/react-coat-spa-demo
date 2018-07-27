import RootState from "core/RootState";
import { BaseModuleActions, ModuleState, reducer, effect, exportModel } from "react-coat-pkg";
import { SagaIterator } from "redux-saga";
import * as todoService from "./api/todos";
import * as actionNames from "./exportActionNames";
// 定义本模块的State
interface State extends ModuleState {
  todosList: string[];
}
// 定义本模块State的初始值
const state: State = {
  todosList: [],
  loading: {
    global: "Stop",
  },
};
// 定义本模块的Action
class ModuleActions extends BaseModuleActions<State, RootState> {
  @reducer
  updateTodosList(payload: string[]): State {
    return { ...this.state, todosList: payload };
  }
  @effect
  protected *["@@router/LOCATION_CHANGE"](payload: { location: { pathname: string } }): SagaIterator {
    // 定义本模块的监听
    if (payload.location.pathname === "/admin/todos") {
      const todos: todoService.GetTodosListResponse = yield this.call(todoService.api.getTodosList);
      yield this.put(this.updateTodosList(todos.list));
    }
  }
}

const model = exportModel(actionNames.NAMESPACE, state, new ModuleActions());

export default model;

type Actions = typeof model.actions;

export { Actions, State };
