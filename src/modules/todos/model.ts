import RootState from "core/RootState";
import {
    BaseModuleState, buildActionByEffect, buildActionByReducer, buildModel,
    LOCATION_CHANGE_ACTION_NAME,
} from "react-coat-pkg";
import { call, put } from "redux-saga/effects";

import * as actionNames from "./actionNames";
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
class ModuleActions {
  [actionNames.UPDATE_TODOS_LIST] = buildActionByReducer(function(todosList: string[], moduleState: State, rootState: RootState): State {
    return { ...moduleState, todosList };
  });
}
// 定义本模块的监听
class ModuleHandlers {
  /*
  监听路由Action，因为存在 if 条件判断，所以此处不适合用@buildLoading()来对注入loading状态，
  改为在 productService.getProductList 方法中用setLoading()函数注入
  */
  [LOCATION_CHANGE_ACTION_NAME] = buildActionByEffect(function*({ pathname }: { pathname: string }, moduleState: State, rootState: RootState) {
    if (pathname === "/admin/todos") {
      const todos: todoService.GetTodosListResponse = yield call(todoService.api.getTodosList);
      yield put(thisModule.actions.todos_updateTodosList(todos.list));
    }
  });
}

const model = buildModel(state, ModuleActions, ModuleHandlers);

export default model;

type Actions = typeof model.actions;

export { Actions, State };
