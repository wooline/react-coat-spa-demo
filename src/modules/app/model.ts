import thisActions from "modules/app/facade";
import { extendActions, extendHandlers, extendState } from "react-coat";
import { call, put } from "redux-saga/effects";
import * as sessionService from "./dao/session";
import * as settingsService from "./dao/settings";

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
const inintState: InintState = {
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
};

const state = extendState(inintState);

const actions = extendActions(state, {
  updateSettings(settings: State["projectConfig"], moduleState: State = state, rootState?: any): State {
    return { ...moduleState, projectConfig: settings };
  },
  updateCurUser(curUser: State["curUser"], moduleState: State = state, rootState?: any): State {
    return { ...moduleState, curUser };
  },
  *_startup(data: State["projectConfig"], moduleState: State = state, rootState: any) {
    const config: settingsService.GetSettingsResponse = yield call(settingsService.getSettings);
    yield put(thisActions.updateSettings(config) as any);
    const curUser: sessionService.GetCurUserResponse = yield call(sessionService.getCurUser);
    yield put(thisActions.updateCurUser(curUser) as any);
  },
  *_login({ username, password }: { username: string; password: string }) {
    const curUser: sessionService.LoginResponse = yield call(sessionService.login, username, password);
    yield put(thisActions.updateCurUser(curUser) as any);
  }
});

const handlers = extendHandlers(state, {
  "@@framework/ERROR": function({ message }, moduleState: State = state, rootState?: any): State {
    alert(message);
    return moduleState;
  }
});

type State = typeof state;
type Actions = typeof actions;

export { actions, handlers, Actions, State };
