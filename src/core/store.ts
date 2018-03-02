import createHistory from "history/createBrowserHistory";
import { State as AppState } from "modules/app/facade";
import { setStore } from "react-coat";
import { routerMiddleware, routerReducer } from "react-router-redux";
import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import createSagaMiddleware from "redux-saga";

const history = createHistory();
const routingMiddleware = routerMiddleware(history);

const reducers = {
  router: routerReducer
};

const sagaMiddleware = createSagaMiddleware();

const middlewares = [routingMiddleware, sagaMiddleware];
let devtools = (options: any) => (noop: any) => noop;
if (process.env.NODE_ENV !== "production" && window["__REDUX_DEVTOOLS_EXTENSION__"]) {
  devtools = window["__REDUX_DEVTOOLS_EXTENSION__"];
}
const enhancers = [applyMiddleware(...middlewares), devtools(window["__REDUX_DEVTOOLS_EXTENSION__OPTIONS"])];

const store = createStore<{}>(combineReducers(reducers), {}, compose(...enhancers));

export default store;

setStore(store, reducers, history, sagaMiddleware.run);

export interface RootState {
  router: {
    location: {
      pathname: string;
      search: {};
      hash: string;
      key: string;
    };
  };
  project: {
    app: AppState;
  };
}
