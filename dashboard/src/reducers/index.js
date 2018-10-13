import { combineReducers } from "redux";

import api from "./api.reducer";

const rootReducer = combineReducers({
  api
});

export default rootReducer;
