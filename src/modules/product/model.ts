import RootState from "core/RootState";
import { Actions, BaseModuleHandlers, BaseModuleState, LoadingState, LOCATION_CHANGE, SagaIterator, effect, exportModel, reducer } from "react-coat-pkg";
import * as productService from "./api/product";
import * as actionNames from "./exportNames";

// 定义本模块的State
export interface ModuleState extends BaseModuleState {
  productList: string[];
  loading: {
    global: LoadingState;
  };
}

// 定义本模块State的初始值
const state: ModuleState = {
  productList: [],
  loading: {
    global: LoadingState.Stop,
  },
};

// 定义本模块的Handlers
class ModuleHandlers extends BaseModuleHandlers<ModuleState, RootState> {
  @reducer
  protected updateProductList(productList: string[]): ModuleState {
    return { ...this.state, productList };
  }
  // 兼听路由变化的Action
  // 兼听外部模块的Action，不需要手动触发，所以请使用protected或private
  @effect
  protected *[LOCATION_CHANGE as string](payload: { location: { pathname: string } }): SagaIterator {
    if (payload.location.pathname === "/admin/product") {
      const getProductList = this.callPromise(productService.api.getProductList);
      yield getProductList;
      const todos = getProductList.getResponse();
      yield this.put(this.callThisAction(this.updateProductList, todos.list));
    }
  }
}

// 导出本模块的Actions
export type ModuleActions = Actions<ModuleHandlers>;

export default exportModel(actionNames.NAMESPACE, state, new ModuleHandlers());
