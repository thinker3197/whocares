import { combineReducers } from "redux";

import api from "./api.reducer";
import web3Red from "./web3.reducer";
import user from "./user.reducer";

const rootReducer = combineReducers({
  api,
  web3Red,
  user
});

export default rootReducer;
