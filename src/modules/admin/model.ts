import { buildModel, buildState } from "react-coat";

interface InintState {
  user: {
    uid: string;
    userName: string;
    age: number;
  };
}

const state = buildState<InintState>({
  user: {
    age: 0,
    uid: "",
    userName: ""
  }
});

type State = typeof state;

const actions = {};

const handlers = {};

const model = buildModel(state, actions, handlers);

export default model;

type Actions = typeof model.actions;

export { Actions, State };
