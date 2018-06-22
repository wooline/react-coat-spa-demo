import { ActionData, BaseModuleActions, BaseModuleHandlers, BaseModuleState, LOCATION_CHANGE_ACTION_NAME, buildModel, effect } from "react-coat-pkg";
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
class ModuleActions extends BaseModuleActions {
  updateProductList({ payload, moduleState }: ActionData<string[], State>): State {
    return { ...moduleState, productList: payload };
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
    if (payload.location.pathname === "/admin/product") {
      const todos: productService.GetProductListResponse = yield this.call(productService.api.getProductList);
      yield this.put(thisModule.actions.updateProductList(todos.list));
    }
  }
}

const model = buildModel(state, new ModuleActions(), new ModuleHandlers());

export default model;

type Actions = typeof model.actions;

export { Actions, State };
