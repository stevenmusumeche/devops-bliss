import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import analyticsMiddleware from "./redux/middleware/analytics";
import reducers from "./redux/reducers";

let reduxStore = null;

let devtools = f => f;
if (process.browser && window.__REDUX_DEVTOOLS_EXTENSION__) {
  devtools = window.__REDUX_DEVTOOLS_EXTENSION__();
}

function create(initialState = {}) {
  return createStore(
    combineReducers({ ...reducers }),
    initialState,
    compose(
      applyMiddleware(analyticsMiddleware),
      devtools
    )
  );
}

export function initStore(initialState) {
  // create a new store for every server side request
  if (!process.browser) {
    return create(initialState);
  }

  // reuse store on client
  if (!reduxStore) {
    reduxStore = create(initialState);
  }

  return reduxStore;
}
