import thisModule from "modules/app";
import { buildActionByEffect, buildActionByReducer, buildModel, buildState } from "react-coat";
import { call, put } from "redux-saga/effects";
import * as sessionService from "./api/session";
import * as settingsService from "./api/settings";

interface InintState {
  projectConfig: {
    title: string;
  };
  curUser: {
    uid: string;
    username: string;
  };
  loginError: string;
  loading: {
    login: string;
  };
}

const state = buildState<InintState>({
  projectConfig: {
    title: "aaaa"
  },
  curUser: {
    uid: "",
    username: ""
  },
  loginError: "",
  loading: {
    login: ""
  }
});

type State = typeof state;

const actions = {
  updateSettings: buildActionByReducer(function(settings: State["projectConfig"], moduleState: State = state, rootState: any): State {
    return { ...moduleState, projectConfig: settings };
  }),
  updateCurUser: buildActionByReducer(function(curUser: State["curUser"], moduleState: State = state, rootState: any): State {
    return { ...moduleState, curUser };
  }),
  _startup: buildActionByEffect(function*(data: State["projectConfig"], moduleState: State = state, rootState: any): any {
    const config: settingsService.GetSettingsResponse = yield call(settingsService.getSettings);
    yield put(thisModule.actions.updateSettings(config));
    const curUser: sessionService.GetCurUserResponse = yield call(sessionService.getCurUser);
    yield put(thisModule.actions.updateCurUser(curUser));
  }),
  _login: buildActionByEffect(function*({ username, password }: { username: string; password: string }): any {
    const curUser: sessionService.LoginResponse = yield call(sessionService.login, username, password);
    yield put(thisModule.actions.updateCurUser(curUser));
  })
};

const handlers = {
  "@@framework/ERROR": function({ message }, moduleState: State, rootState?: any): State {
    alert(message);
    return moduleState;
  }
};

const model = buildModel(state, actions, handlers);

export default model;

type Actions = typeof model.actions;

export { Actions, State };
