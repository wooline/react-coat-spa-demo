import RootState from "core/RootState";
import { BaseModuleActions, ModuleState, effect, exportModel, reducer } from "react-coat-pkg";
import { SagaIterator } from "redux-saga";
import * as productService from "./api/product";
import * as actionNames from "./exportActionNames";

// 定义本模块的State
interface State extends ModuleState {
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
class ModuleActions extends BaseModuleActions<State, RootState> {
  @reducer
  updateProductList(productList: string[]): State {
    return { ...this.state, productList };
  }
  @effect
  protected *["@@router/LOCATION_CHANGE"](payload: { location: { pathname: string } }): SagaIterator {
    if (payload.location.pathname === "/admin/product") {
      const todos: productService.GetProductListResponse = yield this.call(productService.api.getProductList);
      yield this.put(this.updateProductList(todos.list));
    }
  }
}

const model = exportModel(actionNames.NAMESPACE, state, new ModuleActions());

export default model;

type Actions = typeof model.actions;

export { Actions, State };
