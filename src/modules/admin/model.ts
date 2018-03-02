import { extendActions, extendHandlers, extendState } from "react-coat";

interface InintState {
  user: {
    uid: string;
    userName: string;
    age: number;
  };
}
const inintState: InintState = {
  user: {
    age: 0,
    uid: "",
    userName: ""
  }
};

const state = extendState(inintState);

const actions = extendActions(state, {
  updateUser(user: State["user"], moduleState: State = state, rootState?: any): State {
    return { ...moduleState, user: { ...user } };
  },
  updateUserName(userName: string, moduleState: State = state, rootState?: any): State {
    return {
      ...moduleState,
      user: { ...moduleState.user, userName }
    };
  }
});

const handlers = extendHandlers(state, {});

type State = typeof state;
type Actions = typeof actions;

export { actions, handlers, Actions, State };
