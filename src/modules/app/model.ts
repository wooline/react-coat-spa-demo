import RootState from "core/RootState";
import { BaseModuleActions, LoadingState, ModuleState, effect, exportModel, loading, reducer } from "react-coat-pkg";
import { SagaIterator } from "redux-saga";
import * as sessionService from "./api/session";
import * as settingsService from "./api/settings";
import * as actionNames from "./exportActionNames";

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
  updateSettings(projectConfig: { title: string }): State {
    return { ...this.state, projectConfig };
  }
  @reducer
  updateCurUser(curUser: { uid: string; username: string; hasLogin: boolean }): State {
    this.test();
    return { ...this.state, curUser };
  }
  @loading(actionNames.NAMESPACE, "login") // 创建另一个局部loading状态来给“登录”按钮做反映
  @effect
  *login(payload: { username: string; password: string }): SagaIterator {
    // 注意，此处返回如果不为any会引起编译错误，有待ts修复
    const curUser: sessionService.LoginResponse = yield this.call(sessionService.api.login, payload.username, payload.password);
    yield this.put(this.updateCurUser(curUser));
  }
  @loading()
  @effect
  *INIT(): SagaIterator {
    const config: settingsService.GetSettingsResponse = yield this.call(settingsService.api.getSettings);
    yield this.put(this.updateSettings(config));
    const curUser: sessionService.GetCurUserResponse = yield this.call(sessionService.api.getCurUser);
    yield this.put(this.updateCurUser(curUser));
  }
  @effect
  protected *["@@framework/ERROR"](payload: Error): SagaIterator {
    console.log(payload);
    yield this.call(settingsService.api.reportError, payload);
  }

  protected test() {
    console.log(1);
  }
}

const model = exportModel(actionNames.NAMESPACE, state, new ModuleActions());

export default model;

type Actions = typeof model.actions;

export { Actions, State };
