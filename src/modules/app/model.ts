import thisModule from "modules/app";
import { BaseActions, BaseState, buildActionByEffect, buildActionByReducer, buildLoading, buildModel } from "react-coat";
import { call, put } from "redux-saga/effects";
import * as sessionService from "./api/session";
import * as settingsService from "./api/settings";
import namespace from "./namespace";

interface State extends BaseState {
  projectConfig: {
    title: string;
  };
  curUser: {
    uid: string;
    username: string;
  };
  loginError: string;
  loading: {
    global: string;
    login: string;
  };
}

const state: State = {
  projectConfig: {
    title: "aaaa"
  },
  curUser: {
    uid: "",
    username: ""
  },
  loginError: "",
  loading: {
    global: "Stop",
    login: "Stop"
  }
};

class ModuleActions extends BaseActions<State> {
  updateSettings = buildActionByReducer(function(settings: { title: string }, moduleState: State, rootState: any): State {
    return { ...moduleState, projectConfig: settings };
  });
  updateCurUser = buildActionByReducer(function(curUser: { uid: string; username: string }, moduleState: State, rootState: any): State {
    return { ...moduleState, curUser };
  });
  @buildLoading(namespace, "login")
  login = buildActionByEffect(function*({ username, password }: { username: string; password: string }): any {
    const curUser: sessionService.LoginResponse = yield call(sessionService.login, username, password);
    yield put(thisModule.actions.updateCurUser(curUser));
  });
}

class ModuleHandlers {
  "@@framework/ERROR" = buildActionByReducer(function({ message }, moduleState: State, rootState: any): State {
    console.log(message);
    return moduleState;
  });
  @buildLoading()
  "app/INIT" = buildActionByEffect(function*(data: State, moduleState: State, rootState: any): any {
    const config: settingsService.GetSettingsResponse = yield call(settingsService.getSettings);
    yield put(thisModule.actions.updateSettings(config));
    const curUser: sessionService.GetCurUserResponse = yield call(sessionService.getCurUser);
    yield put(thisModule.actions.updateCurUser(curUser));
  });
}

const model = buildModel(state, ModuleActions, ModuleHandlers);

export default model;

type Actions = typeof model.actions;

export { Actions, State };
