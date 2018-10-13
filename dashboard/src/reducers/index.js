import { combineReducers } from "redux";

import api from "./api.reducer";
import web3Red from "./web3.reducer";

const rootReducer = combineReducers({
  api,
  web3Red
});

export default rootReducer;
