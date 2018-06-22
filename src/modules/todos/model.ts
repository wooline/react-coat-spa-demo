import { ActionData, BaseModuleActions, BaseModuleHandlers, BaseModuleState, LOCATION_CHANGE_ACTION_NAME, buildModel, effect } from "react-coat-pkg";
import * as todoService from "./api/todos";
import thisModule from "./index";

// 定义本模块的State
interface State extends BaseModuleState {
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
class ModuleActions extends BaseModuleActions {
  updateTodosList({ payload, moduleState }: ActionData<string[], State>): State {
    return { ...moduleState, todosList: payload };
  }
}
// 定义本模块的监听
class ModuleHandlers extends BaseModuleHandlers {
  /*
  监听路由Action，因为存在 if 条件判断，所以此处不适合用@buildLoading()来对注入loading状态，
  改为在 productService.getProductList 方法中用setLoading()函数注入
  */
  @effect(null)
  *[LOCATION_CHANGE_ACTION_NAME]({ payload }: ActionData<{ location: { pathname: string } }>) {
    if (payload.location.pathname === "/admin/todos") {
      const todos: todoService.GetTodosListResponse = yield this.call(todoService.api.getTodosList);
      yield this.put(thisModule.actions.updateTodosList(todos.list));
    }
  }
}

const model = buildModel(state, new ModuleActions(), new ModuleHandlers());

export default model;

type Actions = typeof model.actions;

export { Actions, State };
