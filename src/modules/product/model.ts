import RootState from "core/RootState";
import {
    BaseModuleState, buildActionByEffect, buildActionByReducer, buildModel,
    LOCATION_CHANGE_ACTION_NAME,
} from "react-coat-pkg";
import { call, put } from "redux-saga/effects";

import * as actionNames from "./actionNames";
import * as productService from "./api/product";
import thisModule from "./index";

// 定义本模块的State
interface State extends BaseModuleState {
  productList: string[];
}
// 定义本模块State的初始值
const state: State = {
  productList: [],
  loading: {
    global: "Stop",
  },
};
// 定义本模块的Action
class ModuleActions {
  [actionNames.UPDATE_PRODUCT_LIST] = buildActionByReducer(function(productList: string[], moduleState: State, rootState: RootState): State {
    return { ...moduleState, productList };
  });
}
// 定义本模块的监听
class ModuleHandlers {
  /*
  监听路由Action，因为存在 if 条件判断，所以此处不适合用@buildLoading()来对注入loading状态，
  改为在 productService.getProductList 方法中用setLoading()函数注入
  */
  [LOCATION_CHANGE_ACTION_NAME] = buildActionByEffect(function*({ pathname }: { pathname: string }, moduleState: State, rootState: RootState) {
    if (pathname === "/admin/product") {
      const todos: productService.GetProductListResponse = yield call(productService.api.getProductList);
      yield put(thisModule.actions.product_updateProductList(todos.list));
    }
  });
}

const model = buildModel(state, ModuleActions, ModuleHandlers);

export default model;

type Actions = typeof model.actions;

export { Actions, State };
