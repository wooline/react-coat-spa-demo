import RootState from "core/RootState";
import { BaseModuleActions, ModuleState, effect, exportModel, reducer, LOCATION_CHANGE } from "react-coat-pkg";
import { SagaIterator } from "redux-saga";
import * as productService from "./api/product";
import * as actionNames from "./exportNames";

// 定义本模块的State
interface State extends ModuleState {
  productList: string[];
}
// 定义本模块State的初始值
const state: State = {
  productList: [],
  loading: {},
};
// 定义本模块的Action
class ModuleActions extends BaseModuleActions<State, RootState> {
  @reducer
  updateProductList(productList: string[]): State {
    return { ...this.state, productList };
  }
  // 兼听路由变化的Action
  @effect
  protected *[LOCATION_CHANGE as string](payload: { location: { pathname: string } }): SagaIterator {
    if (payload.location.pathname === "/admin/product") {
      const getProductList = this.callPromise(productService.api.getProductList);
      yield getProductList;
      const todos = getProductList.getResponse();
      yield this.put(this.updateProductList(todos.list));
    }
  }
}

const model = exportModel(actionNames.NAMESPACE, state, new ModuleActions());

export default model;

type Actions = typeof model.actions;

export { Actions, State };
