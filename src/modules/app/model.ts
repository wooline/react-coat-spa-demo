import RootState from "core/RootState";
import { BaseModuleActions, LoadingState, ModuleState, effect, exportModel, loading, globalLoading, reducer, ERROR } from "react-coat-pkg";
import { SagaIterator } from "redux-saga";
import * as sessionService from "./api/session";
import * as settingsService from "./api/settings";
import * as actionNames from "./exportNames";

// 定义本模块的State
interface State extends ModuleState {
  projectConfig: {
    title: string;
  };
  curUser: {
    uid: string;
    username: string;
    hasLogin: boolean;
  };
  loginError: string;
  loading: {
    global: LoadingState;
    login: LoadingState;
  };
}
// 定义本模块State的初始值
const state: State = {
  projectConfig: {
    title: "",
  },
  curUser: {
    uid: "",
    username: "",
    hasLogin: false,
  },
  loginError: "",
  loading: {
    global: "Stop",
    login: "Stop",
  },
};
// 定义本模块的Action
class ModuleActions extends BaseModuleActions<State, RootState> {
  @reducer
  setCurUser(curUser: { uid: string; username: string; hasLogin: boolean }): State {
    return { ...this.state, curUser };
  }
  @loading("login") // 创建另一个局部loading状态来给“登录”按钮做反映
  @effect
  *login(payload: { username: string; password: string }): SagaIterator {
    const login = this.callPromise(sessionService.api.login, payload.username, payload.password);
    yield login;
    const curUser = login.getResponse();
    yield this.put(this.setCurUser(curUser));
  }
  // 自定义启动项，覆盖基类默认的START方法
  @globalLoading // 使用全局loading状态
  @effect
  *START(): SagaIterator {
    const getSettings = this.callPromise(settingsService.api.getSettings);
    yield getSettings;
    const projectConfig = getSettings.getResponse();
    const getCurUser = this.callPromise(sessionService.api.getCurUser);
    yield getCurUser;
    const curUser = getCurUser.getResponse();
    yield this.put(this.STARTED({ ...this.state, projectConfig, curUser }));
  }
  // 兼听全局错误的Action，并发送给后台
  @effect
  protected *[ERROR as string](payload: Error): SagaIterator {
    console.log(payload);
    yield this.callPromise(settingsService.api.reportError, payload);
  }
}

const model = exportModel(actionNames.NAMESPACE, state, new ModuleActions());

export default model;

type Actions = typeof model.actions;

export { Actions, State };
