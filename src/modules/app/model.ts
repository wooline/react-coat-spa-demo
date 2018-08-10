import RootState from "core/RootState";
import { Actions, BaseModuleHandlers, BaseModuleState, effect, ERROR, exportModel, globalLoading, loading, LoadingState, reducer, SagaIterator } from "react-coat-pkg";
import * as sessionService from "./api/session";
import * as settingsService from "./api/settings";
import { NAMESPACE } from "./exportNames";

// 定义本模块的State
export interface ModuleState extends BaseModuleState {
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
const initState: ModuleState = {
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
    global: LoadingState.Stop,
    login: LoadingState.Stop,
  },
};

// 定义本模块的Handlers
class ModuleHandlers extends BaseModuleHandlers<ModuleState, RootState> {
  @loading("login") // 创建一个局部loading状态来给“登录”按钮做反映
  @effect
  public *login(payload: { username: string; password: string }): SagaIterator {
    // 为了自动获得类型，分三步：
    const login = this.callPromise(sessionService.api.login, payload.username, payload.password);
    yield login;
    const curUser = login.getResponse();
    yield this.put(this.callThisAction(this.setCurUser, curUser));
  }

  @reducer
  protected setCurUser(curUser: { uid: string; username: string; hasLogin: boolean }): ModuleState {
    return { ...this.state, curUser };
  }

  // 自定义启动项，覆盖基类默认的START方法
  @globalLoading // 使用全局loading状态
  @effect
  protected *START(): SagaIterator {
    const getSettings = this.callPromise(settingsService.api.getSettings);
    yield getSettings;
    const projectConfig = getSettings.getResponse();
    const getCurUser = this.callPromise(sessionService.api.getCurUser);
    yield getCurUser;
    const curUser = getCurUser.getResponse();
    // 最后记得必须手动触发调用STARTED
    yield this.put(this.callThisAction(this.STARTED, { ...this.state, projectConfig, curUser }));
  }
  // 兼听全局错误的Action，并发送给后台
  // 兼听外部模块的Action，不需要手动触发，所以请使用protected或private
  @effect
  protected *[ERROR as string](payload: Error): SagaIterator {
    console.log(payload);
    yield this.callPromise(settingsService.api.reportError, payload);
  }
}

// 导出本模块的Actions
export type ModuleActions = Actions<ModuleHandlers>;

export default exportModel(NAMESPACE, initState, new ModuleHandlers());
