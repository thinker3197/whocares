import store from "local-storage";
import Web3 from "web3";

import API from "../services/api";
import { WHOCARES_TOKEN_KEY, WHOCARES_PROFILE_KEY } from "../constants";

export const login = (data) => {
  return dispatch => {
    return API
      .login(data)
      .then(res => {
        console.log(res);

        if(res.successful) {
          store(WHOCARES_TOKEN_KEY, res.token);
          store(WHOCARES_PROFILE_KEY, res.user);

          dispatch(loginSuccess(res.user));
        }
      })
      .catch(err => {
        throw err;
      });
  };
}

export const loginSuccess = (user) => {
  return {
    type: "LOGIN_SUCCESS",
    user
  };
}

export const restoreSession = () => {
  return dispatch => {
    const user = store(WHOCARES_PROFILE_KEY);

    if(user) {
      dispatch(loginSuccess(user));
    }
  };
}

export const fecthAllCampaigns = () => {
  return dispatch => {
    return API
      .getAllCampaigns()
      .then(res => {
        console.log(res);

        dispatch(fecthAllCampaignsSuccess(res.campaigns));
      })
      .catch(err => {
        throw err;
      });
  };
}

export const fecthAllCampaignsSuccess = (campaigns) => {
  return {
    type: "FETCH_ALL_CAMPAIGN_SUCCESS",
    campaigns
  };
}

export const setWeb3=()=>{
    var web3 = undefined;

    if(window.web3) {
        web3 = window.web3;
    }

    if (typeof web3 !== 'undefined') {
    web3 = new Web3(window.web3.currentProvider);
    } else {
    // Set the provider you want from Web3.providers (local not supported)
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

    return {
        type:"SET_WEB3",
        payload: web3
    }
}
