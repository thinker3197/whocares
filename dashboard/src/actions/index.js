import store from "local-storage";
import Web3 from "web3";
import { message } from "antd";

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

export const fetchAllCampaigns = () => {
  return dispatch => {
    return API
      .getAllCampaigns()
      .then(res => {
        console.log(res);

        dispatch(fetchAllCampaignsSuccess(res.campaigns));
      })
      .catch(err => {
        throw err;
      });
  };
}

export const fetchAllCampaignsSuccess = (campaigns) => {
  return {
    type: "FETCH_ALL_CAMPAIGN_SUCCESS",
    campaigns
  };
}

export const fetchCurrentCampaigns = () => {
  return dispatch => {
    return API
      .getCurrentCampaigns()
      .then(res => {
        console.log(res);

        dispatch(fetchCurrentCampaignsSuccess(res.campaigns));
      })
      .catch(err => {
        throw err;
      });
  };
}

export const fetchCurrentCampaignsSuccess = (currentCampaigns) => {
  return {
    type: "FETCH_CURRENT_CAMPAIGN_SUCCESS",
    currentCampaigns
  };
}

export const createCampaign = (data) => {
  return dispatch => {
    return API
      .createCampaign(data)
      .then(res => {
        console.log(res);

        if(res.successful) {
          message.success("Campaign created successfully!");

          dispatch(fetchAllCampaigns());
          dispatch(fetchCurrentCampaigns());
        }
      })
      .catch(err => {
        throw err;
      });
  };
}

export const setWeb3 = () => {
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

export const fetchRankings = (name) => {
  return dispatch => {
    return API
      .getRankings(name)
      .then(res => {
        console.log(res);

        dispatch(fetchRankingsSuccess(res.stats));
      })
      .catch(err => {
        throw err;
      });
  };
}

export const fetchRankingsSuccess = (rankings) => {
  return {
    type: "FETCH_RANKINGS_SUCCESS",
    rankings
  };
}

export const fecthCampaignDetails = (name) => {
  return dispatch => {
    return API
      .getCampaignDetails(name)
      .then(res => {
        console.log(res);

        dispatch(fecthCampaignDetailsSuccess(res.campaign, res.user_stats ? res.user_stats[res.campaign.name] : res.campaign.stats));
      })
      .catch(err => {
        throw err;
      });
  };
}

export const fecthCampaignDetailsSuccess = (activeCampaign, activeStats) => {
  return {
    type: "FETCH_CAMPAIGN_DETAILS_SUCCESS",
    activeCampaign,
    activeStats
  };
}

export const joinCampaign = (name) => {
  return dispatch => {
    return API
    .joinCampaign(name)
    .then(res => {
      console.log(res);

      if(res.successful) {
        message.success("Campaign joined successfully!");

        dispatch(fetchAllCampaigns());
        dispatch(fetchCurrentCampaigns());
      }
    })
    .catch(err => {
      throw err;
    });
  };
}
