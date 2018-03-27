import RootState from "core/RootState";
import {
    BaseModuleState, buildActionByEffect, buildActionByReducer, buildLoading, buildModel,
    ERROR_ACTION_NAME,
} from "react-coat-pkg";
import { call, put } from "redux-saga/effects";

import * as actionNames from "./actionNames";
import * as sessionService from "./api/session";
import * as settingsService from "./api/settings";
import thisModule from "./index";

// 定义本模块的State
interface State extends BaseModuleState {
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
    global: string;
    login: string;
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
class ModuleActions {
  [actionNames.UPDATE_SETTINGS] = buildActionByReducer(function(settings: { title: string }, moduleState: State, rootState: RootState): State {
    return { ...moduleState, projectConfig: settings };
  });
  [actionNames.UPDATE_CUR_USER] = buildActionByReducer(function(curUser: { uid: string; username: string; hasLogin: boolean }, moduleState: State, rootState: RootState): State {
    return { ...moduleState, curUser };
  });
  @buildLoading(actionNames.NAMESPACE, "login") // 创建另一个局部loading状态来给“登录”按钮做反映
  [actionNames.LOGIN] = buildActionByEffect(function*({ username, password }: { username: string; password: string }) {
    const curUser: sessionService.LoginResponse = yield call(sessionService.api.login, username, password);
    yield put(thisModule.actions.app_updateCurUser(curUser));
  });
}
// 定义本模块的监听
class ModuleHandlers {
  // 监听全局错误Action，收集并发送给后台
  [ERROR_ACTION_NAME] = buildActionByEffect(function*(error, moduleState: State, rootState: RootState) {
    console.log(error);
    yield call(settingsService.api.reportError, error);
  });
  // 监听自已的INIT Action
  @buildLoading()
  [actionNames.INIT] = buildActionByEffect(function*(data: State, moduleState: State, rootState: RootState) {
    const config: settingsService.GetSettingsResponse = yield call(settingsService.api.getSettings);
    yield put(thisModule.actions.app_updateSettings(config));
    const curUser: sessionService.GetCurUserResponse = yield call(sessionService.api.getCurUser);
    yield put(thisModule.actions.app_updateCurUser(curUser));
  });
}

const model = buildModel(state, ModuleActions, ModuleHandlers);

export default model;

type Actions = typeof model.actions;

export { Actions, State };
